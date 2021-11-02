import React, { useContext, useEffect, useRef, useState } from "react";
import {
  useCreateMessageMutation,
  useGetChatRoomByIdQuery,
  useMeQuery,
} from "../../generated/graphql";
import { RoomContext } from "../../utils/RoomContext";
import styles from "./Chat.module.scss";
import { Formik, Form } from "formik";
import InputField from "../InputField/InputField";
import IconButton from "../IconButton/IconButton";
import {
  BsFileImageFill,
  BsEmojiLaughingFill,
  BsFillChatDotsFill,
  BsFillFileEarmarkPlusFill,
  BsFillCursorFill,
  BsFillGearFill,
} from "react-icons/bs";
import Image from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import MessagesSection from "../MessagesSection/MessagesSection";
import RoomSettings from "../RoomSettings/RoomSettings";
import { useRouter } from "next/router";
import { isServer } from "../../utils/isServer";

const Chat: React.FC = () => {
  const roomId = useContext(RoomContext);

  const [text, setText] = useState<string>("");
  const [media, setMedia] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const { data: room } = useGetChatRoomByIdQuery({ variables: { roomId } });
  const { data: me } = useMeQuery();
  const [createMessage] = useCreateMessageMutation();

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const [windowHeight, setWindowHeight] = useState<number>(isServer ? window.innerHeight : 0);

  const resize = () => {
    setWindowHeight(window.innerHeight)
  }
  useEffect(()=>{
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    }
  }, [])
  
  return (
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
        {((room && room?.getChatRoomById.chatRoom.adminId == me?.me?._id) ||
          room?.getChatRoomById.chatRoom.modIds.some(
            (id) => id == me?.me?._id
          )) && (
          <div className={styles.showSettings}>
            {windowHeight > 900 ? (
              <RoomSettings />
            ) : (
              <IconButton
                Icon={BsFillGearFill}
                variant="outline"
                onClick={() => {
                  router.push({
                    pathname: "/chatroom/[id]/settings",
                    query: { id: roomId },
                  });
                }}
              />
            )}
          </div>
        )}
      </div>
      <MessagesSection />
      <div className={styles.chatForm}>
        <Formik
          initialValues={{ text: "" }}
          onSubmit={async (_, { resetForm }) => {
            if (!text && !file && !media) {
              return;
            }

            await createMessage({
              variables: {
                roomId,
                text,
                media,
                file,
              },
            });
            resetForm();
            setText("");
            setMedia(null);
            setFile(null);
          }}
        >
          {() => (
            <Form className={styles.chatFormFields}>
              <div className={styles.inputs}>
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
                    type="button"
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
                      if (e.target.files != null) setMedia(e.target.files[0]);
                    }}
                  />
                </label>
                <label htmlFor="file">
                  <IconButton
                    Icon={BsFillFileEarmarkPlusFill}
                    variant="outline"
                    className={styles.actionButton}
                    type="button"
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
                      if (e.target.files != null) setFile(e.target.files[0]);
                    }}
                  />
                </label>
                <IconButton
                  Icon={BsEmojiLaughingFill}
                  variant="outline"
                  type="button"
                  className={styles.actionButton}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />
                <IconButton
                  Icon={BsFillCursorFill}
                  variant="fill"
                  type="submit"
                  className={styles.sendButton}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default Chat;
