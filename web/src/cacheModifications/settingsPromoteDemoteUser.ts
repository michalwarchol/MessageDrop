import { ApolloCache } from "@apollo/client";
import { gql } from "graphql-tag";

export const settingsPromoteDemoteUser = (
  roomId: string,
  userId: string
) => {
  return (cache: ApolloCache<any>, {data}: any) => {

    if(!data.changeUserRoomPermissions){
      return;
    }
    const chatRoom: any = cache.readFragment({
      id: "ChatRoom:" + roomId,
      fragment: gql`
        fragment _ on ChatRoom {
          _id
          userIds
          modIds
        }
      `,
    });

    let userIds = chatRoom.userIds.concat();
    let modIds = chatRoom.modIds.concat();

    //change in ChatRoom if user isn't a moderator
    let index = userIds.indexOf(userId);
    if (index > -1) {
      //updating ChatRoom query
      userIds.splice(index, 1);
      modIds = [userId, ...modIds];

      cache.writeFragment({
        id: "ChatRoom:" + roomId,
        fragment: gql`
          fragment ChangeUserPermissions on ChatRoom {
            modIds
            userIds
          }
        `,
        data: { userIds, modIds },
      });

      //updating ChatRoomUsers query
      return;
    }

    //change in ChatRoom if user is a moderator
    index = modIds.indexOf(userId);
    if (index > -1) {
      //updating ChatRoom query
      modIds.splice(index, 1);
      userIds = [userId, ...userIds];
      cache.writeFragment({
        id: "ChatRoom:" + roomId,
        fragment: gql`
          fragment ChangeUserPermissions on ChatRoom {
            userIds
            modIds
          }
        `,
        data: { modIds, userIds },
      });
    }
  };
};
