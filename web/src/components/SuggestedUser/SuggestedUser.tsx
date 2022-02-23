import React, { useState } from "react";
import { UserWithAvatar } from "../../generated/graphql";
import styles from "./SuggestedUser.module.scss";
import Image from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import { FaUserAlt } from "react-icons/fa";
import ChooseChat from "../ChooseChat/ChooseChat";

interface Props {
  userWithAvatar: UserWithAvatar;
}

const SuggestedUser: React.FC<Props> = ({ userWithAvatar }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className={styles.suggestedUser}>
      {userWithAvatar.avatar ? (
        <div className={styles.imageOrIcon}>
          <div className={styles.imageContainer}>
            <Image
              src={base64ToObjectURL(userWithAvatar.avatar)}
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
      <div className={styles.info}>
        <p className={styles.chatName}>{userWithAvatar.user.name}</p>
        <ChooseChat
          userWithAvatar={userWithAvatar}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </div>
  );
};
export default SuggestedUser;
