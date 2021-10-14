import React, { ButtonHTMLAttributes } from "react";
import { IconType } from "react-icons";
import styles from "./IconButton.module.scss";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  Icon: IconType;
  className?: string;
  variant?: "fill" | "outline";
  loading?: boolean;
};

const IconButton: React.FC<IconButtonProps> = ({
  Icon,
  className,
  variant = "fill",
  loading = false,
  ...props
}) => {
  let cn = styles.iconButtonFill;
  switch (variant) {
    case "outline":
      cn = styles.iconButtonOutline;
      break;
    default:
      cn = styles.iconButtonFill;
  }
  return (
    <button className={cn + " " + className} {...props}>
      {loading ? <span className={styles.buttonLoadingSpan}></span> : <Icon />}
    </button>
  );
};
export default IconButton;
