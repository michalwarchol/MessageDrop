import React, { useState } from "react";
import styles from "./ChatSidebar.module.scss";
import Divider from "../Divider/Divider";
import CreateChatButton from "../CreateChatButton/CreateChatButton";
import { useGetUserChatRoomsQuery } from "../../generated/graphql";
import ChatRoomShortCut from "../ChatRoomShortcut/ChatRoomShortcut";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";

const ChatSidebar: React.FC = () => {
  const { data, loading } = useGetUserChatRoomsQuery();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className={styles.chatSidebar} style={{ zIndex: isOpen ? 99 : 1 }}>
      <div className={styles.create}>
        <CreateChatButton isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <Divider />
      <div className={styles.userRooms}>
        {!data && loading && (
          <div className={styles.loading}>
            <LoadingIndicator />
          </div>
        )}

        {data?.getUserChatRooms
          .map((elem, index) => (
            <ChatRoomShortCut chatRoomWithImage={elem} key={index} />
          ))
          .reverse()}

        {data && data.getUserChatRooms.length < 1 && !loading && (
          <div className={styles.loading}>Your rooms</div>
        )}
      </div>
    </div>
  );
};
export default ChatSidebar;
