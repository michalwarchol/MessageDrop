import React, { useContext, useState } from "react";
import styles from "./RoomSettings.module.scss";
import IconButton from "../IconButton/IconButton";
import Modal from "../Modal/Modal";
import { BsFillChatDotsFill, BsFillGearFill } from "react-icons/bs";
import { Form, Formik } from "formik";
import {
  RoomAccess,
  useGetChatRoomByIdQuery,
  useGetChatRoomUsersQuery,
  useMeQuery,
  useUpdateChatRoomSettingsMutation,
} from "../../generated/graphql";
import { RoomContext } from "../../utils/RoomContext";
import InputField from "../InputField/InputField";
import InlineRadio from "../InlineRadio/InlineRadio";
import UploadField from "../UploadField/UploadField";
import Image from "next/image";
import { base64ToObjectURL } from "../../utils/base64ToObjectURL";
import Button from "../Button/Button";
import UserNode from "../UserNode/UserNode";
import { Permissions } from "../../utils/UserPermissions";
import { settingsUpdateChatRoom } from "../../cacheModifications/settingsUpdateChatRoom";

const RoomSettings: React.FC = () => {
  const roomId = useContext(RoomContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data } = useGetChatRoomByIdQuery({ variables: { roomId } });
  const { data: users } = useGetChatRoomUsersQuery({ variables: { roomId } });
  const { data: me } = useMeQuery();
  const [updateChatRoomSettings] = useUpdateChatRoomSettingsMutation();

  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(
    null
  );

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

  return (
    <Modal
      triggers={<IconButton Icon={BsFillGearFill} variant="outline" />}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Settings"
      closeButton
    >
      <div className={styles.roomSettings}>
        <Formik
          initialValues={{
            description: data?.getChatRoomById.chatRoom.description,
            access: data?.getChatRoomById.chatRoom.access,
          }}
          onSubmit={async (values) => {
            let disabled = false;
            //check if any value has changed, so the apply button can be enabled
            if(values.description == data?.getChatRoomById.chatRoom.description && 
              values.access == data?.getChatRoomById.chatRoom.access &&
              uploadedPhoto==null){
                disabled = true;
              }

              if(disabled){
                return;
              }
              
              await updateChatRoomSettings({variables: {
                roomId,
                settings: {
                  access: values.access || RoomAccess.Private,
                  description: values.description || ""
                },
                image: uploadedPhoto
              },
            update: settingsUpdateChatRoom(roomId)})
          }}
        >
          {({ values }) => {
            let disabled = true;
            //check if any value has changed, so the apply button can be enabled
            if(values.description != data?.getChatRoomById.chatRoom.description || 
              values.access != data?.getChatRoomById.chatRoom.access ||
              uploadedPhoto!=null){
                disabled = false;
              }
            return(
            <Form>
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
              <div className={styles.photo}>{photoContent}</div>
              <div className={styles.applyButton}>
                <Button text="Apply" type="submit" className={disabled ? styles.disabledButton : undefined} />
              </div>
            </Form>
          )}}
        </Formik>
        {users && (
          <div className={styles.users}>
            <div>
              <h4>Admin:</h4>
              <UserNode
                myPermissions={Permissions.USER}
                userPermissions={Permissions.ADMIN}
                userWithAvatar={users?.getChatRoomUsers.admin}
              />
            </div>
            {users.getChatRoomUsers.mods.length > 0 && (
              <div>
                <h4>Moderators:</h4>
                <div>
                  {users.getChatRoomUsers.mods.map((elem, index) => {
                    if (elem.user._id == me?.me?._id) {
                      return (
                        <UserNode
                          userWithAvatar={elem}
                          key={index}
                          myPermissions={Permissions.USER}
                          userPermissions={Permissions.MOD}
                        />
                      );
                    }
                    return (
                      <UserNode
                        userWithAvatar={elem}
                        key={index}
                        myPermissions={
                          users.getChatRoomUsers.admin.user._id == me?.me?._id
                            ? Permissions.ADMIN
                            : Permissions.MOD
                        }
                        userPermissions={Permissions.MOD}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {users.getChatRoomUsers.others.length > 0 && (
              <div>
                <h4>Users:</h4>
                <div>
                  {users.getChatRoomUsers.others.map((elem, index) => (
                    <UserNode
                      userWithAvatar={elem}
                      key={index}
                      myPermissions={Permissions.ADMIN}
                      userPermissions={Permissions.USER}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
export default RoomSettings;
