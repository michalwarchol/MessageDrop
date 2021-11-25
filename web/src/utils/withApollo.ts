import { ApolloClient, defaultDataIdFromObject, InMemoryCache, split } from "@apollo/client";
import {WebSocketLink} from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import { withApollo as createWithApollo } from "next-apollo";
import { ChatRoomUsers, PaginatedMessages } from "../generated/graphql";
import { isServer } from "./isServer";

const wsLink = isServer ? new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      credentials: "include"
    }
  }
}) : null;

const uploadLink = createUploadLink({
  uri: 'http://localhost:4000/graphql',
  credentials: "include"
});

const splitLink = isServer ? split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink!,
  uploadLink
) : uploadLink;


const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache({
      dataIdFromObject(responseObject) {
        switch(responseObject.__typename){
          case 'UserWithAvatar':return `UserWithAvatar:${(responseObject.user as any)._id}`;
          case 'ChatRoomWithImage': return `ChatRoomWithImage:${(responseObject.chatRoom as any)._id}`
          case 'RequestWithUser': return `RequestWithUser:${(responseObject.request as any)._id}`
          default: return defaultDataIdFromObject(responseObject);
        }
      },
      typePolicies: {
        Query: {
          fields: {
            getRoomMessages: {
              keyArgs: ["roomId"],
              merge(
                existing: PaginatedMessages | undefined,
                incoming: PaginatedMessages
              ): PaginatedMessages {
                if(incoming.isSubFeed){
                  return {...incoming,
                    messages: [ ...incoming.messages, ...(existing?.messages || [])],
                    isSubFeed: true
                  }
                }
                return {...incoming,
                  messages: [...(existing?.messages || []), ...incoming.messages]
                }
              }
            },
            getChatRoomUsers: {
              keyArgs: ["roomId"],
              merge(
                _: ChatRoomUsers | undefined,
                incoming: ChatRoomUsers
              ): ChatRoomUsers {
                return incoming;
              }
            }
          }
        }
      }
    }),
    link: splitLink,
    credentials: "include"
  });

export const withApollo = createWithApollo(client);