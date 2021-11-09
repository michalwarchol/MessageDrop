import React, { useContext } from "react";
import {
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
  const { data: users } = useGetChatRoomUsersQuery({ variables: { roomId } });
  const { data: me } = useMeQuery();

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
