import React, { useContext, useState } from "react";
import styles from "./RoomRequests.module.scss";
import IconButton from "../IconButton/IconButton";
import { MdNotificationsActive } from "react-icons/md";
import { useGetChatRoomRequestsQuery } from "../../generated/graphql";
import { RoomContext } from "../../utils/RoomContext";
import RoomRequestNode from "../RoomRequestNode/RoomRequestNode";

const RoomRequests: React.FC = () => {
  const roomId = useContext(RoomContext);
  const [showRequests, setShowRequest] = useState<boolean>(false);

  const { data } = useGetChatRoomRequestsQuery({ variables: { roomId } });

  return (
    <div className={styles.roomRequests}>
      <IconButton
        Icon={MdNotificationsActive}
        variant="outline"
        onClick={() => setShowRequest(!showRequests)}
        className={showRequests ? styles.open : undefined}
      />
      {showRequests && data && <div className={styles.requestsContainer}>{
        data.getChatRoomRequests.length > 0 ?
          data.getChatRoomRequests.map((elem, index)=>(
              <RoomRequestNode requestWithUser={elem} key={index} />
          )) : <div className={styles.empty}>No actions to do</div>
      }</div>}

      {data && data.getChatRoomRequests.length > 0 && 
        <div className={styles.notification}>{data.getChatRoomRequests.length}</div>
      }
    </div>
  );
};
export default RoomRequests;