import React from "react";
import styles from "./RoomSettingsMobile.module.scss";
import RoomSettingsMobile from "../../../components/RoomSettingsMobile/RoomSettingsMobile";
import Wrapper from "../../../components/Wrapper/Wrapper";
import { withApollo } from "../../../utils/withApollo";
import { NextPage } from "next";
import { RoomContext } from "../../../utils/RoomContext";
import { useRouter } from "next/router";
import IconButton from "../../../components/IconButton/IconButton";
import { MdClose } from "react-icons/md";

interface Props {
  id?: string;
}

const Settings: NextPage<Props> = ({ id }) => {
  const router = useRouter();
  return (
    <RoomContext.Provider value={id || ""}>
      <div className={styles.roomSettingsMobile}>
        <Wrapper size="md">
          <div className={styles.roomSettingsInner}>
            <h3>Settings</h3>
            <IconButton
              Icon={MdClose}
              className={styles.closeButton}
              variant="outline"
              onClick={() => router.back()}
            />
            <RoomSettingsMobile />
          </div>
        </Wrapper>
      </div>
    </RoomContext.Provider>
  );
};

Settings.getInitialProps = async ({ query }) => {
  return {
    id: query.id as string,
  };
};

export default withApollo()(Settings);
