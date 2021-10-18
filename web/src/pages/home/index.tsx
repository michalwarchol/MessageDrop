import React from "react";
import styles from "./Home.module.scss";
import Wrapper from "../../components/Wrapper/Wrapper";
import { useIsAuth } from "../../utils/useIsAuth";
import Navbar from "../../components/Navbar/Navbar";
import { useMeQuery } from "../../generated/graphql";
import ChatSidebar from "../../components/ChatSidebar/ChatSidebar";
import ExploreContent from "../../components/ExploreContent/ExploreContent";

const Home: React.FC = () => {
  useIsAuth();
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
export default Home;
