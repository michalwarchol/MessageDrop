import React, { useState } from "react";
import styles from "./UserSettingsEmailModal.module.scss";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import InputField from "../InputField/InputField";
import CodeVerification from "../CodeVerification/CodeVerification";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRequestEmailUpdateMutation } from "../../generated/graphql";
import { AiFillMail } from "react-icons/ai";

const UserSettingsEmailModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const [requestEmailUpdate, { loading }] = useRequestEmailUpdateMutation();

  const router = useRouter();
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Change your email"
      triggers={
        <Button
          text="Change email"
          className={styles.triggerButton}
          Icon={AiFillMail}
        />
      }
    >
      {success ? (
        <CodeVerification
          setIsOpen={setIsOpen}
          setSuccess={setSuccess}
          phoneOrEmail="email"
        />
      ) : (
        <Formik
          initialValues={{
            password: "",
            email: "",
          }}
          onSubmit={async (values, { setErrors, resetForm }) => {
            const response = await requestEmailUpdate({
              variables: { ...values },
            });

            //handle errrors
            if (response.data?.requestEmailUpdate.redirect) {
              router.replace("/login?next=" + router.pathname);
            }
            if (response.data?.requestEmailUpdate.errors) {
              const errors = response.data?.requestEmailUpdate.errors;
              setErrors(toErrorMap(errors));
              return;
            }

            if (response.data?.requestEmailUpdate.isOk) {
              setSuccess(true);
              resetForm();
            }
          }}
        >
          {({ resetForm }) => (
            <Form className={styles.userSettingsPassordModal}>
              <InputField
                name="password"
                placeholder="password"
                type="password"
              />
              <InputField name="email" placeholder="new email" />
              <div className={styles.buttons}>
                <Button
                  text="Cancel"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                    setSuccess(false);
                  }}
                />
                <Button text="Apply" type="submit" loading={loading} />
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};
export default UserSettingsEmailModal;
