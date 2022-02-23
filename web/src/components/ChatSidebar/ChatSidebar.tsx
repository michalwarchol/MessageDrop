import React, { useEffect, useState } from "react";
import styles from "./ChatSidebar.module.scss";
import Divider from "../Divider/Divider";
import CreateChatButton from "../CreateChatButton/CreateChatButton";
import {
  ListenUserChatRoomsDocument,
  ListenUserChatRoomsSubscription,
  ListenUserChatRoomsSubscriptionVariables,
  useGetUserChatRoomsQuery,
  useMeQuery,
} from "../../generated/graphql";
import ChatRoomShortCut from "../ChatRoomShortcut/ChatRoomShortcut";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";

const ChatSidebar: React.FC = () => {
  const { data, loading, subscribeToMore } = useGetUserChatRoomsQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-only",
    notifyOnNetworkStatusChange: true
  });
  const { data: me } = useMeQuery();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (me?.me)
      subscribeToMore<
        ListenUserChatRoomsSubscription,
        ListenUserChatRoomsSubscriptionVariables
      >({
        document: ListenUserChatRoomsDocument,
        variables: { userId: me?.me?._id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) {
            return prev;
          }

          const { shouldAdd, roomId, room } =
            subscriptionData.data.listenUserChatRooms;

          //add a new chat room to user's rooms
          if (shouldAdd && room) {
            return {
              __typename: prev.__typename,
              getUserChatRooms: [room, ...prev.getUserChatRooms],
            };
          }
          //remove a chat room from user's rooms
          if (!shouldAdd && roomId) {
            let rooms = [...prev.getUserChatRooms];
            let index = rooms.findIndex((elem) => elem.chatRoom._id == roomId);
            if (index != -1) rooms.splice(index, 1);
            return {
              __typename: prev.__typename,
              getUserChatRooms: rooms
            }
          }

          return prev;
        },
      });
  }, [me]);

  return (
    <div className={styles.chatSidebar}>
      <div className={styles.create}>
        <CreateChatButton isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <Divider />
      <div className={styles.userRooms}>
        {loading && (
          <div className={styles.loading}>
            <LoadingIndicator />
          </div>
        )}

        {data?.getUserChatRooms
          .map((elem, index) => (
            <ChatRoomShortCut chatRoomWithImage={elem} key={index} />
          ))
          .reverse()}

        {data && data.getUserChatRooms.length < 1 && !loading && (
          <div className={styles.loading}>Your rooms</div>
        )}
      </div>
    </div>
  );
};
export default ChatSidebar;
