import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";
import styles from "./InlineRadio.module.scss";

type RadioProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
};

const InlineRadio: React.FC<RadioProps> = (props) => {
  const [field] = useField(props);

  return (
    <label
      htmlFor={props.id}
      className={
        props.checked ? styles.inlineRadioFill : styles.inlineRadioOutline
      }
    >
      {props.value}
      <input type="radio" {...field} {...props} />
    </label>
  );
};
export default InlineRadio;
