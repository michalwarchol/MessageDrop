import { NextPage } from "next";
import IndexContent from "../components/IndexContent/IndexContent";
import Navigation from "../components/Navigation/Navigation";
import Wrapper from "../components/Wrapper/Wrapper";
import { withApollo } from "../utils/withApollo";
import styles from "./index.module.scss";

const Home: NextPage = () => {
  return (
    <div className={styles.index}>
      <Wrapper size="lg">
        <Navigation />
        <IndexContent />
      </Wrapper>
    </div>
  );
};

export default withApollo()(Home);
