import React, { useContext, useState } from "react";
import styles from "./UserNode.module.scss";
import {
  useChangeUserRoomPermissionsMutation,
  useKickUserMutation,
  UserWithAvatar,
} from "../../generated/graphql";
import Image from "next/image";
import Button from "../Button/Button";
import { Permissions } from "../../utils/UserPermissions";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import { FaUserAlt } from "react-icons/fa";
import { RoomContext } from "../../utils/RoomContext";
import { settingsKickUser } from "../../cacheModifications/settingsKickUser";
import { settingsPromoteDemoteUser } from "../../cacheModifications/settingsPromoteDemoteUser";
import IconButton from "../IconButton/IconButton";
import { BsThreeDots } from "react-icons/bs";

interface Props {
  userWithAvatar: UserWithAvatar;
  myPermissions: Permissions;
  userPermissions: Permissions;
}

const UserNode: React.FC<Props> = ({
  userWithAvatar,
  myPermissions,
  userPermissions,
}) => {
  const roomId = useContext(RoomContext);
  const [kickUser] = useKickUserMutation();
  const [changeUserRoomPermissions] = useChangeUserRoomPermissionsMutation();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const changePermissions = async () => {
    await changeUserRoomPermissions({
      variables: {
        roomId,
        userId: userWithAvatar.user._id,
        expectToBeMod: userPermissions == Permissions.MOD,
      },
      update: settingsPromoteDemoteUser(roomId, userWithAvatar.user._id),
    });

    setSettingsOpen(false);
  };

  const kick = async () => {
    await kickUser({
      variables: { roomId, userId: userWithAvatar.user._id },
      update: settingsKickUser(roomId, userWithAvatar.user._id),
    });
  };

  let buttons = null;
  if (myPermissions == Permissions.ADMIN) {
    buttons = (
      <div className={styles.buttons}>
        {userPermissions == Permissions.USER ? (
          <Button text="Promote To Mod" onClick={changePermissions} />
        ) : (
          <Button text="Demote To User" onClick={changePermissions} />
        )}

        <Button text="Kick" className={styles.kickButton} onClick={kick} />
      </div>
    );
  }

  return (
    <div className={styles.userNode}>
      <div className={styles.info}>
        <div className={styles.image}>
          <div className={styles.imageContainer}>
            {userWithAvatar.avatar ? (
              <Image
                height={50}
                width={50}
                src={base64ToObjectURL(userWithAvatar.avatar)}
              />
            ) : (
              <div className={styles.imageFallback}>
                <FaUserAlt />
              </div>
            )}
          </div>
        </div>
        <div className={styles.username}>
          <h5>{userWithAvatar.user.name}</h5>
        </div>
      </div>
      <div className={styles.actions}>
        {myPermissions != Permissions.USER && (
          <IconButton
            Icon={BsThreeDots}
            variant="outline"
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={settingsOpen ? styles.open : undefined}
          />
        )}

        {settingsOpen && buttons}
      </div>
    </div>
  );
};
export default UserNode;
