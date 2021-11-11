import React from "react";
import styles from "./UserSettingsContent.module.scss";
import { useGetUserAvatarQuery, useMeQuery } from "../../generated/graphql";
import Image from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import { FaUserAlt } from "react-icons/fa";
import UserSettingsPasswordModal from "../UserSettingsPasswordModal/UserSettingsPasswordModal";

const UserSettingsContent: React.FC = () => {
  const { data: me } = useMeQuery();
  const { data: avatar } = useGetUserAvatarQuery({
    variables: { avatarId: me?.me?.avatarId },
    skip: !me || !me?.me?.avatarId,
  });
  return (
    <div className={styles.userSettingsContent}>
      <div className={styles.userInfo}>
        {avatar?.getUserAvatar ? (
          <div className={styles.imageOrIcon}>
            <div className={styles.imageContainer}>
              <Image
                src={base64ToObjectURL(avatar?.getUserAvatar)}
                width={100}
                height={100}
              />
            </div>
          </div>
        ) : (
          <div className={styles.imageOrIcon}>
            <div className={styles.imageContainer}>
              <FaUserAlt />
            </div>
          </div>
        )}
        <div className={styles.userHeaders}>
          <h3>
            <span>name: </span>
            {me?.me?.name}
          </h3>
          <h3>
            <span>email: </span>
            {me?.me?.email}
          </h3>
          <h3>
            <span>phone: </span>
            {me?.me?.phone}
          </h3>
        </div>
      </div>

      <div className={styles.editSection}>
        <h2>Settings</h2>
        <div className={styles.dataChanges}>
          <UserSettingsPasswordModal />
        </div>
      </div>
    </div>
  );
};
export default UserSettingsContent;
