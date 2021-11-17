import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import {
  useGenerateNewCodeMutation,
  useUpdatePhoneNumberMutation,
} from "../../generated/graphql";
import Button from "../Button/Button";
import InputField from "../InputField/InputField";
import styles from "./CodeVerification.module.scss";

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const CodeVerification: React.FC<Props> = ({ setIsOpen, setSuccess }) => {
  const [error, setError] = useState<string>("");
  const [generateNewCode] = useGenerateNewCodeMutation();
  const [updatePhoneNumber, { loading }] = useUpdatePhoneNumberMutation();

  const val1 = useRef<HTMLInputElement>(null);
  const val2 = useRef<HTMLInputElement>(null);
  const val3 = useRef<HTMLInputElement>(null);
  const val4 = useRef<HTMLInputElement>(null);
  const val5 = useRef<HTMLInputElement>(null);
  const val6 = useRef<HTMLInputElement>(null);

  const handleInput = (
    e: React.FormEvent<HTMLInputElement>,
    nextFocus: React.RefObject<HTMLInputElement>,
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined
    ) => void
  ) => {
    let currentValue: string | number = "";
    if (e.currentTarget.value.length > 0) {
      currentValue = e.currentTarget.value.toString().slice(-1);
    }

    setFieldValue(e.currentTarget.name, currentValue);
    if (nextFocus.current) nextFocus.current?.focus();
  };

  return (
    <div className={styles.codeVerification}>
      <Formik
        initialValues={{
          val1: "",
          val2: "",
          val3: "",
          val4: "",
          val5: "",
          val6: "",
        }}
        onSubmit={async (values, {resetForm}) => {
          if (Object.values(values).some((elem) => elem.length < 1)) {
            return;
          }
          const { val1, val2, val3, val4, val5, val6 } = values;
          const code = `${val1}${val2}${val3}${val4}${val5}${val6}`;
          const response = await updatePhoneNumber({ variables: { code } });

          if (response.data?.updatePhoneNumber.errors) {
            setError(response.data.updatePhoneNumber.errors[0].message);
          }
          if(response.data?.updatePhoneNumber.isOk) {
            resetForm();
            setIsOpen(false);
          }
        }}
      >
        {({ setFieldValue, values, resetForm }) => {
          let className = styles.submitButtonDisabled;
          if (!Object.values(values).some((elem) => elem.length < 1)) {
            className = styles.submitButton;
          }

          return (
            <Form>
              <div className={styles.header}>
                <h3>Pass your code</h3>
              </div>
              <div className={styles.numbers}>
                <InputField
                  name="val1"
                  type="number"
                  myRef={val1}
                  onChange={(e) => {
                    handleInput(e, val2, setFieldValue);
                  }}
                />
                <InputField
                  name="val2"
                  type="number"
                  myRef={val2}
                  onChange={(e) => {
                    handleInput(e, val3, setFieldValue);
                  }}
                />
                <InputField
                  name="val3"
                  type="number"
                  myRef={val3}
                  onChange={(e) => {
                    handleInput(e, val4, setFieldValue);
                  }}
                />
                <InputField
                  name="val4"
                  type="number"
                  myRef={val4}
                  onChange={(e) => {
                    handleInput(e, val5, setFieldValue);
                  }}
                />
                <InputField
                  name="val5"
                  type="number"
                  myRef={val5}
                  onChange={(e) => {
                    handleInput(e, val6, setFieldValue);
                  }}
                />
                <InputField
                  name="val6"
                  type="number"
                  myRef={val6}
                  onChange={(e) => {
                    handleInput(e, val6, setFieldValue);
                  }}
                />
              </div>
              {error && (
                <div className={styles.error}>
                  <p>{error}</p>
                </div>
              )}
              <div className={styles.buttons}>
                <p>Your message will come shortly. If something went wrong, you can</p>
                <Button
                  text="Generate a new code"
                  variant="outline"
                  className={styles.generateButton}
                  type="button"
                  onClick={async () => {
                    await generateNewCode();
                  }}
                />
                <div className={styles.actionButtons}>
                  <Button
                    text="Cancel"
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setError("");
                      setSuccess(false);
                      setIsOpen(false);
                    }}
                  />
                  <Button
                    text="Submit"
                    type="submit"
                    className={className}
                    loading={loading}
                  />
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default CodeVerification;
