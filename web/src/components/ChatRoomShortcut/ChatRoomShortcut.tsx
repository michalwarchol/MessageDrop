import React from "react";
import styles from "./ChatRoomShortcut.module.scss";
import { ChatRoomWithImage } from "../../generated/graphql";
import Image from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import { BsFillChatDotsFill } from "react-icons/bs";
import NextLink from "next/link";

interface Props {
  chatRoomWithImage: ChatRoomWithImage;
}

const ChatRoomShortCut: React.FC<Props> = ({ chatRoomWithImage }) => {

  return (
    <NextLink href={"/chatroom/"+chatRoomWithImage.chatRoom._id}>
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
    </div>
    </NextLink>
  );
};
export default ChatRoomShortCut;
