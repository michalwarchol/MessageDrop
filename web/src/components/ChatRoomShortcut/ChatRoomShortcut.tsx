import React from "react";
import styles from "./ChatRoomShortcut.module.scss";
import { ChatRoomWithImage } from "../../generated/graphql";
import Image from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import { BsFillChatDotsFill } from "react-icons/bs";

interface Props {
  chatRoomWithImage: ChatRoomWithImage;
}

const ChatRoomShortCut: React.FC<Props> = ({ chatRoomWithImage }) => {

  return (
    <div className={styles.chatRoomShortcut}>
      {chatRoomWithImage.image ? (
        <div className={styles.imageOrIcon}>
          <div className={styles.imageContainer}>
            <Image
              src={base64ToObjectURL(chatRoomWithImage.image)}
              width={50}
              height={50}
            />
          </div>
        </div>
      ) : (
        <div className={styles.imageOrIcon}>
          <div className={styles.imageContainer}>
            <BsFillChatDotsFill />
          </div>
        </div>
      )}
      <div className={styles.info}>
        <p className={styles.chatName}>{chatRoomWithImage.chatRoom.name}</p>
      </div>
      <div className={styles.chatRoomLabel}><p>{chatRoomWithImage.chatRoom.name}</p></div>
    </div>
  );
};
export default ChatRoomShortCut;
