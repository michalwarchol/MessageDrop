import React, { useState } from "react";
import styles from "./ChooseChat.module.scss";
import { FiUserPlus } from "react-icons/fi";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import {
  ChatRoomWithImage,
  useGetUserChatRoomsQuery,
  useJoinRoomMutation,
  useMeQuery,
  UserWithAvatar,
} from "../../generated/graphql";
import ChatRoomNode from "../ChatRoomNode/ChatRoomNode";
import { addUserToChatRoomUpdate } from "../../cacheModifications/addUserToChatRoomUpdate";

interface Props {
  userWithAvatar: UserWithAvatar;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChooseChat: React.FC<Props> = ({ userWithAvatar, isOpen, setIsOpen }) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const { data } = useGetUserChatRoomsQuery();
  const { data: me } = useMeQuery();
  const [joinRoom] = useJoinRoomMutation();

  const addUser = async () => {
    if (!selectedRoom) {
      return;
    }
    await joinRoom({
      variables: { roomId: selectedRoom, userId: userWithAvatar.user._id },
      update: addUserToChatRoomUpdate(userWithAvatar, selectedRoom),
    });
    setIsOpen(false);
  };

  let roomsToChoose: ChatRoomWithImage[] = [];
  if (data && me) {
    roomsToChoose = data.getUserChatRooms.filter((elem) => {
      //I need to have permissions to add user to this room!!!
      //and the user is no the room member!!!
      if (
        (elem.chatRoom.adminId == me.me!._id ||
          elem.chatRoom.modIds.includes(me.me!._id)) &&
        elem.chatRoom.adminId != userWithAvatar.user._id &&
        !elem.chatRoom.modIds.includes(userWithAvatar.user._id) &&
        !elem.chatRoom.userIds.includes(userWithAvatar.user._id)
      ) {
        return true;
      }
      return false;
    });
  }
  
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      closeButton
      title="Select chat room"
      triggers={
        <Button className={styles.joinButton} Icon={FiUserPlus} text="Add" />
      }
    >
      <div className={styles.chats}>
        {roomsToChoose.length < 1 ? (
          <h3>No rooms found</h3>
        ) : (
          <>
            {roomsToChoose.map((elem, index) => (
              <ChatRoomNode
                chatRoomWithImage={elem}
                key={index}
                select={() => setSelectedRoom(elem.chatRoom._id)}
                isSelected={selectedRoom == elem.chatRoom._id}
              />
            ))}
          </>
        )}
      </div>
      <div className={styles.buttons}>
        <Button
          text="Cancel"
          variant="outline"
          className={styles.buttonStyles}
          onClick={() => {
            setIsOpen(false);
          }}
        />
        <Button
          text="Add"
          className={selectedRoom ? styles.buttonStyles : styles.notSelected}
          onClick={addUser}
        />
      </div>
    </Modal>
  );
};
export default ChooseChat;
