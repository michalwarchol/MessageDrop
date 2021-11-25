import { ApolloCache } from "@apollo/client";
import {
  ChatRoomWithImage,
  GetSuggestedChatRoomsDocument,
  GetSuggestedChatRoomsQuery,
  GetUserChatRoomsDocument,
  GetUserChatRoomsQuery,
} from "../generated/graphql";

export const joinRoomUpdate = (chatRoomWithImage: ChatRoomWithImage) => {
  return (cache: ApolloCache<any>, {data}: any) => {

    if(!data.joinRoom) {
      return;
    }

    const userRooms = cache.readQuery<GetUserChatRoomsQuery>({
      query: GetUserChatRoomsDocument,
    });
    cache.writeQuery({
      query: GetUserChatRoomsDocument,
      data: {
        getUserChatRooms: [
          chatRoomWithImage,
          ...(userRooms?.getUserChatRooms || []),
        ],
      },
    });

    const suggestedRooms = cache.readQuery<GetSuggestedChatRoomsQuery>({
      query: GetSuggestedChatRoomsDocument,
    });

    const roomIndex = suggestedRooms!.getSuggestedChatRooms.findIndex(
      (elem) => elem.chatRoom._id == chatRoomWithImage.chatRoom._id
    );
    let newSuggestedRooms = suggestedRooms?.getSuggestedChatRooms.concat();
    newSuggestedRooms?.splice(roomIndex, 1);

    cache.writeQuery({
      query: GetSuggestedChatRoomsDocument,
      data: {
        getSuggestedChatRooms: newSuggestedRooms,
      },
    });
  };
};
