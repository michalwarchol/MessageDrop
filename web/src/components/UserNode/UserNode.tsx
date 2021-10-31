import React from "react";
import styles from "./UserNode.module.scss";
import { UserWithAvatar } from "../../generated/graphql";
import Image from "next/image";
import Button from "../Button/Button";
import { Permissions } from "../../utils/UserPermissions";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import { FaUserAlt } from "react-icons/fa";

interface Props {
  userWithAvatar: UserWithAvatar;
  permissions: Permissions;
}

const UserNode: React.FC<Props> = ({ userWithAvatar, permissions }) => {
  let buttons = null;

  if (permissions == Permissions.ADMIN) {
    buttons = (
      <div className={styles.buttons}>
        <Button text="Promote To Mod" />
        <Button text="Kick" className={styles.kickButton} />
      </div>
    );
  }

  if (permissions == Permissions.MOD) {
    buttons = (
      <div>
        <Button text="kick" className={styles.kickButton} />
      </div>
    );
  }

  return (
    <div className={styles.userNode}>
      <div className={styles.info}>
        <div className={styles.image}>
          <div>
            {userWithAvatar.avatar ? (
              <Image src={base64ToObjectURL(userWithAvatar.avatar)} />
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
      <div className={styles.actions}>{buttons}</div>
    </div>
  );
};
export default UserNode;
