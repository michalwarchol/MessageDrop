import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./MessagesSection.module.scss";
import {
  NewMessageDocument,
  NewMessageSubscription,
  NewMessageSubscriptionVariables,
  useGetRoomMessagesQuery,
  useMeQuery,
} from "../../generated/graphql";
import { RoomContext } from "../../utils/RoomContext";
import MessageNode from "../MessageNode/MessageNode";
import NewMessageInfo from "../NewMessageInfo/NewMessageInfo";

const MessagesSection: React.FC = () => {
  const roomId = useContext(RoomContext);

  const [triggerNewMessage, setTriggerNewMessage] = useState<boolean>(false);
  const [newMessageNotification, setNewMessageNotification] = useState<boolean>(false);

  const { data: me } = useMeQuery();
  const { data, loading, fetchMore, subscribeToMore } = useGetRoomMessagesQuery(
    {
      variables: { limit: 20, roomId, skip: null },
      notifyOnNetworkStatusChange: true,
    }
  );

  //reference to the chat div
  const chatRef = useRef<HTMLDivElement>(null);

  //IntersectionObserver observers if last message is on a screen, if so, loads more messages
  let observer = useRef<IntersectionObserver | null>(null);
  const lastMessageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data?.getRoomMessages.hasMore) {
          setTimeout(() => {
            fetchMore({
              variables: {
                roomId,
                limit: 20,
                skip: data?.getRoomMessages.messages.length,
              },
            });
          }, 500);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, data?.getRoomMessages.hasMore]
  );

  //subscrition to new room messages
  useEffect(() => {
    subscribeToMore<NewMessageSubscription, NewMessageSubscriptionVariables>({
      document: NewMessageDocument,
      variables: { roomId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.newMessage;

        //new PaginatedMessages object containing 1 message
        const newMessgs = {
          getRoomMessages: {
            ...prev.getRoomMessages,
            messages: [newMessage],
            isSubFeed: true,
          },
        };

        //if I am at the bottom of the chat don't notify!!!
        //if I write a new message, don't notify!!!
        if (chatRef.current && chatRef.current?.scrollTop < -100 && me?.me?._id != newMessage.message.creatorId) {
          setTriggerNewMessage(true);
        }
        return newMessgs;
      },
    });
  }, []);

  //fires when new message comes
  //checks new message visibility
  //if not visible, then inform about new message
  const newMessageObserver = useRef<IntersectionObserver | null>();
  const lastMessage = useCallback(
    (node) => {
      if (newMessageObserver.current) newMessageObserver.current.disconnect();
      newMessageObserver.current = new IntersectionObserver((entries) => {
        if (
          !entries[0].isIntersecting &&
          data?.getRoomMessages.isSubFeed &&
          triggerNewMessage
        ) {
          setTriggerNewMessage(false);
          setNewMessageNotification(true);
        }

        if(entries[0].isIntersecting){
            setNewMessageNotification(false);
        }

      });
      if (node) newMessageObserver.current.observe(node);
    },
    [data?.getRoomMessages.isSubFeed, triggerNewMessage]
  );

  return (
    <div className={styles.messagesSection}>
      <div className={styles.messagesChat} ref={chatRef}>
        {data &&
          data.getRoomMessages.messages.map((elem, index, arr) => {
            let newUser;
            if (index == 0) {
              newUser =
                arr[index + 1].message.creatorId != elem.message.creatorId;
              return (
                <MessageNode
                  message={elem}
                  key={index}
                  newUser={newUser}
                  myRef={lastMessage}
                />
              );
            } else if (index == arr.length - 1) {
              newUser = true;
              return (
                <MessageNode
                  message={elem}
                  key={index}
                  newUser={newUser}
                  myRef={lastMessageRef}
                />
              );
            } else {
              newUser =
                arr[index + 1].message.creatorId != elem.message.creatorId;
              return (
                <MessageNode message={elem} key={index} newUser={newUser} />
              );
            }
          })}
        {loading && (
          <div className={styles.loadingProgress}>
            <div className={styles.loading}></div>
          </div>
        )}
      </div>
      <NewMessageInfo condition={newMessageNotification} onClick={() => {
              if(chatRef.current){
                chatRef.current.scrollTo(0,chatRef.current.scrollHeight);
              }
            setNewMessageNotification(false);
          }} />
    </div>
  );
};
export default MessagesSection;