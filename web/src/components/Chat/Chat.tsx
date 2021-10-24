import React, { useContext, useRef, useState } from "react";
import {
  useCreateMessageMutation,
  useGetChatRoomByIdQuery,
  useGetRoomMessagesQuery,
} from "../../generated/graphql";
import { RoomContext } from "../../utils/RoomContext";
import Wrapper from "../Wrapper/Wrapper";
import styles from "./Chat.module.scss";
import { Formik, Form } from "formik";
import InputField from "../InputField/InputField";
import IconButton from "../IconButton/IconButton";
import {
  BsFileImageFill,
  BsEmojiLaughingFill,
  BsFillChatDotsFill,
  BsFillFileEarmarkPlusFill,
} from "react-icons/bs";
import Image from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import MessageNode from "../MessageNode/MessageNode";

const Chat: React.FC = () => {

  const roomId = useContext(RoomContext);

  const [text, setText] = useState<string>("");
  const [media, setMedia] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [variables, setVariables] = useState({limit: 2, roomId, skip: null});

  const { data: room } = useGetChatRoomByIdQuery({ variables: { roomId } });
  const { data, fetchMore } = useGetRoomMessagesQuery({variables});
  const [createMessage] = useCreateMessageMutation();

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Wrapper size="md">
      <div className={styles.chat}>
        <div className={styles.chatInfo}>
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
        <div className={styles.chatMessages}>
          {data && data.getRoomMessages.messages.map((elem, index)=>(
            <MessageNode message={elem} key={index} />
          ))}
          <button onClick={()=>{
            fetchMore({variables: {
              roomId,
              limit: 2,
              skip: data?.getRoomMessages.messages.length
            }})
          }}>load more</button>
        </div>
        <div className={styles.chatForm}>
          <Formik
            initialValues={{}}
            onSubmit={async () => {
              if (!text && !file && !media) {
                return;
              }

              await createMessage({
                variables: {
                  roomId,
                  text,
                },
              });
            }}
          >
            {() => (
              <Form className={styles.chatFormFields}>
                <InputField
                  name="text"
                  value={text}
                  onChange={(e) => setText(e.currentTarget.value)}
                  placeholder="Write something..."
                />
                <label htmlFor="media">
                  <IconButton
                    Icon={BsFileImageFill}
                    variant="outline"
                    className={styles.actionButton}
                    onClick={() => {
                      mediaInputRef.current?.click();
                    }}
                  />
                  <input
                    type="file"
                    id="media"
                    accept="image/png, image/jpeg"
                    ref={mediaInputRef}
                    className={styles.fileInput}
                    onChange={(e) => {
                      if(e.target.files!=null)
                        setMedia(e.target.files[0])
                    }}
                  />
                </label>
                <label htmlFor="file">
                  <IconButton
                    Icon={BsFillFileEarmarkPlusFill}
                    variant="outline"
                    className={styles.actionButton}
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                  />
                  <input
                    type="file"
                    id="file"
                    ref={fileInputRef}
                    className={styles.fileInput}
                    onChange={(e) => {
                      if(e.target.files!=null)
                        setFile(e.target.files[0])
                    }}
                  />
                </label>
                <IconButton
                  Icon={BsEmojiLaughingFill}
                  variant="outline"
                  className={styles.actionButton}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Wrapper>
  );
};
export default Chat;
