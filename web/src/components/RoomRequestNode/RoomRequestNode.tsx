import React, { useContext } from "react";
import styles from "./RoomRequestNode.module.scss";
import {
  RequestWithUser,
  useAcceptChatRequestMutation,
  useRejectChatRequstMutation,
} from "../../generated/graphql";
import Button from "../Button/Button";
import { RoomContext } from "../../utils/RoomContext";
import { rejectChatRequestUpdate } from "../../cacheModifications/rejectChatRequestUpdate";
import { acceptChatRequestUpdate } from "../../cacheModifications/acceptChatRequestUpdate";

interface Props {
  requestWithUser: RequestWithUser;
}

const RoomRequestNode: React.FC<Props> = ({ requestWithUser }) => {
  const roomId = useContext(RoomContext);

  const [acceptChatRequest] = useAcceptChatRequestMutation();
  const [rejectChatRequest] = useRejectChatRequstMutation();

  const accept = async () => {
    await acceptChatRequest({
      variables: { requestId: requestWithUser.request._id, roomId },
      update: acceptChatRequestUpdate(
        requestWithUser.request._id,
        roomId,
        requestWithUser.userWithAvatar
      ),
    });
  };

  const reject = async () => {
    await rejectChatRequest({
      variables: { requestId: requestWithUser.request._id, roomId },
      update: rejectChatRequestUpdate(requestWithUser.request._id),
    });
  };

  return (
    <div className={styles.roomRequestNode}>
      <div className={styles.info}>
        <b>{requestWithUser.userWithAvatar.user.name}</b> wants to join this
        room.
      </div>
      <div className={styles.buttons}>
        <Button text="Accept" onClick={accept} />
        <Button text="Reject" onClick={reject} />
      </div>
    </div>
  );
};
export default RoomRequestNode;
