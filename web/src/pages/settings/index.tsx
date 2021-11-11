import { NextPage } from "next";
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import UserSettingsContent from "../../components/UserSettingsContent/UserSettingsContent";
import Wrapper from "../../components/Wrapper/Wrapper";
import { useIsAuth } from "../../utils/useIsAuth";
import { withApollo } from "../../utils/withApollo";
import styles from "./Settings.module.scss";

const Settings: NextPage = () => {
  useIsAuth();
  
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
export default withApollo()(Settings);
