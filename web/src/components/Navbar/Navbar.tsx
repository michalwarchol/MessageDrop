import React from 'react'
import { useMeQuery } from '../../generated/graphql';
import IconButton from '../IconButton/IconButton';
import styles from "./Navbar.module.scss";
import {AiFillHome, AiOutlineSearch} from "react-icons/ai";
import {IoMdPower, IoMdSettings} from "react-icons/io";

const Navbar:React.FC = () => {

    const { data } = useMeQuery();

    return(
        <div className={styles.navbar}>
            <div className={styles.name}>{data?.me?.name}</div>
            <div className={styles.shortcuts}>
                <IconButton Icon={AiFillHome} className={styles.iconButtonStyle} />
                <IconButton Icon={AiOutlineSearch} className={styles.iconButtonStyle} />
                <IconButton Icon={IoMdSettings} className={styles.iconButtonStyle} />
                <IconButton Icon={IoMdPower} className={styles.iconButtonStyle} />
            </div>
        </div>
    )
}
export default Navbar;