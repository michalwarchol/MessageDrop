import React from "react";
import styles from "./UserSettingsContent.module.scss";
import { useGetUserAvatarQuery, useMeQuery, useSetUserAvatarMutation } from "../../generated/graphql";
import Image from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import { FaUserAlt } from "react-icons/fa";
import { AiFillCamera } from "react-icons/ai";
import UserSettingsPasswordModal from "../UserSettingsPasswordModal/UserSettingsPasswordModal";
import { setUserAvatarUpdate } from "../../cacheModifications/setUserAvatarUpdate";

const UserSettingsContent: React.FC = () => {
  const { data: me } = useMeQuery();
  const { data: avatar } = useGetUserAvatarQuery({
    variables: { avatarId: me?.me?.avatarId },
    skip: !me || !me?.me?.avatarId,
  });
  const [setUserAvatar] = useSetUserAvatarMutation();

  return (
    <div className={styles.userSettingsContent}>
      <div className={styles.userInfo}>
        {avatar?.getUserAvatar ? (
          <label className={styles.imageOrIcon} htmlFor="avatar">
            <div className={styles.imageContainer}>
              <Image
                src={base64ToObjectURL(avatar?.getUserAvatar)}
                width={200}
                height={200}
              />
              <div className={styles.avatarHover}>
                <AiFillCamera />
                <input
                  type="file"
                  id="avatar"
                  className={styles.fileInput}
                  onChange={async (e) => {
                    if(e.currentTarget.files)
                    await setUserAvatar({variables: {avatar: e.currentTarget.files[0]},
                    update: setUserAvatarUpdate(me!.me!._id, me!.me!.avatarId||null)})
                  }}
                />
              </div>
            </div>
          </label>
        ) : (
          <label className={styles.imageOrIcon} htmlFor="avatar">
            <div className={styles.imageContainer}>
              <FaUserAlt />
              <div className={styles.avatarHover}>
                <AiFillCamera />
                <input
                  type="file"
                  id="avatar"
                  className={styles.fileInput}
                  onChange={async (e) => {
                    if(e.currentTarget.files)
                    await setUserAvatar({variables: {avatar: e.currentTarget.files[0]},
                    update: setUserAvatarUpdate(me!.me!._id, me!.me!.avatarId||null)})
                  }}
                />
              </div>
            </div>
          </label>
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
