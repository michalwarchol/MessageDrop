import React from "react";
import styles from "./PhoneInput.module.scss";
import "react-phone-number-input/style.css";
import Input, {Props} from "react-phone-number-input";
import { FieldError } from "../../generated/graphql";

type PhoneInputProps = Props & {
  name: string;
  error?: FieldError
};

const PhoneInput: React.FC<PhoneInputProps> = ({name, error, ...props}) => {

  return (
    <div className={styles.inputContainer}>
      <Input
        {...props}
      />
      {error && <p>{error.message}</p>}
    </div>
  );
};
export default PhoneInput;
