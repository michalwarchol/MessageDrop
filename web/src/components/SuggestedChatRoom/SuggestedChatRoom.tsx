import React from "react";
import styles from "./SuggestedChatRoom.module.scss";
import {
  ChatRoomWithImage,
  RoomAccess,
  useJoinRoomMutation,
} from "../../generated/graphql";
import Image from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import { BsFillChatDotsFill } from "react-icons/bs";
import { FiUserPlus, FiMail } from "react-icons/fi";
import Button from "../Button/Button";

interface Props {
  chatRoomWithImage: ChatRoomWithImage;
}

const SuggestedChatRoom: React.FC<Props> = ({ chatRoomWithImage }) => {
  const [joinRoom, { loading }] = useJoinRoomMutation();

  const handleJoinRoom = async () => {
    await joinRoom({
      variables: {
        roomId: chatRoomWithImage.chatRoom._id,
      },
    });
  };

  return (
    <div className={styles.suggestedChatRoom}>
      {chatRoomWithImage.image ? (
        <div className={styles.imageOrIcon}>
          <div className={styles.imageContainer}>
            <Image
              src={base64ToObjectURL(chatRoomWithImage.image)}
              width={100}
              height={100}
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
        <p className={styles.chatDescription}>
          {chatRoomWithImage.chatRoom.description}
        </p>
        <Button
          className={styles.joinButton}
          text={
            chatRoomWithImage.chatRoom.access == RoomAccess.Public
              ? "Join"
              : "Send a request"
          }
          Icon={
            chatRoomWithImage.chatRoom.access == RoomAccess.Public
              ? FiUserPlus
              : FiMail
          }
          loading={loading}
          onClick={
            chatRoomWithImage.chatRoom.access == RoomAccess.Public
              ? handleJoinRoom
              : () => console.log("send request")
          }
        />
      </div>
    </div>
  );
};
export default SuggestedChatRoom;
