import React from "react";
import IconButton from "../IconButton/IconButton";
import styles from "./Modal.module.scss";
import { MdClose } from "react-icons/md";

interface Props {
  triggers: JSX.Element | JSX.Element[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  closeButton?: boolean;
}

const Modal: React.FC<Props> = ({
  triggers,
  isOpen,
  setIsOpen,
  title,
  closeButton,
  children,
}) => {
  return (
    <div className={styles.modal}>
      <div onClick={() => setIsOpen(true)}>{triggers}</div>
      {isOpen && (
        <div className={styles.modalBody}>
          <div className={styles.modalBodyInner}>
            <div className={styles.modalHeader}>
              {title && <h5>{title}</h5>}
              {closeButton && (
                <IconButton
                  Icon={MdClose}
                  className={styles.closeButton}
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                />
              )}
            </div>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
export default Modal;
