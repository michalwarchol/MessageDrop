import { ApolloCache } from "@apollo/client";
import {
  GetChatRoomUsersDocument,
  GetChatRoomUsersQuery,
  UserWithAvatar,
} from "../generated/graphql";
import { gql } from "graphql-tag";

export const settingsPromoteDemoteUser = (
  roomId: string,
  userWithAvatar: UserWithAvatar
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
    const users = cache.readQuery<GetChatRoomUsersQuery>({
      query: GetChatRoomUsersDocument,
      variables: { roomId },
    });

    let userIds = chatRoom.userIds.concat();
    let modIds = chatRoom.modIds.concat();

    let others = users?.getChatRoomUsers.others.concat();
    let mods = users?.getChatRoomUsers.mods.concat();

    //change in ChatRoom if user isn't a moderator
    let index = userIds.indexOf(userWithAvatar.user._id);
    if (index > -1) {
      //updating ChatRoom query
      userIds.splice(index, 1);
      modIds = [userWithAvatar.user._id, ...modIds];

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
      index = others?.findIndex(
        (elem) => elem.user._id == userWithAvatar.user._id
      );
      if (index > -1) {
        others?.splice(index, 1);
        mods = [userWithAvatar, ...(mods as UserWithAvatar[])];

        cache.writeQuery<GetChatRoomUsersQuery>({
          query: GetChatRoomUsersDocument,
          variables: { roomId },
          data: {
            getChatRoomUsers: {
              ...users!.getChatRoomUsers,
              mods: mods as UserWithAvatar[],
              others: others as UserWithAvatar[],
            },
          },
        });
        return;
      }
      return;
    }

    //change in ChatRoom if user is a moderator
    index = modIds.indexOf(userWithAvatar.user._id);
    if (index > -1) {
      //updating ChatRoom query
      modIds.splice(index, 1);
      userIds = [userWithAvatar.user._id, ...userIds];
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

      //updating ChatRoomUsers query
      index = mods?.findIndex(
        (elem) => elem.user._id == userWithAvatar.user._id
      );
      if (index > -1) {
        mods?.splice(index, 1);
        others = [userWithAvatar, ...(others as UserWithAvatar[])];
        cache.writeQuery<GetChatRoomUsersQuery>({
          query: GetChatRoomUsersDocument,
          variables: { roomId },
          data: {
            getChatRoomUsers: {
              ...users!.getChatRoomUsers,
              mods: mods as UserWithAvatar[],
              others: others as UserWithAvatar[],
            },
          },
        });
      }
    }
  };
};
