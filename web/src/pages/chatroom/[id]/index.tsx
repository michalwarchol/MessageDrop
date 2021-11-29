import { NextPage } from "next";
import React from "react";
import styles from "./ChatRoom.module.scss";
import Wrapper from "../../../components/Wrapper/Wrapper";
import Navbar from "../../../components/Navbar/Navbar";
import { withApollo } from "../../../utils/withApollo";
import ChatRoomContent from "../../../components/ChatRoomContent/ChatRoomContent";
import { RoomContext } from "../../../utils/RoomContext";
import { withAuth } from "../../../utils/withAuth";

type Props = {
  id?: string;
}

const ChatRoom: NextPage<Props, {}> = ({ id }) => {
  return (
    <RoomContext.Provider value={id || ""}>
      <Wrapper size="lg">
        <div className={styles.chatRoom}>
          <Navbar />
          <ChatRoomContent />
        </div>
      </Wrapper>
    </RoomContext.Provider>
  );
};

ChatRoom.getInitialProps = async ({ query }) => {
  return {
    id: query.id as string,
  };
};

export default withApollo()(withAuth(ChatRoom));
