import React from "react";
import styles from "./Home.module.scss";
import Wrapper from "../../components/Wrapper/Wrapper";
import Navbar from "../../components/Navbar/Navbar";
import { useMeQuery } from "../../generated/graphql";
import ChatSidebar from "../../components/ChatSidebar/ChatSidebar";
import ExploreContent from "../../components/ExploreContent/ExploreContent";
import { withApollo } from "../../utils/withApollo";
import { withAuth } from "../../utils/withAuth";

const Home: React.FC = () => {
  const { data } = useMeQuery();
  
  return (
    <Wrapper size="lg">
      <div className={styles.home}>
        <Navbar />
        <div className={styles.greetings}>
          <div className={styles.greetingsInner}>
            <h1>Hi, {data?.me?.name}...</h1>
            <h1>...wanna talk?</h1>
          </div>
        </div>
        <div>
          <Wrapper size="md">
            <div className={styles.content}>
              <ChatSidebar />
              <div className={styles.contentInner}>
                <ExploreContent />
              </div>
            </div>
          </Wrapper>
        </div>
      </div>
    </Wrapper>
  );
};
export default withApollo()(withAuth(Home));
