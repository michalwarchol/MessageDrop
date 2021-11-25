import { ApolloCache } from "@apollo/client";
import gql from "graphql-tag";

export const settingsKickUser = (
  roomId: string,
  userId: string
) => {
  return (cache: ApolloCache<any>, {data}: any) => {

    if(!data.kickUser){
      return;
    }

    //getChatRoomById with _id: roomId
    const chatRoom: any = cache.readFragment({
      id: "ChatRoom:" + roomId,
      fragment: gql`
        fragment _ on ChatRoom {
          __typename
          _id
          userIds
          modIds
        }
      `,
    });

    const userIds = chatRoom.userIds.concat();
    const modIds = chatRoom.modIds.concat();

    //remove user from ChatRoom
    let index = userIds.indexOf(userId);
    if (index > -1) {
      //remove user
      userIds.splice(index, 1);

      //update cache
      cache.writeFragment({
        id: "ChatRoom:" + roomId,
        fragment: gql`
          fragment RemoveUser on ChatRoom {
            userIds
          }
        `,
        data: { userIds },
      });

      return;
    }

    
    //the code below goes if the user is a moderator
    index = modIds.indexOf(userId);
    if (index > -1) {
      //remove user
      modIds.splice(index, 1);

      //update cache
      cache.writeFragment({
        id: "ChatRoom:" + roomId,
        fragment: gql`
          fragment RemoveMod on ChatRoom {
            modIds
          }
        `,
        data: { modIds },
      });
    }
  };
};
