import React, { useEffect, useState } from "react";
import styles from "./NewMessageInfo.module.scss";

interface Props {
  condition: boolean;
  onClick: () => void;
}

const NewMessageInfo: React.FC<Props> = ({ condition, onClick }) => {
  const [realCondition, setRealCondition] = useState(false);

  useEffect(() => {
    if (condition) {
      setRealCondition(true);
    } else {
      setTimeout(() => {
        setRealCondition(false);
      }, 300);
    }
  }, [condition]);

  if (realCondition) {
    return (
      <div
        className={
          condition ? styles.newMessageInformer : styles.alternativeStyles
        }
        onClick={onClick}
      >
        new message
      </div>
    );
  }
  return null;
};
export default NewMessageInfo;
