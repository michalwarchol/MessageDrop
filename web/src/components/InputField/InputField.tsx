import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'
import styles from "./InputField.module.scss";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    myRef?: React.RefObject<any>
}

const InputField:React.FC<InputFieldProps> = ({myRef, ...props}) => {
    const [field, {error}] = useField(props);
    return(
        <div className={styles.inputContainer}>
            <input className={styles.inputField} {...field} {...props} ref={myRef} />
            {error && <p>{error}</p>}
        </div>
    )
}
export default InputField;