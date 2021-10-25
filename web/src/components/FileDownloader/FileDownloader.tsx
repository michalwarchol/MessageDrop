import React from "react";
import styles from "./FileDownloader.module.scss";
import { FileData } from "../../generated/graphql";
import {AiFillFileText} from 'react-icons/ai';

interface Props {
  href: string;
  fileData: FileData;
}

const FileDownloader: React.FC<Props> = ({ href, fileData }) => {
  return (
    <a
      className={styles.fileDownloader}
      href={"data:" + fileData.mimeType + ";base64," + href}
      download={fileData.filename}
    >
      <div className={styles.icon}>
        <AiFillFileText />
      </div>
      <p>{fileData.filename}</p>
    </a>
  );
};

export default FileDownloader;
