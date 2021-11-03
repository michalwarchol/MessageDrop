import React from "react";
import styles from "./ChatSidebar.module.scss";
import Divider from "../Divider/Divider";
import CreateChatButton from "../CreateChatButton/CreateChatButton";
import { useGetUserChatRoomsQuery } from "../../generated/graphql";
import ChatRoomShortCut from "../ChatRoomShortcut/ChatRoomShortcut";

const ChatSidebar: React.FC = () => {

  const {data} = useGetUserChatRoomsQuery();

  return (
    <div className={styles.chatSidebar}>
      <div className={styles.create}>
        <CreateChatButton />
      </div>
      <Divider />
      <div className={styles.userRooms}>
        {data?.getUserChatRooms.map((elem, index) => (<ChatRoomShortCut chatRoomWithImage={elem} key={index} />))}
      </div>
    </div>
  );
};
export default ChatSidebar;
