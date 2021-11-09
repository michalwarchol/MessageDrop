import React, { useContext } from "react";
import { useGetChatRoomByIdQuery, useMeQuery } from "../../generated/graphql";
import { RoomContext } from "../../utils/RoomContext";
import styles from "./Chat.module.scss";
import IconButton from "../IconButton/IconButton";
import { BsFillChatDotsFill, BsFillGearFill } from "react-icons/bs";
import Image from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import MessagesSection from "../MessagesSection/MessagesSection";
import { useRouter } from "next/router";
import RoomRequests from "../RoomRequests/RoomRequests";
import SettingsSection from "../SettingsSection/SettingsSection";
import ChatForm from "../ChatForm/ChatForm";

const Chat: React.FC = () => {
  const roomId = useContext(RoomContext);
  const { data: room } = useGetChatRoomByIdQuery({ variables: { roomId } });
  const { data: me } = useMeQuery();

  const router = useRouter();

  return (
    <div className={styles.chat}>
      <div className={styles.chatInfo}>
        <div className={styles.chatInfoWrapper}>
          {room?.getChatRoomById.image ? (
            <div className={styles.imageOrIcon}>
              <div className={styles.imageContainer}>
                <Image
                  src={base64ToObjectURL(room.getChatRoomById.image)}
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
          <div className={styles.chatHeaders}>
            <p className={styles.chatName}>
              {room?.getChatRoomById.chatRoom.name}
            </p>
            <p className={styles.chatDescription}>
              {room?.getChatRoomById.chatRoom.description}
            </p>
          </div>
        </div>

        {((room && room?.getChatRoomById.chatRoom.adminId == me?.me?._id) ||
          room?.getChatRoomById.chatRoom.modIds.some(
            (id) => id == me?.me?._id
          )) && (
          <div className={styles.showSettings}>
            <RoomRequests />
            <IconButton
              Icon={BsFillGearFill}
              variant="outline"
              className={styles.openSettings}
              onClick={() => {
                router.push({
                  pathname: "/chatroom/[id]/settings",
                  query: { id: roomId },
                });
              }}
            />
          </div>
        )}
      </div>
      <div className={styles.content}>
        <MessagesSection />
        <SettingsSection />
      </div>
      <div className={styles.chatForm}>
        <ChatForm />
      </div>
    </div>
  );
};
export default Chat;
