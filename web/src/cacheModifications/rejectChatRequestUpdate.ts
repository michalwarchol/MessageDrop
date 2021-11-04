import { ApolloCache } from "@apollo/client";

export const rejectChatRequestUpdate = (id: string) => {
  return (cache: ApolloCache<any>, { data }: any) => {
    if (!data.changeUserRoomPermissions) {
      return;
    }

    cache.evict({ id: "RequestWithUser:" + id });
  };
};
