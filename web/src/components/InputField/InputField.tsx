import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'
import styles from "./InputField.module.scss";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
}

const InputField:React.FC<InputFieldProps> = (props) => {
    const [field, {error}] = useField(props);
    return(
        <div className={styles.inputContainer}>
            <input className={styles.inputField} {...field} {...props} />
            {error && <p>{error}</p>}
        </div>
    )
}
export default InputField;