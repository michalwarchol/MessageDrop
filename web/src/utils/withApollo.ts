import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { withApollo as createWithApollo } from "next-apollo";

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
    link: createUploadLink({
      uri: 'http://localhost:4000/graphql',
      credentials: "include"
    }),
    credentials: "include"
  });

export const withApollo = createWithApollo(client);