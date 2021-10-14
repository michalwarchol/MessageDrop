import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";
import styles from "./UploadField.module.scss";

type UploadProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  text: string;
};

const UploadField: React.FC<UploadProps> = ({ text, ...props }) => {
  const [field] = useField(props);
  return (
    <div className={styles.uploadField}>
      <label htmlFor={props.name}>{text}</label>
      <input type="file" {...field} {...props} />
    </div>
  );
};
export default UploadField;
