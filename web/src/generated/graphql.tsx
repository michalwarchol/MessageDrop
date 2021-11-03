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

export type ChatRoomUsers = {
  __typename?: 'ChatRoomUsers';
  admin: UserWithAvatar;
  mods: Array<UserWithAvatar>;
  others: Array<UserWithAvatar>;
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

export type FileData = {
  __typename?: 'FileData';
  fileId: Scalars['String'];
  filename: Scalars['String'];
  mimeType: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  _id: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  creatorId: Scalars['String'];
  fileData?: Maybe<FileData>;
  mediaId?: Maybe<Scalars['String']>;
  messageReactions: Array<MessageReactions>;
  roomId: Scalars['String'];
  text?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type MessageReactions = {
  __typename?: 'MessageReactions';
  reaction: Scalars['String'];
  value: Scalars['Int'];
};

export type MessageWithMedia = {
  __typename?: 'MessageWithMedia';
  file?: Maybe<Scalars['String']>;
  media?: Maybe<Scalars['String']>;
  message: Message;
};

export type Mutation = {
  __typename?: 'Mutation';
  changeUserRoomPermissions: Scalars['Boolean'];
  createChatRoom: ChatRoomResponse;
  createMessage: Message;
  joinRoom: Scalars['Boolean'];
  kickUser: Scalars['Boolean'];
  login?: Maybe<UserResponse>;
  logout: Scalars['Boolean'];
  register: UserResponse;
  updateChatRoomSettings: Scalars['Boolean'];
};


export type MutationChangeUserRoomPermissionsArgs = {
  roomId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationCreateChatRoomArgs = {
  image?: Maybe<Scalars['Upload']>;
  input: ChatRoomInput;
};


export type MutationCreateMessageArgs = {
  file?: Maybe<Scalars['Upload']>;
  media?: Maybe<Scalars['Upload']>;
  roomId: Scalars['String'];
  text?: Maybe<Scalars['String']>;
};


export type MutationJoinRoomArgs = {
  roomId: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
};


export type MutationKickUserArgs = {
  roomId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};


export type MutationUpdateChatRoomSettingsArgs = {
  image?: Maybe<Scalars['Upload']>;
  roomId: Scalars['String'];
  settings: SettingsInput;
};

export type PaginatedMessages = {
  __typename?: 'PaginatedMessages';
  hasMore: Scalars['Boolean'];
  isSubFeed: Scalars['Boolean'];
  messages: Array<MessageWithMedia>;
};

export type Query = {
  __typename?: 'Query';
  getChatRoomById: ChatRoomWithImage;
  getChatRoomUsers: ChatRoomUsers;
  getChatRooms: Array<ChatRoom>;
  getRoomMessages: PaginatedMessages;
  getSuggestedChatRooms: Array<ChatRoomWithImage>;
  getUserById: UserWithAvatar;
  getUserChatRooms: Array<ChatRoomWithImage>;
  getUsers: Array<User>;
  isChatMember: Scalars['Boolean'];
  me?: Maybe<User>;
};


export type QueryGetChatRoomByIdArgs = {
  roomId: Scalars['String'];
};


export type QueryGetChatRoomUsersArgs = {
  roomId: Scalars['String'];
};


export type QueryGetRoomMessagesArgs = {
  limit: Scalars['Int'];
  roomId: Scalars['String'];
  skip?: Maybe<Scalars['Int']>;
};


export type QueryGetUserByIdArgs = {
  userId: Scalars['String'];
};


export type QueryIsChatMemberArgs = {
  roomId: Scalars['String'];
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

export type SettingsInput = {
  access: RoomAccess;
  description: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessage: MessageWithMedia;
};


export type SubscriptionNewMessageArgs = {
  roomId: Scalars['String'];
};

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

export type UserWithAvatar = {
  __typename?: 'UserWithAvatar';
  avatar?: Maybe<Scalars['String']>;
  user: User;
};

export type RegularChatRoomFragment = { __typename?: 'ChatRoom', _id: string, name: string, description: string, access: RoomAccess, imageId?: string | null | undefined, adminId: string, modIds: Array<string>, userIds: Array<string>, createdAt: any, updatedAt: any };

export type RegularMessageFragment = { __typename?: 'Message', _id: string, text?: string | null | undefined, roomId: string, creatorId: string, mediaId?: string | null | undefined, createdAt: any, updatedAt: any, fileData?: { __typename?: 'FileData', fileId: string, filename: string, mimeType: string } | null | undefined, messageReactions: Array<{ __typename?: 'MessageReactions', reaction: string, value: number }> };

export type RegularUserFragment = { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any };

export type ChangeUserRoomPermissionsMutationVariables = Exact<{
  roomId: Scalars['String'];
  userId: Scalars['String'];
}>;


export type ChangeUserRoomPermissionsMutation = { __typename?: 'Mutation', changeUserRoomPermissions: boolean };

export type CreateChatRoomMutationVariables = Exact<{
  input: ChatRoomInput;
  image?: Maybe<Scalars['Upload']>;
}>;


export type CreateChatRoomMutation = { __typename?: 'Mutation', createChatRoom: { __typename?: 'ChatRoomResponse', chatRoom?: { __typename?: 'ChatRoom', _id: string, name: string, description: string, access: RoomAccess, imageId?: string | null | undefined, adminId: string, modIds: Array<string>, userIds: Array<string>, createdAt: any, updatedAt: any } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type CreateMessageMutationVariables = Exact<{
  roomId: Scalars['String'];
  text?: Maybe<Scalars['String']>;
  media?: Maybe<Scalars['Upload']>;
  file?: Maybe<Scalars['Upload']>;
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'Message', _id: string, text?: string | null | undefined, roomId: string, creatorId: string, mediaId?: string | null | undefined, createdAt: any, updatedAt: any, fileData?: { __typename?: 'FileData', fileId: string, filename: string, mimeType: string } | null | undefined, messageReactions: Array<{ __typename?: 'MessageReactions', reaction: string, value: number }> } };

export type JoinRoomMutationVariables = Exact<{
  roomId: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
}>;


export type JoinRoomMutation = { __typename?: 'Mutation', joinRoom: boolean };

export type KickUserMutationVariables = Exact<{
  roomId: Scalars['String'];
  userId: Scalars['String'];
}>;


export type KickUserMutation = { __typename?: 'Mutation', kickUser: boolean };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login?: { __typename?: 'UserResponse', user?: { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } | null | undefined };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', user?: { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type UpdateChatRoomSettingsMutationVariables = Exact<{
  roomId: Scalars['String'];
  settings: SettingsInput;
  image?: Maybe<Scalars['Upload']>;
}>;


export type UpdateChatRoomSettingsMutation = { __typename?: 'Mutation', updateChatRoomSettings: boolean };

export type GetUserChatRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserChatRoomsQuery = { __typename?: 'Query', getUserChatRooms: Array<{ __typename?: 'ChatRoomWithImage', image?: string | null | undefined, chatRoom: { __typename?: 'ChatRoom', _id: string, name: string, description: string, access: RoomAccess, imageId?: string | null | undefined, adminId: string, modIds: Array<string>, userIds: Array<string>, createdAt: any, updatedAt: any } }> };

export type GetChatRoomByIdQueryVariables = Exact<{
  roomId: Scalars['String'];
}>;


export type GetChatRoomByIdQuery = { __typename?: 'Query', getChatRoomById: { __typename?: 'ChatRoomWithImage', image?: string | null | undefined, chatRoom: { __typename?: 'ChatRoom', _id: string, name: string, description: string, access: RoomAccess, imageId?: string | null | undefined, adminId: string, modIds: Array<string>, userIds: Array<string>, createdAt: any, updatedAt: any } } };

export type GetChatRoomUsersQueryVariables = Exact<{
  roomId: Scalars['String'];
}>;


export type GetChatRoomUsersQuery = { __typename?: 'Query', getChatRoomUsers: { __typename?: 'ChatRoomUsers', admin: { __typename?: 'UserWithAvatar', avatar?: string | null | undefined, user: { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any } }, mods: Array<{ __typename?: 'UserWithAvatar', avatar?: string | null | undefined, user: { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any } }>, others: Array<{ __typename?: 'UserWithAvatar', avatar?: string | null | undefined, user: { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any } }> } };

export type GetRoomMessagesQueryVariables = Exact<{
  roomId: Scalars['String'];
  limit: Scalars['Int'];
  skip?: Maybe<Scalars['Int']>;
}>;


export type GetRoomMessagesQuery = { __typename?: 'Query', getRoomMessages: { __typename?: 'PaginatedMessages', hasMore: boolean, isSubFeed: boolean, messages: Array<{ __typename?: 'MessageWithMedia', media?: string | null | undefined, file?: string | null | undefined, message: { __typename?: 'Message', _id: string, text?: string | null | undefined, roomId: string, creatorId: string, mediaId?: string | null | undefined, createdAt: any, updatedAt: any, fileData?: { __typename?: 'FileData', fileId: string, filename: string, mimeType: string } | null | undefined, messageReactions: Array<{ __typename?: 'MessageReactions', reaction: string, value: number }> } }> } };

export type GetSuggestedChatRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSuggestedChatRoomsQuery = { __typename?: 'Query', getSuggestedChatRooms: Array<{ __typename?: 'ChatRoomWithImage', image?: string | null | undefined, chatRoom: { __typename?: 'ChatRoom', _id: string, name: string, description: string, access: RoomAccess, imageId?: string | null | undefined, adminId: string, modIds: Array<string>, userIds: Array<string>, createdAt: any, updatedAt: any } }> };

export type GetUserByIdQueryVariables = Exact<{
  userId: Scalars['String'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', getUserById: { __typename?: 'UserWithAvatar', avatar?: string | null | undefined, user: { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any } } };

export type IsChatMemberQueryVariables = Exact<{
  roomId: Scalars['String'];
}>;


export type IsChatMemberQuery = { __typename?: 'Query', isChatMember: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', _id: string, name: string, email: string, phone: string, verified: boolean, avatarId?: string | null | undefined, createdAt: any, updatedAt: any } | null | undefined };

export type NewMessageSubscriptionVariables = Exact<{
  roomId: Scalars['String'];
}>;


export type NewMessageSubscription = { __typename?: 'Subscription', newMessage: { __typename?: 'MessageWithMedia', media?: string | null | undefined, file?: string | null | undefined, message: { __typename?: 'Message', _id: string, text?: string | null | undefined, roomId: string, creatorId: string, mediaId?: string | null | undefined, createdAt: any, updatedAt: any, fileData?: { __typename?: 'FileData', fileId: string, filename: string, mimeType: string } | null | undefined, messageReactions: Array<{ __typename?: 'MessageReactions', reaction: string, value: number }> } } };

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
export const RegularMessageFragmentDoc = gql`
    fragment RegularMessage on Message {
  _id
  text
  roomId
  creatorId
  mediaId
  fileData {
    fileId
    filename
    mimeType
  }
  messageReactions {
    reaction
    value
  }
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
export const ChangeUserRoomPermissionsDocument = gql`
    mutation ChangeUserRoomPermissions($roomId: String!, $userId: String!) {
  changeUserRoomPermissions(roomId: $roomId, userId: $userId)
}
    `;
export type ChangeUserRoomPermissionsMutationFn = Apollo.MutationFunction<ChangeUserRoomPermissionsMutation, ChangeUserRoomPermissionsMutationVariables>;

/**
 * __useChangeUserRoomPermissionsMutation__
 *
 * To run a mutation, you first call `useChangeUserRoomPermissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeUserRoomPermissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeUserRoomPermissionsMutation, { data, loading, error }] = useChangeUserRoomPermissionsMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useChangeUserRoomPermissionsMutation(baseOptions?: Apollo.MutationHookOptions<ChangeUserRoomPermissionsMutation, ChangeUserRoomPermissionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeUserRoomPermissionsMutation, ChangeUserRoomPermissionsMutationVariables>(ChangeUserRoomPermissionsDocument, options);
      }
export type ChangeUserRoomPermissionsMutationHookResult = ReturnType<typeof useChangeUserRoomPermissionsMutation>;
export type ChangeUserRoomPermissionsMutationResult = Apollo.MutationResult<ChangeUserRoomPermissionsMutation>;
export type ChangeUserRoomPermissionsMutationOptions = Apollo.BaseMutationOptions<ChangeUserRoomPermissionsMutation, ChangeUserRoomPermissionsMutationVariables>;
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
export const CreateMessageDocument = gql`
    mutation CreateMessage($roomId: String!, $text: String, $media: Upload, $file: Upload) {
  createMessage(roomId: $roomId, text: $text, media: $media, file: $file) {
    ...RegularMessage
  }
}
    ${RegularMessageFragmentDoc}`;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      text: // value for 'text'
 *      media: // value for 'media'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
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
export const KickUserDocument = gql`
    mutation KickUser($roomId: String!, $userId: String!) {
  kickUser(roomId: $roomId, userId: $userId)
}
    `;
export type KickUserMutationFn = Apollo.MutationFunction<KickUserMutation, KickUserMutationVariables>;

/**
 * __useKickUserMutation__
 *
 * To run a mutation, you first call `useKickUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useKickUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [kickUserMutation, { data, loading, error }] = useKickUserMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useKickUserMutation(baseOptions?: Apollo.MutationHookOptions<KickUserMutation, KickUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<KickUserMutation, KickUserMutationVariables>(KickUserDocument, options);
      }
export type KickUserMutationHookResult = ReturnType<typeof useKickUserMutation>;
export type KickUserMutationResult = Apollo.MutationResult<KickUserMutation>;
export type KickUserMutationOptions = Apollo.BaseMutationOptions<KickUserMutation, KickUserMutationVariables>;
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
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
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
export const UpdateChatRoomSettingsDocument = gql`
    mutation UpdateChatRoomSettings($roomId: String!, $settings: SettingsInput!, $image: Upload) {
  updateChatRoomSettings(roomId: $roomId, settings: $settings, image: $image)
}
    `;
export type UpdateChatRoomSettingsMutationFn = Apollo.MutationFunction<UpdateChatRoomSettingsMutation, UpdateChatRoomSettingsMutationVariables>;

/**
 * __useUpdateChatRoomSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateChatRoomSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateChatRoomSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateChatRoomSettingsMutation, { data, loading, error }] = useUpdateChatRoomSettingsMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      settings: // value for 'settings'
 *      image: // value for 'image'
 *   },
 * });
 */
export function useUpdateChatRoomSettingsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateChatRoomSettingsMutation, UpdateChatRoomSettingsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateChatRoomSettingsMutation, UpdateChatRoomSettingsMutationVariables>(UpdateChatRoomSettingsDocument, options);
      }
export type UpdateChatRoomSettingsMutationHookResult = ReturnType<typeof useUpdateChatRoomSettingsMutation>;
export type UpdateChatRoomSettingsMutationResult = Apollo.MutationResult<UpdateChatRoomSettingsMutation>;
export type UpdateChatRoomSettingsMutationOptions = Apollo.BaseMutationOptions<UpdateChatRoomSettingsMutation, UpdateChatRoomSettingsMutationVariables>;
export const GetUserChatRoomsDocument = gql`
    query GetUserChatRooms {
  getUserChatRooms {
    chatRoom {
      ...RegularChatRoom
    }
    image
  }
}
    ${RegularChatRoomFragmentDoc}`;

/**
 * __useGetUserChatRoomsQuery__
 *
 * To run a query within a React component, call `useGetUserChatRoomsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserChatRoomsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserChatRoomsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserChatRoomsQuery(baseOptions?: Apollo.QueryHookOptions<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>(GetUserChatRoomsDocument, options);
      }
export function useGetUserChatRoomsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>(GetUserChatRoomsDocument, options);
        }
export type GetUserChatRoomsQueryHookResult = ReturnType<typeof useGetUserChatRoomsQuery>;
export type GetUserChatRoomsLazyQueryHookResult = ReturnType<typeof useGetUserChatRoomsLazyQuery>;
export type GetUserChatRoomsQueryResult = Apollo.QueryResult<GetUserChatRoomsQuery, GetUserChatRoomsQueryVariables>;
export const GetChatRoomByIdDocument = gql`
    query GetChatRoomById($roomId: String!) {
  getChatRoomById(roomId: $roomId) {
    chatRoom {
      ...RegularChatRoom
    }
    image
  }
}
    ${RegularChatRoomFragmentDoc}`;

/**
 * __useGetChatRoomByIdQuery__
 *
 * To run a query within a React component, call `useGetChatRoomByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatRoomByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatRoomByIdQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useGetChatRoomByIdQuery(baseOptions: Apollo.QueryHookOptions<GetChatRoomByIdQuery, GetChatRoomByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatRoomByIdQuery, GetChatRoomByIdQueryVariables>(GetChatRoomByIdDocument, options);
      }
export function useGetChatRoomByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatRoomByIdQuery, GetChatRoomByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatRoomByIdQuery, GetChatRoomByIdQueryVariables>(GetChatRoomByIdDocument, options);
        }
export type GetChatRoomByIdQueryHookResult = ReturnType<typeof useGetChatRoomByIdQuery>;
export type GetChatRoomByIdLazyQueryHookResult = ReturnType<typeof useGetChatRoomByIdLazyQuery>;
export type GetChatRoomByIdQueryResult = Apollo.QueryResult<GetChatRoomByIdQuery, GetChatRoomByIdQueryVariables>;
export const GetChatRoomUsersDocument = gql`
    query GetChatRoomUsers($roomId: String!) {
  getChatRoomUsers(roomId: $roomId) {
    admin {
      user {
        ...RegularUser
      }
      avatar
    }
    mods {
      user {
        ...RegularUser
      }
      avatar
    }
    others {
      user {
        ...RegularUser
      }
      avatar
    }
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useGetChatRoomUsersQuery__
 *
 * To run a query within a React component, call `useGetChatRoomUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChatRoomUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChatRoomUsersQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useGetChatRoomUsersQuery(baseOptions: Apollo.QueryHookOptions<GetChatRoomUsersQuery, GetChatRoomUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChatRoomUsersQuery, GetChatRoomUsersQueryVariables>(GetChatRoomUsersDocument, options);
      }
export function useGetChatRoomUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChatRoomUsersQuery, GetChatRoomUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChatRoomUsersQuery, GetChatRoomUsersQueryVariables>(GetChatRoomUsersDocument, options);
        }
export type GetChatRoomUsersQueryHookResult = ReturnType<typeof useGetChatRoomUsersQuery>;
export type GetChatRoomUsersLazyQueryHookResult = ReturnType<typeof useGetChatRoomUsersLazyQuery>;
export type GetChatRoomUsersQueryResult = Apollo.QueryResult<GetChatRoomUsersQuery, GetChatRoomUsersQueryVariables>;
export const GetRoomMessagesDocument = gql`
    query GetRoomMessages($roomId: String!, $limit: Int!, $skip: Int) {
  getRoomMessages(roomId: $roomId, limit: $limit, skip: $skip) {
    hasMore
    isSubFeed
    messages {
      message {
        ...RegularMessage
      }
      media
      file
    }
  }
}
    ${RegularMessageFragmentDoc}`;

/**
 * __useGetRoomMessagesQuery__
 *
 * To run a query within a React component, call `useGetRoomMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomMessagesQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      limit: // value for 'limit'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useGetRoomMessagesQuery(baseOptions: Apollo.QueryHookOptions<GetRoomMessagesQuery, GetRoomMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoomMessagesQuery, GetRoomMessagesQueryVariables>(GetRoomMessagesDocument, options);
      }
export function useGetRoomMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomMessagesQuery, GetRoomMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoomMessagesQuery, GetRoomMessagesQueryVariables>(GetRoomMessagesDocument, options);
        }
export type GetRoomMessagesQueryHookResult = ReturnType<typeof useGetRoomMessagesQuery>;
export type GetRoomMessagesLazyQueryHookResult = ReturnType<typeof useGetRoomMessagesLazyQuery>;
export type GetRoomMessagesQueryResult = Apollo.QueryResult<GetRoomMessagesQuery, GetRoomMessagesQueryVariables>;
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
export const GetUserByIdDocument = gql`
    query GetUserById($userId: String!) {
  getUserById(userId: $userId) {
    user {
      ...RegularUser
    }
    avatar
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useGetUserByIdQuery__
 *
 * To run a query within a React component, call `useGetUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserByIdQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserByIdQuery(baseOptions: Apollo.QueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
      }
export function useGetUserByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserByIdQuery, GetUserByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserByIdQuery, GetUserByIdQueryVariables>(GetUserByIdDocument, options);
        }
export type GetUserByIdQueryHookResult = ReturnType<typeof useGetUserByIdQuery>;
export type GetUserByIdLazyQueryHookResult = ReturnType<typeof useGetUserByIdLazyQuery>;
export type GetUserByIdQueryResult = Apollo.QueryResult<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const IsChatMemberDocument = gql`
    query IsChatMember($roomId: String!) {
  isChatMember(roomId: $roomId)
}
    `;

/**
 * __useIsChatMemberQuery__
 *
 * To run a query within a React component, call `useIsChatMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsChatMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsChatMemberQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useIsChatMemberQuery(baseOptions: Apollo.QueryHookOptions<IsChatMemberQuery, IsChatMemberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsChatMemberQuery, IsChatMemberQueryVariables>(IsChatMemberDocument, options);
      }
export function useIsChatMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsChatMemberQuery, IsChatMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsChatMemberQuery, IsChatMemberQueryVariables>(IsChatMemberDocument, options);
        }
export type IsChatMemberQueryHookResult = ReturnType<typeof useIsChatMemberQuery>;
export type IsChatMemberLazyQueryHookResult = ReturnType<typeof useIsChatMemberLazyQuery>;
export type IsChatMemberQueryResult = Apollo.QueryResult<IsChatMemberQuery, IsChatMemberQueryVariables>;
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
export const NewMessageDocument = gql`
    subscription NewMessage($roomId: String!) {
  newMessage(roomId: $roomId) {
    message {
      ...RegularMessage
    }
    media
    file
  }
}
    ${RegularMessageFragmentDoc}`;

/**
 * __useNewMessageSubscription__
 *
 * To run a query within a React component, call `useNewMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMessageSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useNewMessageSubscription(baseOptions: Apollo.SubscriptionHookOptions<NewMessageSubscription, NewMessageSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewMessageSubscription, NewMessageSubscriptionVariables>(NewMessageDocument, options);
      }
export type NewMessageSubscriptionHookResult = ReturnType<typeof useNewMessageSubscription>;
export type NewMessageSubscriptionResult = Apollo.SubscriptionResult<NewMessageSubscription>;