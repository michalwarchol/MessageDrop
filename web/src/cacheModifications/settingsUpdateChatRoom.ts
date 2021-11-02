import { ApolloCache } from "@apollo/client";

export const settingsUpdateChatRoom = (roomId: string) => {
  return (cache: ApolloCache<any>) => {
    cache.evict({ id: "ChatRoomWithImage:" + roomId });
  };
};
