import React from 'react'
import { IconType } from 'react-icons';
import styles from "./IconButton.module.scss";

interface Props {
    Icon: IconType;
    onClick?: () => void;
    className?: string;
}

const IconButton:React.FC<Props> = ({Icon, onClick, className}) => {
    return(
        <button className={styles.iconButton+" "+className} onClick={onClick}><Icon /></button>
    )
}
export default IconButton;