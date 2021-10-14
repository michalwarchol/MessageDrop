import React, { ButtonHTMLAttributes } from "react";
import { IconType } from "react-icons";
import styles from "./Button.module.scss";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  Icon?: IconType;
  variant?: "fill" | "outline";
  loading?: boolean;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  text,
  Icon,
  variant = "fill",
  loading = false,
  className,
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
      className={cn+" "+className}
      {...props}
      disabled={loading}
      style={
        loading
          ? { backgroundColor: "#9a9a9a", cursor: "not-allowed" }
          : undefined
      }
    >
      {loading ? (
        <span className={styles.buttonLoadingSpan}></span>
      ) : (
        <>
          <span>{Icon && <Icon />}</span>
          {text}
        </>
      )}
    </button>
  );
};
export default Button;
