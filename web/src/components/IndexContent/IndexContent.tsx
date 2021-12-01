import React from "react";
import styles from "./IndexContent.module.scss";
import Image from "next/image";
import scr1 from "../../screens/1.jpg";
import scr2 from "../../screens/2.jpg";
import scr3 from "../../screens/3.jpg";
import Button from "../Button/Button";
import { useRouter } from "next/router";

const IndexContent: React.FC = () => {
  const router = useRouter();
  return (
    <div className={styles.indexContent}>
      <div className={styles.section}>
        <div className={styles.headers}>
          <h1>Join MessageDrop</h1>
          <h3>and text to your friends :D</h3>
        </div>
        <div className={styles.photo}>
          <div className={styles.photoInner}>
            <Image src={scr1} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
      <div className={styles.photo}>
          <div className={styles.photoInnerBig}>
            <Image src={scr2} />
          </div>
        </div>
        <div className={styles.headers}>
          <h1>Features</h1>
          <ul>
            <li>creating chat rooms</li>
            <li>promoting users to moderators</li>
            <li>adding images and files in messages</li>
            <li>making requests to join a room</li>
            <li>updaing chat room settings</li>
            <li>updating user settings</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.headers}>
          <h1>Manage your settings</h1>
          <h3>by receiving verification code via email or SMS</h3>
        </div>
        <div className={styles.photo}>
          <div className={styles.photoInner}>
            <Image src={scr3} />
          </div>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <h1>We're waiting for you</h1>
        <Button text="Sign Up Now" className={styles.signUpButton} onClick={()=>router.push("/register")} />
      </div>

      <div className={styles.footer}>
        <p>
          Michał Warchoł {new Date().getFullYear()} &copy;. All rights reserved
        </p>
      </div>
    </div>
  );
};
export default IndexContent;
