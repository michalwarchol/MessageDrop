import { useApolloClient } from "@apollo/client";
import React, { useContext, useEffect } from "react";
import {
  ChatRoomWithImage,
  GetUserChatRoomsDocument,
  GetUserChatRoomsQuery,
  IsChatMemberDocument,
  IsChatMemberQuery,
  NewChatUsersDocument,
  NewChatUsersSubscription,
  NewChatUsersSubscriptionVariables,
  useGetChatRoomByIdQuery,
  useGetChatRoomUsersQuery,
  useMeQuery,
} from "../../generated/graphql";
import { RoomContext } from "../../utils/RoomContext";
import { Permissions } from "../../utils/UserPermissions";
import ChatRoomSettingsForm from "../ChatRoomSettingsForm/ChatRoomSettingsForm";
import UserNode from "../UserNode/UserNode";
import styles from "./SettingsSection.module.scss";

const SettingsSection: React.FC = () => {
  const roomId = useContext(RoomContext);
  const { data } = useGetChatRoomByIdQuery({
    variables: { roomId },
  });
  const { data: users, subscribeToMore } = useGetChatRoomUsersQuery({
    variables: { roomId },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-only"
  });
  const { data: me } = useMeQuery();
  const apolloClient = useApolloClient();

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

        if (
          prev.getChatRoomUsers.admin.user._id != me!.me!._id && 
          !newUserIds.find((elem) => elem == me!.me!._id) &&
          !newModIds.find((elem) => elem == me!.me!._id)
        ) {
          apolloClient.cache.writeQuery<IsChatMemberQuery>({
            variables: {roomId},
            query: IsChatMemberDocument,
            data: {
              isChatMember: false
            }
          });

          const myRooms = apolloClient.cache.readQuery<GetUserChatRoomsQuery>({
            query: GetUserChatRoomsDocument
          });
          let myNewRooms = myRooms?.getUserChatRooms.filter(elem=> elem.chatRoom._id != roomId);

          apolloClient.cache.writeQuery<GetUserChatRoomsQuery>({
            query: GetUserChatRoomsDocument,
            data: {
              getUserChatRooms: myNewRooms as ChatRoomWithImage[]
            }
          })
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

  return (
    <div className={styles.settingsSection}>
      <div className={styles.roomSettings}>
        {(data?.getChatRoomById.chatRoom.adminId == me?.me?._id ||
          data?.getChatRoomById.chatRoom.modIds.includes(
            me?.me?._id || ""
          )) && <ChatRoomSettingsForm />}
        {users && (
          <div className={styles.users}>
            <h1>Users</h1>
            <div>
              <h4>Admin:</h4>
              <UserNode
                myPermissions={Permissions.USER}
                userPermissions={Permissions.ADMIN}
                userWithAvatar={users?.getChatRoomUsers.admin}
              />
            </div>
            {users.getChatRoomUsers.mods.length > 0 && (
              <div>
                <h4>Moderators:</h4>
                <div className={styles.usersList}>
                  {users.getChatRoomUsers.mods.map((elem, index) => {
                    if (elem.user._id == me?.me?._id) {
                      return (
                        <UserNode
                          userWithAvatar={elem}
                          key={index}
                          myPermissions={Permissions.USER}
                          userPermissions={Permissions.MOD}
                        />
                      );
                    }

                    let permissions = Permissions.USER;
                    if (data?.getChatRoomById.chatRoom.adminId == me?.me?._id) {
                      permissions = Permissions.ADMIN;
                    }

                    return (
                      <UserNode
                        userWithAvatar={elem}
                        key={index}
                        myPermissions={permissions}
                        userPermissions={Permissions.MOD}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {users.getChatRoomUsers.others.length > 0 && (
              <div>
                <h4>Others:</h4>
                <div className={styles.usersList}>
                  {users.getChatRoomUsers.others.map((elem, index) => {
                    let permissions = Permissions.USER;
                    if (data?.getChatRoomById.chatRoom.adminId == me?.me?._id) {
                      permissions = Permissions.ADMIN;
                    }
                    if (
                      data?.getChatRoomById.chatRoom.modIds.includes(
                        me?.me?._id || ""
                      )
                    ) {
                      permissions = Permissions.ADMIN;
                    }

                    return (
                      <UserNode
                        userWithAvatar={elem}
                        key={index}
                        myPermissions={permissions}
                        userPermissions={Permissions.USER}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default SettingsSection;
