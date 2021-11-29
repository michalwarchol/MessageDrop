import React from "react";
import styles from "./Home.module.scss";
import Wrapper from "../../components/Wrapper/Wrapper";
import Navbar from "../../components/Navbar/Navbar";
import ChatSidebar from "../../components/ChatSidebar/ChatSidebar";
import ExploreContent from "../../components/ExploreContent/ExploreContent";
import { withApollo } from "../../utils/withApollo";
import { withAuth } from "../../utils/withAuth";

const Home: React.FC = () => {
  return (
    <Wrapper size="lg">
      <div className={styles.home}>
        <Navbar />
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
