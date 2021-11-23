import { ApolloCache } from "@apollo/client";
import {
  GetChatRoomUsersDocument,
  GetChatRoomUsersQuery,
  UserWithAvatar,
} from "../generated/graphql";
import {gql} from "graphql-tag";

export const acceptChatRequestUpdate = (
  id: string,
  roomId: string,
  userWithAvatar: UserWithAvatar
) => {
  return (cache: ApolloCache<any>, { data }: any) => {

    if (!data.acceptChatRequest) {
      return;
    }
    cache.evict({ id: "RequestWithUser:" + id });

    const chatRoom: any = cache.readFragment({
      id: "ChatRoom:" + roomId,
      fragment: gql`
        fragment _ on ChatRoom {
          _id
          userIds
        }
      `,
    });
    const users = cache.readQuery<GetChatRoomUsersQuery>({
      query: GetChatRoomUsersDocument,
      variables: { roomId },
    });

    const newUserIds = [...chatRoom.userIds, userWithAvatar.user._id];
    const newOthers = [...(users?.getChatRoomUsers.others || []), userWithAvatar];

    cache.writeFragment({
        id: "ChatRoom:" + roomId,
        fragment: gql`
          fragment ChangeUserPermissions on ChatRoom {
            userIds
          }
        `,
        data: { userIds: newUserIds },
      });
      cache.writeQuery<GetChatRoomUsersQuery>({
        query: GetChatRoomUsersDocument,
        variables: { roomId },
        data: {
          getChatRoomUsers: {
            ...users!.getChatRoomUsers,
            others: newOthers as UserWithAvatar[],
          },
        },
      });
  };
};
