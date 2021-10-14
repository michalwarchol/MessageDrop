import React from "react";
import styles from "./ChatSidebar.module.scss";
import Divider from "../Divider/Divider";
import CreateChatButton from "../CreateChatButton/CreateChatButton";

const ChatSidebar: React.FC = () => {
  return (
    <div className={styles.chatSidebar}>
      <div className={styles.create}>
        <CreateChatButton />
      </div>
      <Divider />
    </div>
  );
};
export default ChatSidebar;
