import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { withApollo as createWithApollo } from "next-apollo";
import { PaginatedMessages } from "../generated/graphql";

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getRoomMessages: {
              keyArgs: [],
              merge(
                existing: PaginatedMessages | undefined,
                incoming: PaginatedMessages
              ): PaginatedMessages {
                return {...incoming,
                  messages: [...incoming.messages, ...(existing?.messages || [])]
                }
              }
            }
          }
        }
      }
    }),
    link: createUploadLink({
      uri: 'http://localhost:4000/graphql',
      credentials: "include"
    }),
    credentials: "include"
  });

export const withApollo = createWithApollo(client);