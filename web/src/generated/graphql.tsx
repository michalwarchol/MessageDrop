import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type ChatRoom = {
  __typename?: 'ChatRoom';
  _id: Scalars['ID'];
  access: RoomAccess;
  adminId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  imageId?: Maybe<Scalars['String']>;
  modIds: Array<Scalars['String']>;
  name: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  userIds: Array<Scalars['String']>;
};

export type ChatRoomInput = {
  access: RoomAccess;
  description: Scalars['String'];
  name: Scalars['String'];
};

export type ChatRoomResponse = {
  __typename?: 'ChatRoomResponse';
  chatRoom?: Maybe<ChatRoom>;
  errors?: Maybe<Array<FieldError>>;
};

export type ChatRoomWithImage = {
  __typename?: 'ChatRoomWithImage';
  chatRoom: ChatRoom;
  image?: Maybe<Scalars['String']>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createChatRoom: ChatRoomResponse;
  joinRoom: Scalars['Boolean'];
  login?: Maybe<UserResponse>;
  register: UserResponse;
};


export type MutationCreateChatRoomArgs = {
  image?: Maybe<Scalars['Upload']>;
  input: ChatRoomInput;
};


export type MutationJoinRoomArgs = {
  roomId: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};

export type Query = {
  __typename?: 'Query';
  getChatRoomImage?: Maybe<Scalars['String']>;
  getChatRooms: Array<ChatRoom>;
  getCreatorChatRooms: Array<ChatRoomWithImage>;
  getSuggestedChatRooms: Array<ChatRoomWithImage>;
  getUsers: Array<User>;
  me?: Maybe<User>;
};


export type QueryGetChatRoomImageArgs = {
  imageId: Scalars['String'];
};

export type RegisterInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  phone: Scalars['String'];
};

/** Defines user access to a chat room */
export enum RoomAccess {
  Private = 'private',
  Public = 'public',
  Restricted = 'restricted'
}

