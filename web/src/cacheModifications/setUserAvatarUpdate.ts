import { ApolloCache } from "@apollo/client";
import { GetUserAvatarDocument } from "../generated/graphql";
import { gql } from "graphql-tag";

export const setUserAvatarUpdate = (userId: string, avatarId: string|null) => {
  return (cache: ApolloCache<any>, { data }: any) => {
    if (!data.setUserAvatar) {
      return;
    }

    cache.writeQuery({
      query: GetUserAvatarDocument,
      data: { getUserAvatar: data.setUserAvatar },
      variables: {avatarId}
    });
    cache.writeFragment({
      id: "UserWithAvatar:" + userId,
      fragment: gql`
        fragment UpdateUserAvatar on UserWithAvatar {
          avatar
        }
      `,
      data: { avatar: data.setUserAvatar },
    });
  };
};
