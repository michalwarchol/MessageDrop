import React, { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;

  variant?: "fill" | "outline";
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  text,
  variant = "fill",
  loading = false,
  ...props
}) => {
  let cn = styles.buttonFill;
  switch (variant) {
    case "outline":
      cn = styles.buttonOutline;
      break;
    default:
      cn = styles.buttonFill;
  }

  return (
    <button
      className={cn}
      {...props}
      disabled={loading}
      style={
        loading
          ? { backgroundColor: "#9a9a9a", cursor: "not-allowed" }
          : undefined
      }
    >
      {
        loading ?
        <span className={styles.buttonLoadingSpan}></span>
        :text
      }
    </button>
  );
};
export default Button;
