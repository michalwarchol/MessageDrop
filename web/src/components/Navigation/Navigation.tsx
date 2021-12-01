import router from 'next/router';
import React from 'react'
import { useMeQuery } from '../../generated/graphql';
import Button from '../Button/Button';
import styles from "./Navigation.module.scss";

const Navigation:React.FC = () => {
    const {data: me} = useMeQuery();
    return(
        <div className={styles.navigation}>
            <div className={styles.content}>
                {
                    me?.me ? <div className={styles.invitation}>
                        <p>Hello {me.me.name}</p>
                        <Button text="Go to dashboard" onClick={()=>router.push("/home")} />
                    </div>
                    :
                    <div className={styles.buttons}>
                        <Button text="Log In" onClick={()=>router.push("/login")} />
                        <Button text="Sign Up" onClick={()=>router.push("/register")} />
                    </div>
                }
            </div>
        </div>
    )
}
export default Navigation;