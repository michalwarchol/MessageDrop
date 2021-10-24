import React from 'react'
import styles from "./ChatRoomContent.module.scss";
import Chat from '../Chat/Chat';

const ChatRoomContent:React.FC = () => {
    return(
        <div className={styles.chatRoomContent}>
            <Chat />
        </div>
    )
}
export default ChatRoomContent;