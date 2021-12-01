import { ApolloCache } from "@apollo/client";
import {
  ChatRoomWithImage,
  GetSuggestedChatRoomsDocument,
  GetSuggestedChatRoomsQuery,
} from "../generated/graphql";

export const joinRoomUpdate = (chatRoomWithImage: ChatRoomWithImage) => {
  return (cache: ApolloCache<any>) => {

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
