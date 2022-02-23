import React from "react";
import ReactDOM from "react-dom";
import IconButton from "../IconButton/IconButton";
import styles from "./Modal.module.scss";
import { MdClose } from "react-icons/md";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  closeButton?: boolean;
}

const Modal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  title,
  closeButton,
  children,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modal}>
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
    </div>,
    document.getElementById("portal") as HTMLElement
  );
};
export default Modal;
