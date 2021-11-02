import { ApolloCache } from "@apollo/client";
import gql from "graphql-tag";
import {
  GetChatRoomUsersDocument,
  GetChatRoomUsersQuery,
  UserWithAvatar,
} from "../generated/graphql";

export const settingsKickUser = (
  roomId: string,
  userWithAvatar: UserWithAvatar
) => {
  return (cache: ApolloCache<any>) => {
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

    //getChatRoomUsers query with room _id: roomId
    let users = cache.readQuery<GetChatRoomUsersQuery>({
      query: GetChatRoomUsersDocument,
      variables: { roomId },
    });

    const userIds = chatRoom.userIds.concat();
    const modIds = chatRoom.modIds.concat();

    const others = users?.getChatRoomUsers.others.concat();
    const mods = users?.getChatRoomUsers.mods.concat();

    //remove user from ChatRoom
    let index = userIds.indexOf(userWithAvatar.user._id);
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
      //remove user from getChatRoomUsers query
      index = others?.findIndex(
        (elem) => elem.user._id == userWithAvatar.user._id
      );
      if (index > -1) {
        others?.splice(index, 1);
        cache.writeQuery<GetChatRoomUsersQuery>({
          query: GetChatRoomUsersDocument,
          variables: { roomId },
          data: {
            getChatRoomUsers: {
              ...users!.getChatRoomUsers,
              others: others as UserWithAvatar[],
            },
          },
        });
        return;
      }
    }
    //the code below goes if the user is a moderator
    index = modIds.indexOf(userWithAvatar.user._id);
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

      //remove user from getChatRoomUsers query
      index = mods?.findIndex(
        (elem) => elem.user._id == userWithAvatar.user._id
      );
      if (index > -1) {
        //remove user
        mods?.splice(index, 1);

        //update cache
        cache.writeQuery<GetChatRoomUsersQuery>({
          query: GetChatRoomUsersDocument,
          variables: { roomId },
          data: {
            getChatRoomUsers: {
              ...users!.getChatRoomUsers,
              mods: mods as UserWithAvatar[],
            },
          },
        });
      }
    }
  };
};
