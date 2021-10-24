import React from 'react'
import { Message } from '../../generated/graphql';
import styles from "./MessageNode.module.scss";

interface Props {
    message: Message;
}

const MessageNode:React.FC<Props> = ({message}) => {
    return(
        <div className={styles.messageNode}>
            {message.text}
        </div>
    )
}
export default MessageNode;