export type User = {
  __typename?: 'User';
  _id: Scalars['ID'];
  avatarId?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  name: Scalars['String'];
  phone: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  verified: Scalars['Boolean'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type RegularChatRoomFragment = { __typename?: 'ChatRoom', _id: string, name: string, description: string, access: RoomAccess, imageId?: string | null | undefined, adminId: string, modIds: Array<string>, userIds: Array<string>, createdAt: any, updatedAt: any };

export type RegularUserFragment = { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any };

export type CreateChatRoomMutationVariables = Exact<{
  input: ChatRoomInput;
  image?: Maybe<Scalars['Upload']>;
}>;


export type CreateChatRoomMutation = { __typename?: 'Mutation', createChatRoom: { __typename?: 'ChatRoomResponse', chatRoom?: { __typename?: 'ChatRoom', _id: string, name: string, description: string, access: RoomAccess, imageId?: string | null | undefined, adminId: string, modIds: Array<string>, userIds: Array<string>, createdAt: any, updatedAt: any } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type JoinRoomMutationVariables = Exact<{
  roomId: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
}>;


export type JoinRoomMutation = { __typename?: 'Mutation', joinRoom: boolean };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'UserResponse', user?: { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } | null | undefined };

export type RegisterMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', user?: { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type GetCreatorChatRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCreatorChatRoomsQuery = { __typename?: 'Query', getCreatorChatRooms: Array<{ __typename?: 'ChatRoomWithImage', image?: string | null | undefined, chatRoom: { __typename?: 'ChatRoom', _id: string, name: string, description: string, access: RoomAccess, imageId?: string | null | undefined, adminId: string, modIds: Array<string>, userIds: Array<string>, createdAt: any, updatedAt: any } }> };

export type GetChatRoomImageQueryVariables = Exact<{
  image: Scalars['String'];
}>;


export type GetChatRoomImageQuery = { __typename?: 'Query', getChatRoomImage?: string | null | undefined };

export type GetSuggestedChatRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSuggestedChatRoomsQuery = { __typename?: 'Query', getSuggestedChatRooms: Array<{ __typename?: 'ChatRoomWithImage', image?: string | null | undefined, chatRoom: { __typename?: 'ChatRoom', _id: string, name: string, description: string, access: RoomAccess, imageId?: string | null | undefined, adminId: string, modIds: Array<string>, userIds: Array<string>, createdAt: any, updatedAt: any } }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any } | null | undefined };

export const RegularChatRoomFragmentDoc = gql`
    fragment RegularChatRoom on ChatRoom {
  _id
  name
  description
  access
  imageId
  adminId
  modIds
  userIds
  createdAt
  updatedAt
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  _id
  name
  email
  phone
  verified
  avatarId
  createdAt
  updatedAt
}
    `;
export const CreateChatRoomDocument = gql`
    mutation CreateChatRoom($input: ChatRoomInput!, $image: Upload) {
  createChatRoom(input: $input, image: $image) {
    chatRoom {
      ...RegularChatRoom
    }
    errors {
      field
      message
    }
  }
}
    ${RegularChatRoomFragmentDoc}`;
export type CreateChatRoomMutationFn = Apollo.MutationFunction<CreateChatRoomMutation, CreateChatRoomMutationVariables>;

/**
 * __useCreateChatRoomMutation__
 *
 * To run a mutation, you first call `useCreateChatRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChatRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChatRoomMutation, { data, loading, error }] = useCreateChatRoomMutation({
 *   variables: {
 *      input: // value for 'input'
 *      image: // value for 'image'
 *   },
 * });
 */
export function useCreateChatRoomMutation(baseOptions?: Apollo.MutationHookOptions<CreateChatRoomMutation, CreateChatRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChatRoomMutation, CreateChatRoomMutationVariables>(CreateChatRoomDocument, options);
      }
export type CreateChatRoomMutationHookResult = ReturnType<typeof useCreateChatRoomMutation>;
export type CreateChatRoomMutationResult = Apollo.MutationResult<CreateChatRoomMutation>;
export type CreateChatRoomMutationOptions = Apollo.BaseMutationOptions<CreateChatRoomMutation, CreateChatRoomMutationVariables>;
export const JoinRoomDocument = gql`
    mutation JoinRoom($roomId: String!, $userId: String) {
  joinRoom(roomId: $roomId, userId: $userId)
}
    `;
export type JoinRoomMutationFn = Apollo.MutationFunction<JoinRoomMutation, JoinRoomMutationVariables>;

/**
 * __useJoinRoomMutation__
 *
 * To run a mutation, you first call `useJoinRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinRoomMutation, { data, loading, error }] = useJoinRoomMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useJoinRoomMutation(baseOptions?: Apollo.MutationHookOptions<JoinRoomMutation, JoinRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinRoomMutation, JoinRoomMutationVariables>(JoinRoomDocument, options);
      }
export type JoinRoomMutationHookResult = ReturnType<typeof useJoinRoomMutation>;
export type JoinRoomMutationResult = Apollo.MutationResult<JoinRoomMutation>;
export type JoinRoomMutationOptions = Apollo.BaseMutationOptions<JoinRoomMutation, JoinRoomMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      ...RegularUser
    }
    errors {
      field
      message
    }
  }
}
    ${RegularUserFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($name: String!, $email: String!, $phone: String!, $password: String!) {
  register(
    registerInput: {name: $name, email: $email, phone: $phone, password: $password}
  ) {
    user {
      ...RegularUser
    }
    errors {
      field
      message
    }
  }
}
    ${RegularUserFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      phone: // value for 'phone'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const GetCreatorChatRoomsDocument = gql`
    query GetCreatorChatRooms {
  getCreatorChatRooms {
    chatRoom {
      ...RegularChatRoom
    }
    image
  }
}
    ${RegularChatRoomFragmentDoc}`;

/**
 * __useGetCreatorChatRoomsQuery__
 *
 * To run a query within a React component, call `useGetCreatorChatRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCreatorChatRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCreatorChatRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCreatorChatRoomsQuery(baseOptions?: Apollo.QueryHookOptions<GetCreatorChatRoomsQuery, GetCreatorChatRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCreatorChatRoomsQuery, GetCreatorChatRoomsQueryVariables>(GetCreatorChatRoomsDocument, options);
      }
export function useGetCreatorChatRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCreatorChatRoomsQuery, GetCreatorChatRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCreatorChatRoomsQuery, GetCreatorChatRoomsQueryVariables>(GetCreatorChatRoomsDocument, options);
        }
export type GetCreatorChatRoomsQueryHookResult = ReturnType<typeof useGetCreatorChatRoomsQuery>;
export type GetCreatorChatRoomsLazyQueryHookResult = ReturnType<typeof useGetCreatorChatRoomsLazyQuery>;
export type GetCreatorChatRoomsQueryResult = Apollo.QueryResult<GetCreatorChatRoomsQuery, GetCreatorChatRoomsQueryVariables>;
export const GetChatRoomImageDocument = gql`
    query GetChatRoomImage($image: String!) {
  getChatRoomImage(imageId: $image)
}
    `;

/**
 * __useGetChatRoomImageQuery__
 *
 * To run a query within a React component, call `useGetChatRoomImageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatRoomImageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatRoomImageQuery({
 *   variables: {
 *      image: // value for 'image'
 *   },
 * });
 */
export function useGetChatRoomImageQuery(baseOptions: Apollo.QueryHookOptions<GetChatRoomImageQuery, GetChatRoomImageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatRoomImageQuery, GetChatRoomImageQueryVariables>(GetChatRoomImageDocument, options);
      }
export function useGetChatRoomImageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatRoomImageQuery, GetChatRoomImageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatRoomImageQuery, GetChatRoomImageQueryVariables>(GetChatRoomImageDocument, options);
        }
export type GetChatRoomImageQueryHookResult = ReturnType<typeof useGetChatRoomImageQuery>;
export type GetChatRoomImageLazyQueryHookResult = ReturnType<typeof useGetChatRoomImageLazyQuery>;
export type GetChatRoomImageQueryResult = Apollo.QueryResult<GetChatRoomImageQuery, GetChatRoomImageQueryVariables>;
export const GetSuggestedChatRoomsDocument = gql`
    query GetSuggestedChatRooms {
  getSuggestedChatRooms {
    chatRoom {
      ...RegularChatRoom
    }
    image
  }
}
    ${RegularChatRoomFragmentDoc}`;

/**
 * __useGetSuggestedChatRoomsQuery__
 *
 * To run a query within a React component, call `useGetSuggestedChatRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSuggestedChatRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSuggestedChatRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSuggestedChatRoomsQuery(baseOptions?: Apollo.QueryHookOptions<GetSuggestedChatRoomsQuery, GetSuggestedChatRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSuggestedChatRoomsQuery, GetSuggestedChatRoomsQueryVariables>(GetSuggestedChatRoomsDocument, options);
      }
export function useGetSuggestedChatRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSuggestedChatRoomsQuery, GetSuggestedChatRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSuggestedChatRoomsQuery, GetSuggestedChatRoomsQueryVariables>(GetSuggestedChatRoomsDocument, options);
        }
export type GetSuggestedChatRoomsQueryHookResult = ReturnType<typeof useGetSuggestedChatRoomsQuery>;
export type GetSuggestedChatRoomsLazyQueryHookResult = ReturnType<typeof useGetSuggestedChatRoomsLazyQuery>;
export type GetSuggestedChatRoomsQueryResult = Apollo.QueryResult<GetSuggestedChatRoomsQuery, GetSuggestedChatRoomsQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;