import { Formik, Form } from 'formik';
import React, { useState } from 'react'
import styles from "./CreateChatButton.module.scss";
import { BsPlus, BsFillChatDotsFill } from 'react-icons/bs';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import InlineRadio from '../InlineRadio/InlineRadio';
import InputField from '../InputField/InputField';
import Modal from '../Modal/Modal';
import Image from "next/image"
import UploadField from '../UploadField/UploadField';

const accessInfo: Record<string, string> = {
    public: "room open, evaryone can join",
    restricted: "room closed but visible, user sends request to join",
    private: "room hidden, admin sends invitations",
  };

const CreateChatButton:React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
    return(
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
                access: "public",
                photo: null,
              }}
              onSubmit={(values) => {
                console.log("submit", values);
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
                        value="public"
                        checked={values.access == "public"}
                      />
                      <InlineRadio
                        name="access"
                        id="restricted"
                        value="restricted"
                        checked={values.access == "restricted"}
                      />
                      <InlineRadio
                        name="access"
                        id="private"
                        value="private"
                        checked={values.access == "private"}
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
                    />
                    <Button
                      text="Cancel"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className={styles.rightButton}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Modal>
    )
}
export default CreateChatButton;