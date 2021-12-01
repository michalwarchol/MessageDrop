import { Form, Formik } from "formik";
import dynamic from "next/dynamic";
import React, { useContext, useRef, useState } from "react";
import styles from "./ChatForm.module.scss";
import { BsEmojiLaughingFill, BsFileImageFill, BsFillCursorFill, BsFillFileEarmarkCheckFill, BsFillFileEarmarkPlusFill } from "react-icons/bs";
import { useCreateMessageMutation } from "../../generated/graphql";
import { isServer } from "../../utils/isServer";
import { RoomContext } from "../../utils/RoomContext";
import IconButton from "../IconButton/IconButton";
import InputField from "../InputField/InputField";

const Picker = dynamic(() => import("emoji-picker-react"), {
    ssr: false,
  });


const ChatForm: React.FC = () => {
const roomId = useContext(RoomContext);
  const [text, setText] = useState<string>("");
  const [media, setMedia] = useState<File | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [createMessage, {loading}] = useCreateMessageMutation();

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onEmojiClick = (_: any, emojiObject: any) => {
    setText(text + emojiObject.emoji);
  };
  return (
    <Formik
      initialValues={{ text: "" }}
      onSubmit={async (_, { resetForm }) => {
        if ((!text && !file && !media) || loading) {
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
        if (mediaInputRef.current) {
          mediaInputRef.current.value = "";
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }}
    >
      {() => {
        let disabled = false;
        if ((!text && !media && !file) || loading) {
          disabled = true;
        }
        return (
          <Form className={styles.chatFormFields}>
            <div className={styles.inputs}>
              <InputField
                name="text"
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                placeholder="Write something..."
                autoComplete="off"
              />
              <label htmlFor="media">
                <IconButton
                  Icon={BsFileImageFill}
                  variant="outline"
                  className={
                    media ? styles.actionButtonActive : styles.actionButton
                  }
                  type="button"
                  onClick={() => {
                    if (media) {
                      setMedia(null);
                      if (mediaInputRef.current) {
                        mediaInputRef.current.value = "";
                      }
                    } else {
                      mediaInputRef.current?.click();
                    }
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
                  Icon={
                    file
                      ? BsFillFileEarmarkCheckFill
                      : BsFillFileEarmarkPlusFill
                  }
                  variant="outline"
                  className={
                    file ? styles.actionButtonActive : styles.actionButton
                  }
                  type="button"
                  onClick={() => {
                    if (file) {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    } else {
                      fileInputRef.current?.click();
                    }
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
                className={
                  showEmojiPicker
                    ? styles.actionButtonActive
                    : styles.actionButton
                }
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              />
              {isServer && (
                <div
                  className={styles.picker}
                  style={{
                    visibility: showEmojiPicker ? "visible" : "hidden",
                  }}
                >
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <IconButton
                Icon={BsFillCursorFill}
                variant="fill"
                type="submit"
                className={
                  disabled ? styles.sendButtonDisabled : styles.sendButton
                }
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
export default ChatForm;
