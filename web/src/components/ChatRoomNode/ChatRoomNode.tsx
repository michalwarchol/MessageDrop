import React from "react";
import styles from "./ChatRoomNode.module.scss";
import { ChatRoomWithImage } from "../../generated/graphql";
import Image from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import { BsFillChatDotsFill } from "react-icons/bs";

interface Props {
  chatRoomWithImage: ChatRoomWithImage;
  select(): void;
  isSelected: boolean;
}

const ChatRoomNode: React.FC<Props> = ({
  chatRoomWithImage,
  select,
  isSelected,
}) => {
  return (
    <div
      className={isSelected ? styles.selected : styles.chatRoomNode}
      onClick={select}
    >
      {chatRoomWithImage.image ? (
        <div className={styles.imageOrIcon}>
          <div className={styles.imageContainer}>
            <Image
              src={base64ToObjectURL(chatRoomWithImage.image)}
              width={60}
              height={60}
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
        <h4>{chatRoomWithImage.chatRoom.name}</h4>
        <h5>{chatRoomWithImage.chatRoom.description}</h5>
      </div>
    </div>
  );
};
export default ChatRoomNode;
