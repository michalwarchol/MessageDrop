import { ApolloCache } from "@apollo/client";
import { gql } from "graphql-tag";
import {
  GetChatRoomUsersDocument,
  GetChatRoomUsersQuery,
  UserWithAvatar,
} from "../generated/graphql";

export const addUserToChatRoomUpdate = (
  userWithAvatar: UserWithAvatar,
  roomId: string
) => {
  return (cache: ApolloCache<any>, { data }: any) => {
    if (!data) {
      return;
    }
    //reading updated chat room
    const chatRoom: any = cache.readFragment({
      id: "ChatRoom:" + roomId,
      fragment: gql`
        fragment RegularChatRoomOthers on ChatRoom {
          _id
          userIds
        }
      `,
    });

    let newUserIds = [...chatRoom.userIds, userWithAvatar.user._id];

    //overwriting updated chatRoom
    cache.writeFragment({
      id: "ChatRoom:" + roomId,
      fragment: gql`
        fragment ChangeUserPermissions on ChatRoom {
          userIds
        }
      `,
      data: { userIds: newUserIds },
    });

    //reading chatRoom users
    const users = cache.readQuery<GetChatRoomUsersQuery>({
      query: GetChatRoomUsersDocument,
      variables: { roomId },
    });

    //updating chatRoom users if query exists
    if (users) {
      cache.writeQuery<GetChatRoomUsersQuery>({
        query: GetChatRoomUsersDocument,
        variables: { roomId },
        data: {
          getChatRoomUsers: {
            ...users!.getChatRoomUsers,
            others: [...users.getChatRoomUsers.others, userWithAvatar],
          },
        },
      });
    }
  };
};
