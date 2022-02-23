import { Form, Formik } from "formik";
import React, { useState } from "react";
import styles from "./UserSettingsPasswordModal.module.scss";
import Button from "../Button/Button";
import InputField from "../InputField/InputField";
import Modal from "../Modal/Modal";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { BsShieldFillCheck } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import { useRouter } from "next/router";

interface Props {
  setSettingChangedInfo: React.Dispatch<
    React.SetStateAction<JSX.Element | null>
  >;
}

const UserSettingsPasswordModal: React.FC<Props> = ({
  setSettingChangedInfo,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [changePassword] = useChangePasswordMutation();

  const router = useRouter();

  return (
    <>
      <Button
        text="Change password"
        className={styles.triggerButton}
        Icon={RiLockPasswordLine}
        onClick={() => setIsOpen(!isOpen)}
      />

      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Change your password">
        <Formik
          initialValues={{
            password: "",
            new_password: "",
            repeat_new_password: "",
          }}
          onSubmit={async (values, { setErrors, resetForm }) => {
            if (Object.values(values).some((elem) => elem.length < 1)) {
              return;
            }

            if (values.new_password != values.repeat_new_password) {
              setErrors({
                repeat_new_password:
                  "Repeated password doesn't match new password",
              });
              return;
            }

            const response = await changePassword({
              variables: {
                old_password: values.password,
                new_password: values.new_password,
              },
            });

            if (response.data?.changePassword.errors) {
              setErrors(toErrorMap(response.data.changePassword.errors));
            }

            if (response.data?.changePassword.redirect) {
              router.replace("/login?next=" + router.pathname);
            }

            if (response.data?.changePassword.isOk) {
              setSettingChangedInfo(
                <h4>
                  <BsShieldFillCheck /> Password changed successfully!
                </h4>
              );
              resetForm();
              setIsOpen(false);
            }
          }}
        >
          {({ resetForm, values }) => {
            let className = styles.submitButtonDisabled;
            if (!Object.values(values).some((elem) => elem.length < 1)) {
              className = styles.submitButton;
            }
            return (
              <Form className={styles.userSettingsPassordModal}>
                <InputField
                  name="password"
                  placeholder="old password"
                  type="password"
                />
                <InputField
                  name="new_password"
                  placeholder="new password"
                  type="password"
                />
                <InputField
                  name="repeat_new_password"
                  placeholder="repeat new password"
                  type="password"
                />
                <div className={styles.buttons}>
                  <Button
                    text="Cancel"
                    variant="outline"
                    type="button"
                    onClick={() => {
                      resetForm();
                      setIsOpen(false);
                    }}
                  />
                  <Button
                    text="Change password"
                    type="submit"
                    className={className}
                  />
                </div>
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </>
  );
};
export default UserSettingsPasswordModal;
