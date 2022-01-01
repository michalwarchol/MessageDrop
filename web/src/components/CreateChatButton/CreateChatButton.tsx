import { Formik, Form } from "formik";
import React, { useState } from "react";
import styles from "./CreateChatButton.module.scss";
import { BsPlus, BsFillChatDotsFill } from "react-icons/bs";
import Button from "../Button/Button";
import IconButton from "../IconButton/IconButton";
import InlineRadio from "../InlineRadio/InlineRadio";
import InputField from "../InputField/InputField";
import Modal from "../Modal/Modal";
import Image from "next/image";
import UploadField from "../UploadField/UploadField";
import { RoomAccess, useCreateChatRoomMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";

const accessInfo: Record<string, string> = {
  public: "room open, evaryone can join",
  restricted: "room closed but visible, user sends request to join",
  private: "room hidden, admin sends invitations",
};

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateChatButton: React.FC<Props> = ({isOpen, setIsOpen}) => {
  
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [createChatRoom, {loading}] = useCreateChatRoomMutation();

  return (
    <Modal
      closeButton
      title="Create Chat Room"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      triggers={
        <>
          <Button
            text="Create chat"
            Icon={BsPlus}
            variant="outline"
            className={styles.createButton}
          />
          <IconButton
            Icon={BsPlus}
            className={styles.createIconButton}
            variant="outline"
          />
        </>
      }
    >
      <div className={styles.creator}>
        <Formik
          initialValues={{
            name: "",
            description: "",
            access: RoomAccess.Public,
          }}
          onSubmit={async (values, { setErrors }) => {
            const chatRoomResponse = await createChatRoom({
              variables: { input: { ...values }, image: uploadedPhoto }
            });

            if (chatRoomResponse.data?.createChatRoom.errors) {
              setErrors(
                toErrorMap(chatRoomResponse.data?.createChatRoom.errors)
              );
            } else if (chatRoomResponse.data?.createChatRoom.chatRoom) {
              setUploadedPhoto(null);
              setIsOpen(false);
            }
          }}
        >
          {({ values }) => (
            <Form>
              <div className={styles.regularField}>
                <label className={styles.nameLabel} htmlFor="name">
                  name:
                </label>
                <InputField
                  name="name"
                  id="name"
                  placeholder="name"
                  autoComplete="off"
                />
              </div>
              <div className={styles.regularField}>
                <label className={styles.nameLabel} htmlFor="description">
                  description:
                </label>
                <InputField
                  name="description"
                  id="description"
                  placeholder="description"
                  autoComplete="off"
                />
              </div>
              <div className={styles.regularField}>
                <label className={styles.nameLabel} htmlFor="access">
                  access:
                </label>
                <div className={styles.radioButtons}>
                  <InlineRadio
                    name="access"
                    id="public"
                    value={RoomAccess.Public}
                    checked={values.access == RoomAccess.Public}
                  />
                  <InlineRadio
                    name="access"
                    id="restricted"
                    value={RoomAccess.Restricted}
                    checked={values.access == RoomAccess.Restricted}
                  />
                  <InlineRadio
                    name="access"
                    id="private"
                    value={RoomAccess.Private}
                    checked={values.access == RoomAccess.Private}
                  />
                </div>
              </div>
              <div className={styles.accessInfo}>
                {accessInfo[values.access]}
              </div>
              <div className={styles.regularField}>
                <label className={styles.nameLabel} htmlFor="description">
                  photo:
                </label>
                <UploadField
                  name="photo"
                  id="photo"
                  text="Browse"
                  accept="image/png, image/jpeg"
                  onChange={(e) => {
                    setUploadedPhoto(e.target.files![0]);
                  }}
                />
              </div>
              <div className={styles.photo}>
                {uploadedPhoto ? (
                  <div className={styles.photoContent}>
                    <Image
                      src={URL.createObjectURL(uploadedPhoto)}
                      width="200px"
                      height="200px"
                    />
                  </div>
                ) : (
                  <div className={styles.photoFallback}>
                    <BsFillChatDotsFill />
                  </div>
                )}
              </div>

              <div className={styles.buttons}>
                <Button
                  text="Create"
                  type="submit"
                  className={styles.leftButton}
                  loading={loading}
                />
                <Button
                  text="Cancel"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setUploadedPhoto(null);
                  }}
                  className={styles.rightButton}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
export default CreateChatButton;
