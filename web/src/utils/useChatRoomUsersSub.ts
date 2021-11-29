import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";
import {
  IsChatMemberDocument,
  IsChatMemberQuery,
  NewChatUsersDocument,
  NewChatUsersSubscription,
  NewChatUsersSubscriptionVariables,
  useGetChatRoomUsersQuery,
  useMeQuery,
} from "../generated/graphql";

export const useChatRoomUsersSub = (roomId: string) => {
  const apolloClient = useApolloClient();
  const { data: me } = useMeQuery();
  const { subscribeToMore } = useGetChatRoomUsersQuery({
    variables: { roomId },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-only",
  });

  useEffect(() => {
    subscribeToMore<
      NewChatUsersSubscription,
      NewChatUsersSubscriptionVariables
    >({
      document: NewChatUsersDocument,
      variables: { roomId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        const newUserIds = subscriptionData.data.newChatUsers.userIds;
        const newModIds = subscriptionData.data.newChatUsers.modIds;

        //if there is no me._id in users redirect me to home and update cache
        if (
          prev.getChatRoomUsers.admin.user._id != me!.me!._id &&
          !newUserIds.find((elem) => elem == me!.me!._id) &&
          !newModIds.find((elem) => elem == me!.me!._id)
        ) {
          apolloClient.cache.writeQuery<IsChatMemberQuery>({
            variables: { roomId },
            query: IsChatMemberDocument,
            data: {
              isChatMember: false,
            },
          });
        }

        //get only existing users
        let others = prev.getChatRoomUsers.others.filter((elem) =>
          newUserIds.includes(elem.user._id)
        );
        let mods = prev.getChatRoomUsers.mods.filter((elem) =>
          newModIds.includes(elem.user._id)
        );

        //get missing ids
        const missingOthers = newUserIds.filter(
          (elem) => !others.find((user) => user.user._id == elem)
        );
        const missingMods = newModIds.filter(
          (elem) => !mods.find((user) => user.user._id == elem)
        );

        //add missing ids
        others = others.concat(
          prev.getChatRoomUsers.mods.filter((elem) =>
            missingOthers.find((id) => id == elem.user._id)
          )
        );
        mods = mods.concat(
          prev.getChatRoomUsers.others.filter((elem) =>
            missingMods.find((id) => id == elem.user._id)
          )
        );

        //add a new user
        if (subscriptionData.data.newChatUsers.newUser) {
          let newUser = subscriptionData.data.newChatUsers.newUser;
          if (newUserIds.includes(newUser.user._id)) {
            others.push(newUser);
          } else if (newModIds.includes(newUser.user._id)) {
            mods.push(newUser);
          }
        }

        return {
          getChatRoomUsers: {
            admin: prev.getChatRoomUsers.admin,
            mods,
            others,
          },
          __typename: prev.__typename,
        };
      },
    });
  }, []);
};
