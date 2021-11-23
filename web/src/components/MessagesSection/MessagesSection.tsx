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
import { isNewDay } from "../../utils/isNewDay";

const MessagesSection: React.FC = () => {
  const roomId = useContext(RoomContext);

  const [triggerNewMessage, setTriggerNewMessage] = useState<boolean>(false);
  const [newMessageNotification, setNewMessageNotification] =
    useState<boolean>(false);

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
        if (
          chatRef.current &&
          chatRef.current?.scrollTop < -100 &&
          me?.me?._id != newMessage.message.creatorId
        ) {
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

        if (entries[0].isIntersecting) {
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
        {data && data.getRoomMessages.messages.length < 1 && (
          <h1>Say hello to everyone :D</h1>
        )}
        {data &&
          data.getRoomMessages.messages.map((elem, index, arr) => {
            let isDifferentDay = true;
            if (index + 1 < arr.length) {
              let date = new Date(elem.message.createdAt);
              let previousDate = new Date(arr[index + 1].message.createdAt);
              isDifferentDay = isNewDay(date, previousDate);
            }
            let newUser;
            if (index == 0) {
              if(arr.length<2){
                newUser=true;
              }else{
                newUser =
                  arr[index + 1].message.creatorId != elem.message.creatorId;
              }
              return (
                <MessageNode
                  message={elem}
                  key={index}
                  newUser={newUser}
                  myRef={lastMessage}
                  showTime={isDifferentDay}
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
                  showTime={isDifferentDay}
                />
              );
            } else {
              newUser =
                arr[index + 1].message.creatorId != elem.message.creatorId;
              return (
                <MessageNode
                  message={elem}
                  key={index}
                  newUser={newUser}
                  showTime={isDifferentDay}
                />
              );
            }
          })}
        {loading && (
          <div className={styles.loadingProgress}>
            <div className={styles.loading}></div>
          </div>
        )}
      </div>
      <NewMessageInfo
        condition={newMessageNotification}
        onClick={() => {
          if (chatRef.current) {
            chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
          }
          setNewMessageNotification(false);
        }}
      />
    </div>
  );
};
export default MessagesSection;
