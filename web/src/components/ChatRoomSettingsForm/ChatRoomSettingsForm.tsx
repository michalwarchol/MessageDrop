import { Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react'
import styles from "./ChatRoomSettingsForm.module.scss";
import { BsFillChatDotsFill } from 'react-icons/bs';
import { RoomAccess, useGetChatRoomByIdQuery, useUpdateChatRoomSettingsMutation } from '../../generated/graphql';
import { RoomContext } from '../../utils/RoomContext';
import Image from "next/image";
import { base64ToObjectURL } from '../../utils/base64ToObjectURL';
import { settingsUpdateChatRoom } from '../../cacheModifications/settingsUpdateChatRoom';
import InputField from '../InputField/InputField';
import InlineRadio from '../InlineRadio/InlineRadio';
import UploadField from '../UploadField/UploadField';
import Button from '../Button/Button';

const ChatRoomSettingsForm:React.FC = () => {
    const roomId = useContext(RoomContext);
    const { data } = useGetChatRoomByIdQuery({
        variables: { roomId }
      });
    const [updateChatRoomSettings] = useUpdateChatRoomSettingsMutation();

  const [description, setDescription] = useState<string | null>(null);
  const [access, setAccess] = useState<RoomAccess | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);

  useEffect(() => {
    if (data) {
      setDescription(data.getChatRoomById.chatRoom.description);
      setAccess(data.getChatRoomById.chatRoom.access);
    }
  }, [data]);

  let photoContent = (
    <div className={styles.photoFallback}>
      <BsFillChatDotsFill />
    </div>
  );
  if (data?.getChatRoomById.image) {
    photoContent = (
      <div className={styles.photoContent}>
        <Image
          src={base64ToObjectURL(data?.getChatRoomById.image)}
          width="200px"
          height="200px"
        />
      </div>
    );
  }
  if (uploadedPhoto) {
    photoContent = (
      <div className={styles.photoContent}>
        <Image
          src={URL.createObjectURL(uploadedPhoto)}
          width="200px"
          height="200px"
        />
      </div>
    );
  }
    return(
        <Formik
          initialValues={{}}
          onSubmit={async () => {
            let disabled = false;
            //check if any value has changed, so the apply button can be enabled
            if (
              description == data?.getChatRoomById.chatRoom.description &&
              access == data?.getChatRoomById.chatRoom.access &&
              uploadedPhoto == null
            ) {
              disabled = true;
            }

            if (disabled) {
              return;
            }

            await updateChatRoomSettings({
              variables: {
                roomId,
                settings: {
                  access: access || RoomAccess.Private,
                  description: description || "",
                },
                image: uploadedPhoto,
              },
              update: settingsUpdateChatRoom(roomId),
            });
          }}
        >
          {() => {
            let disabled = false;
            //check if any value has changed, so the apply button can be enabled
            if (
              description == data?.getChatRoomById.chatRoom.description &&
              access == data?.getChatRoomById.chatRoom.access &&
              uploadedPhoto == null
            ) {
              disabled = true;
            }
            return (
              <Form>
                <>
                <h1>Settings</h1>
                <div className={styles.regularField}>
                  <label className={styles.nameLabel} htmlFor="description">
                    description:
                  </label>
                  <InputField
                    name="description"
                    placeholder="description"
                    autoComplete="off"
                    value={description || ""}
                    onChange={(e) => {
                      setDescription(e.currentTarget.value);
                    }}
                  />
                </div>
                <div className={styles.regularField}>
                  <label className={styles.nameLabel} htmlFor="access">
                    access:
                  </label>
                  <div className={styles.radioButtons}>
                    <InlineRadio
                      name="access"
                      value={RoomAccess.Public}
                      checked={access == RoomAccess.Public}
                      onClick={() => {
                        setAccess(RoomAccess.Public);
                      }}
                    />
                    <InlineRadio
                      name="access"
                      value={RoomAccess.Restricted}
                      checked={access == RoomAccess.Restricted}
                      onClick={() => {
                        setAccess(RoomAccess.Restricted);
                      }}
                    />
                    <InlineRadio
                      name="access"
                      value={RoomAccess.Private}
                      checked={access == RoomAccess.Private}
                      onClick={() => {
                        setAccess(RoomAccess.Private);
                      }}
                    />
                  </div>
                </div>
                <div className={styles.regularField}>
                  <label className={styles.nameLabel} htmlFor="photo">
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
                <div className={styles.photo}>{photoContent}</div>
                <div className={styles.applyButton}>
                  <Button
                    text="Apply"
                    type="submit"
                    className={disabled ? styles.disabledButton : undefined}
                  />
                </div>
                </>
              </Form>
            );
          }}
        </Formik>
    )
}
export default ChatRoomSettingsForm;