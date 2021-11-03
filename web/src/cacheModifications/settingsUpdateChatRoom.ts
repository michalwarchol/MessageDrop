import { ApolloCache } from "@apollo/client";

export const settingsUpdateChatRoom = (roomId: string) => {
  return (cache: ApolloCache<any>, {data}: any) => {
    if(!data.updateChatRoomSettings){
      return;
    }
    cache.evict({ id: "ChatRoomWithImage:" + roomId });
  };
};
