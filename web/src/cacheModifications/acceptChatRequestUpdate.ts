import { ApolloCache } from "@apollo/client";
import {gql} from "graphql-tag";

export const acceptChatRequestUpdate = (
  id: string,
  roomId: string,
  userId: string
) => {
  return (cache: ApolloCache<any>, { data }: any) => {

    if (!data.acceptChatRequest) {
      return;
    }
    cache.evict({ id: "RequestWithUser:" + id });

    const chatRoom: any = cache.readFragment({
      id: "ChatRoom:" + roomId,
      fragment: gql`
        fragment RegularChatRoomOthers on ChatRoom {
          _id
          userIds
        }
      `,
    });

    const newUserIds = [...chatRoom.userIds, userId];

    cache.writeFragment({
        id: "ChatRoom:" + roomId,
        fragment: gql`
          fragment ChangeUserPermissions on ChatRoom {
            userIds
          }
        `,
        data: { userIds: newUserIds },
      });

  };
};
