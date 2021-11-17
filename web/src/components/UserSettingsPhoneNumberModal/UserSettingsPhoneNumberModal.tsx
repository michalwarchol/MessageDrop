import React, { useState } from "react";
import styles from "./UserSettingsPhoneNumberModal.module.scss";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { RiPhoneFill } from "react-icons/ri";
import { Form, Formik } from "formik";
import InputField from "../InputField/InputField";
import PhoneInput from "../PhoneInput/PhoneInput";
import { E164Number } from "libphonenumber-js/types";
import {
  FieldError,
  useRequestPhoneNumberUpdateMutation,
} from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/router";
import { isValidPhoneNumber } from "react-phone-number-input";
import CodeVerification from "../CodeVerification/CodeVerification";

const UserSettingsPhoneNumberModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>();
  const [phoneNumberError, setPhoneNumberError] = useState<
    FieldError | undefined
  >(undefined);

  const [requestPhoneNumberUpdate, { loading }] =
    useRequestPhoneNumberUpdateMutation();

  const router = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Change your phone number"
      triggers={
        <Button
          text="Change phone number"
          className={styles.triggerButton}
          Icon={RiPhoneFill}
        />
      }
    >
      {success ? (
        <CodeVerification setIsOpen={setIsOpen} setSuccess={setSuccess} />
      ) : (
        <Formik
          initialValues={{
            password: "",
          }}
          onSubmit={async (values, { setErrors, resetForm }) => {
            setPhoneNumberError(undefined);
            if (!isValidPhoneNumber(phoneNumber as string)) {
              setPhoneNumberError({
                field: "phoneNumber",
                message: "This phone number is not valid",
              });
              return;
            }

            const response = await requestPhoneNumberUpdate({
              variables: { ...values, phoneNumber: phoneNumber as string },
            });

            //handle errrors
            if (response.data?.requestPhoneNumberUpdate.redirect) {
              router.replace("/login?next=" + router.pathname);
            }
            if (response.data?.requestPhoneNumberUpdate.errors) {
              const errors = response.data?.requestPhoneNumberUpdate.errors;
              setErrors(toErrorMap(errors));
              const phoneNumberError = errors.find(
                (elem) => elem.field == "phoneNumber"
              );
              setPhoneNumberError(phoneNumberError);
              return;
            }

            if (response.data?.requestPhoneNumberUpdate.isOk) {
              setSuccess(true);
              resetForm();
              setPhoneNumber(undefined);
              setPhoneNumberError(undefined);
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
              <PhoneInput
                defaultCountry="PL"
                name="phoneNumber"
                placeholder="new phone number"
                value={phoneNumber}
                onChange={setPhoneNumber}
                error={phoneNumberError}
              />
              <div className={styles.buttons}>
                <Button
                  text="Cancel"
                  variant="outline"
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsOpen(false);
                    setSuccess(false);
                    setPhoneNumber(undefined);
                    setPhoneNumberError(undefined);
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
export default UserSettingsPhoneNumberModal;
