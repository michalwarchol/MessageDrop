import React from "react";
import styles from "./ChatSidebar.module.scss";
import Divider from "../Divider/Divider";
import CreateChatButton from "../CreateChatButton/CreateChatButton";
import { useGetCreatorChatRoomsQuery } from "../../generated/graphql";
import ChatRoomShortCut from "../ChatRoomShortcut/ChatRoomShortcut";

const ChatSidebar: React.FC = () => {

  const {data} = useGetCreatorChatRoomsQuery();

  return (
    <div className={styles.chatSidebar}>
      <div className={styles.create}>
        <CreateChatButton />
      </div>
      <Divider />
      <div><p>Your chats</p></div>
      <div className={styles.userRooms}>
        {data?.getCreatorChatRooms.map((elem, index) => (<ChatRoomShortCut chatRoomWithImage={elem} key={index} />))}
      </div>
    </div>
  );
};
export default ChatSidebar;
