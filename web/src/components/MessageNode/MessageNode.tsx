import React, { useState } from "react";
import {
  MessageWithMedia,
  useGetUserByIdQuery,
  useMeQuery,
} from "../../generated/graphql";
import styles from "./MessageNode.module.scss";
import NextImage from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import FileDownloader from "../FileDownloader/FileDownloader";
import { getFullDate } from "../../utils/getFullDate";

interface Props {
  message: MessageWithMedia;
  newUser: boolean;
  myRef?: any;
  showTime?: boolean;
}

const MessageNode: React.FC<Props> = ({ message, newUser, myRef, showTime=false }) => {
  const [proportion, setProportion] = useState<number>(1);

  const { data: me } = useMeQuery();
  const { data: creator } = useGetUserByIdQuery({
    variables: { userId: message.message.creatorId },
  });

  let position = "flex-start";
  let backgroundColor = "#4C5057";
  if (me?.me?._id == message.message.creatorId) {
    position = "flex-end";
    backgroundColor = "#0e5bcf";
  }

  if (message.media) {
    let img = new Image();
    img.src = base64ToObjectURL(message.media);
    img.onload = () => {
      setProportion(img.height / img.width);
    };
  }

  let date = new Date(message.message.createdAt);

  return (
    <div
      className={styles.messageNode}
      ref={myRef || undefined}
      style={{
        alignSelf: position,
        justifyContent: position,
        marginTop: newUser ? "10px" : "4px",
        alignItems: position,
      }}
    >
      {showTime && <div className={styles.dayNote}>{getFullDate(date)}</div>}
      {(newUser || showTime ) && me?.me?._id != message.message.creatorId && (
        <div className={styles.creator}>{creator?.getUserById.user.name}</div>
      )}
      {message.message.text!.length > 0 && (
        <div className={styles.actualMessage} style={{ backgroundColor }}>
          {message.message.text}
        </div>
      )}
      {message.media && (
        <div className={styles.media}>
          <NextImage
            width={180}
            height={180 * proportion}
            src={base64ToObjectURL(message.media)}
          />
        </div>
      )}

      {message.file && message.message.fileData && (
        <FileDownloader
          href={message.file}
          fileData={message.message.fileData}
        />
      )}
    </div>
  );
};
export default MessageNode;
