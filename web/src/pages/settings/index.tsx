import { NextPage } from "next";
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import UserSettingsContent from "../../components/UserSettingsContent/UserSettingsContent";
import Wrapper from "../../components/Wrapper/Wrapper";
import { withApollo } from "../../utils/withApollo";
import { withAuth } from "../../utils/withAuth";
import styles from "./Settings.module.scss";

const Settings: NextPage = () => {
  return (
    <Wrapper size="lg">
      <div className={styles.settings}>
        <Navbar />
        <Wrapper size="md">
          <UserSettingsContent />
        </Wrapper>
      </div>
    </Wrapper>
  );
};
export default withApollo()(withAuth(Settings));
