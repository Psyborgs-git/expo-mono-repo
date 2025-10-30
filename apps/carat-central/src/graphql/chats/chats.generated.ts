import * as Types from '../../generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Chat_MessageFragment = {
  __typename?: 'Message';
  id: string;
  chatId: string;
  senderId: string;
  content?: string | null;
  s3Key?: string | null;
  isRead: boolean;
  readAt?: any | null;
  createdAt: any;
};

export type Chat_ParticipantFragment = {
  __typename?: 'ChatParticipant';
  id: string;
  userId: string;
  chatId: string;
  joinedAt: any;
  lastReadAt?: any | null;
};

export type Chat_BasicFragment = {
  __typename?: 'Chat';
  id: string;
  name?: string | null;
  description?: string | null;
  isGroup: boolean;
  createdAt: any;
  updatedAt: any;
  participants: Array<{
    __typename?: 'ChatParticipant';
    id: string;
    userId: string;
    chatId: string;
    joinedAt: any;
    lastReadAt?: any | null;
  }>;
};

export type Chat_WithMessagesFragment = {
  __typename?: 'Chat';
  id: string;
  name?: string | null;
  description?: string | null;
  isGroup: boolean;
  createdAt: any;
  updatedAt: any;
  messages: Array<{
    __typename?: 'Message';
    id: string;
    chatId: string;
    senderId: string;
    content?: string | null;
    s3Key?: string | null;
    isRead: boolean;
    readAt?: any | null;
    createdAt: any;
  }>;
  participants: Array<{
    __typename?: 'ChatParticipant';
    id: string;
    userId: string;
    chatId: string;
    joinedAt: any;
    lastReadAt?: any | null;
  }>;
};

export type Chat_GetMyChatsQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type Chat_GetMyChatsQuery = {
  __typename?: 'Query';
  myChats: Array<{
    __typename?: 'Chat';
    id: string;
    name?: string | null;
    description?: string | null;
    isGroup: boolean;
    createdAt: any;
    updatedAt: any;
    messages: Array<{
      __typename?: 'Message';
      id: string;
      chatId: string;
      senderId: string;
      content?: string | null;
      s3Key?: string | null;
      isRead: boolean;
      readAt?: any | null;
      createdAt: any;
    }>;
    participants: Array<{
      __typename?: 'ChatParticipant';
      id: string;
      userId: string;
      chatId: string;
      joinedAt: any;
      lastReadAt?: any | null;
    }>;
  }>;
};

export type Chat_GetChatQueryVariables = Types.Exact<{
  chatId: Types.Scalars['String']['input'];
}>;

export type Chat_GetChatQuery = {
  __typename?: 'Query';
  chat?: {
    __typename?: 'Chat';
    id: string;
    name?: string | null;
    description?: string | null;
    isGroup: boolean;
    createdAt: any;
    updatedAt: any;
    messages: Array<{
      __typename?: 'Message';
      id: string;
      chatId: string;
      senderId: string;
      content?: string | null;
      s3Key?: string | null;
      isRead: boolean;
      readAt?: any | null;
      createdAt: any;
    }>;
    participants: Array<{
      __typename?: 'ChatParticipant';
      id: string;
      userId: string;
      chatId: string;
      joinedAt: any;
      lastReadAt?: any | null;
    }>;
  } | null;
};

export type Chat_GetMessagesQueryVariables = Types.Exact<{
  chatId: Types.Scalars['String']['input'];
  cursor?: Types.InputMaybe<Types.Scalars['String']['input']>;
  limit?: Types.InputMaybe<Types.Scalars['Float']['input']>;
}>;

export type Chat_GetMessagesQuery = {
  __typename?: 'Query';
  chatMessages: Array<{
    __typename?: 'Message';
    id: string;
    chatId: string;
    senderId: string;
    content?: string | null;
    s3Key?: string | null;
    isRead: boolean;
    readAt?: any | null;
    createdAt: any;
  }>;
};

export type Chat_CreateMutationVariables = Types.Exact<{
  participantIds:
    | Array<Types.Scalars['String']['input']>
    | Types.Scalars['String']['input'];
  name?: Types.InputMaybe<Types.Scalars['String']['input']>;
  isGroup?: Types.InputMaybe<Types.Scalars['Boolean']['input']>;
}>;

export type Chat_CreateMutation = {
  __typename?: 'Mutation';
  createChat: {
    __typename?: 'Chat';
    id: string;
    name?: string | null;
    description?: string | null;
    isGroup: boolean;
    createdAt: any;
    updatedAt: any;
    participants: Array<{
      __typename?: 'ChatParticipant';
      id: string;
      userId: string;
      chatId: string;
      joinedAt: any;
      lastReadAt?: any | null;
    }>;
  };
};

export type Chat_SendMessageMutationVariables = Types.Exact<{
  chatId: Types.Scalars['String']['input'];
  content?: Types.InputMaybe<Types.Scalars['String']['input']>;
  receiverId?: Types.InputMaybe<Types.Scalars['String']['input']>;
  s3Key?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;

export type Chat_SendMessageMutation = {
  __typename?: 'Mutation';
  sendMessage: {
    __typename?: 'Message';
    id: string;
    chatId: string;
    senderId: string;
    content?: string | null;
    s3Key?: string | null;
    isRead: boolean;
    readAt?: any | null;
    createdAt: any;
  };
};

export type Chat_MarkMessageAsReadMutationVariables = Types.Exact<{
  messageId: Types.Scalars['String']['input'];
}>;

export type Chat_MarkMessageAsReadMutation = {
  __typename?: 'Mutation';
  markMessageAsRead: {
    __typename?: 'Message';
    id: string;
    chatId: string;
    senderId: string;
    content?: string | null;
    s3Key?: string | null;
    isRead: boolean;
    readAt?: any | null;
    createdAt: any;
  };
};

export type Chat_UpdateLastReadMutationVariables = Types.Exact<{
  chatId: Types.Scalars['String']['input'];
}>;

export type Chat_UpdateLastReadMutation = {
  __typename?: 'Mutation';
  updateLastRead: {
    __typename?: 'Chat';
    id: string;
    name?: string | null;
    description?: string | null;
    isGroup: boolean;
    createdAt: any;
    updatedAt: any;
    participants: Array<{
      __typename?: 'ChatParticipant';
      id: string;
      userId: string;
      chatId: string;
      joinedAt: any;
      lastReadAt?: any | null;
    }>;
  };
};

export type Chat_DeleteMessageMutationVariables = Types.Exact<{
  messageId: Types.Scalars['String']['input'];
}>;

export type Chat_DeleteMessageMutation = {
  __typename?: 'Mutation';
  deleteMessage: {
    __typename?: 'Message';
    id: string;
    chatId: string;
    senderId: string;
    content?: string | null;
    s3Key?: string | null;
    isRead: boolean;
    readAt?: any | null;
    createdAt: any;
  };
};

export type Chat_AddParticipantMutationVariables = Types.Exact<{
  chatId: Types.Scalars['String']['input'];
  userId: Types.Scalars['String']['input'];
}>;

export type Chat_AddParticipantMutation = {
  __typename?: 'Mutation';
  addChatParticipant: {
    __typename?: 'Chat';
    id: string;
    name?: string | null;
    description?: string | null;
    isGroup: boolean;
    createdAt: any;
    updatedAt: any;
    participants: Array<{
      __typename?: 'ChatParticipant';
      id: string;
      userId: string;
      chatId: string;
      joinedAt: any;
      lastReadAt?: any | null;
    }>;
  };
};

export type Chat_RemoveParticipantMutationVariables = Types.Exact<{
  chatId: Types.Scalars['String']['input'];
  userId: Types.Scalars['String']['input'];
}>;

export type Chat_RemoveParticipantMutation = {
  __typename?: 'Mutation';
  removeChatParticipant: {
    __typename?: 'Chat';
    id: string;
    name?: string | null;
    description?: string | null;
    isGroup: boolean;
    createdAt: any;
    updatedAt: any;
    participants: Array<{
      __typename?: 'ChatParticipant';
      id: string;
      userId: string;
      chatId: string;
      joinedAt: any;
      lastReadAt?: any | null;
    }>;
  };
};

export type Chat_MessageAddedSubscriptionVariables = Types.Exact<{
  chatId: Types.Scalars['String']['input'];
}>;

export type Chat_MessageAddedSubscription = {
  __typename?: 'Subscription';
  messageAdded: {
    __typename?: 'Message';
    id: string;
    chatId: string;
    senderId: string;
    content?: string | null;
    s3Key?: string | null;
    isRead: boolean;
    readAt?: any | null;
    createdAt: any;
  };
};

export const Chat_ParticipantFragmentDoc = gql`
  fragment Chat_Participant on ChatParticipant {
    id
    userId
    chatId
    joinedAt
    lastReadAt
  }
`;
export const Chat_BasicFragmentDoc = gql`
  fragment Chat_Basic on Chat {
    id
    name
    description
    isGroup
    createdAt
    updatedAt
    participants {
      ...Chat_Participant
    }
  }
  ${Chat_ParticipantFragmentDoc}
`;
export const Chat_MessageFragmentDoc = gql`
  fragment Chat_Message on Message {
    id
    chatId
    senderId
    content
    s3Key
    isRead
    readAt
    createdAt
  }
`;
export const Chat_WithMessagesFragmentDoc = gql`
  fragment Chat_WithMessages on Chat {
    ...Chat_Basic
    messages {
      ...Chat_Message
    }
  }
  ${Chat_BasicFragmentDoc}
  ${Chat_MessageFragmentDoc}
`;
export const Chat_GetMyChatsDocument = gql`
  query Chat_GetMyChats {
    myChats {
      ...Chat_WithMessages
    }
  }
  ${Chat_WithMessagesFragmentDoc}
`;

/**
 * __useChat_GetMyChatsQuery__
 *
 * To run a query within a React component, call `useChat_GetMyChatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useChat_GetMyChatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChat_GetMyChatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useChat_GetMyChatsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Chat_GetMyChatsQuery,
    Chat_GetMyChatsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Chat_GetMyChatsQuery, Chat_GetMyChatsQueryVariables>(
    Chat_GetMyChatsDocument,
    options
  );
}
export function useChat_GetMyChatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Chat_GetMyChatsQuery,
    Chat_GetMyChatsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Chat_GetMyChatsQuery,
    Chat_GetMyChatsQueryVariables
  >(Chat_GetMyChatsDocument, options);
}
export function useChat_GetMyChatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Chat_GetMyChatsQuery,
        Chat_GetMyChatsQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Chat_GetMyChatsQuery,
    Chat_GetMyChatsQueryVariables
  >(Chat_GetMyChatsDocument, options);
}
export type Chat_GetMyChatsQueryHookResult = ReturnType<
  typeof useChat_GetMyChatsQuery
>;
export type Chat_GetMyChatsLazyQueryHookResult = ReturnType<
  typeof useChat_GetMyChatsLazyQuery
>;
export type Chat_GetMyChatsSuspenseQueryHookResult = ReturnType<
  typeof useChat_GetMyChatsSuspenseQuery
>;
export type Chat_GetMyChatsQueryResult = Apollo.QueryResult<
  Chat_GetMyChatsQuery,
  Chat_GetMyChatsQueryVariables
>;
export const Chat_GetChatDocument = gql`
  query Chat_GetChat($chatId: String!) {
    chat(chatId: $chatId) {
      ...Chat_WithMessages
    }
  }
  ${Chat_WithMessagesFragmentDoc}
`;

/**
 * __useChat_GetChatQuery__
 *
 * To run a query within a React component, call `useChat_GetChatQuery` and pass it any options that fit your needs.
 * When your component renders, `useChat_GetChatQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChat_GetChatQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChat_GetChatQuery(
  baseOptions: Apollo.QueryHookOptions<
    Chat_GetChatQuery,
    Chat_GetChatQueryVariables
  > &
    (
      | { variables: Chat_GetChatQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Chat_GetChatQuery, Chat_GetChatQueryVariables>(
    Chat_GetChatDocument,
    options
  );
}
export function useChat_GetChatLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Chat_GetChatQuery,
    Chat_GetChatQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<Chat_GetChatQuery, Chat_GetChatQueryVariables>(
    Chat_GetChatDocument,
    options
  );
}
export function useChat_GetChatSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Chat_GetChatQuery,
        Chat_GetChatQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<Chat_GetChatQuery, Chat_GetChatQueryVariables>(
    Chat_GetChatDocument,
    options
  );
}
export type Chat_GetChatQueryHookResult = ReturnType<
  typeof useChat_GetChatQuery
>;
export type Chat_GetChatLazyQueryHookResult = ReturnType<
  typeof useChat_GetChatLazyQuery
>;
export type Chat_GetChatSuspenseQueryHookResult = ReturnType<
  typeof useChat_GetChatSuspenseQuery
>;
export type Chat_GetChatQueryResult = Apollo.QueryResult<
  Chat_GetChatQuery,
  Chat_GetChatQueryVariables
>;
export const Chat_GetMessagesDocument = gql`
  query Chat_GetMessages($chatId: String!, $cursor: String, $limit: Float) {
    chatMessages(chatId: $chatId, cursor: $cursor, limit: $limit) {
      ...Chat_Message
    }
  }
  ${Chat_MessageFragmentDoc}
`;

/**
 * __useChat_GetMessagesQuery__
 *
 * To run a query within a React component, call `useChat_GetMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useChat_GetMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChat_GetMessagesQuery({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      cursor: // value for 'cursor'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useChat_GetMessagesQuery(
  baseOptions: Apollo.QueryHookOptions<
    Chat_GetMessagesQuery,
    Chat_GetMessagesQueryVariables
  > &
    (
      | { variables: Chat_GetMessagesQueryVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<Chat_GetMessagesQuery, Chat_GetMessagesQueryVariables>(
    Chat_GetMessagesDocument,
    options
  );
}
export function useChat_GetMessagesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Chat_GetMessagesQuery,
    Chat_GetMessagesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Chat_GetMessagesQuery,
    Chat_GetMessagesQueryVariables
  >(Chat_GetMessagesDocument, options);
}
export function useChat_GetMessagesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Chat_GetMessagesQuery,
        Chat_GetMessagesQueryVariables
      >
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Chat_GetMessagesQuery,
    Chat_GetMessagesQueryVariables
  >(Chat_GetMessagesDocument, options);
}
export type Chat_GetMessagesQueryHookResult = ReturnType<
  typeof useChat_GetMessagesQuery
>;
export type Chat_GetMessagesLazyQueryHookResult = ReturnType<
  typeof useChat_GetMessagesLazyQuery
>;
export type Chat_GetMessagesSuspenseQueryHookResult = ReturnType<
  typeof useChat_GetMessagesSuspenseQuery
>;
export type Chat_GetMessagesQueryResult = Apollo.QueryResult<
  Chat_GetMessagesQuery,
  Chat_GetMessagesQueryVariables
>;
export const Chat_CreateDocument = gql`
  mutation Chat_Create(
    $participantIds: [String!]!
    $name: String
    $isGroup: Boolean
  ) {
    createChat(
      participantIds: $participantIds
      name: $name
      isGroup: $isGroup
    ) {
      ...Chat_Basic
    }
  }
  ${Chat_BasicFragmentDoc}
`;
export type Chat_CreateMutationFn = Apollo.MutationFunction<
  Chat_CreateMutation,
  Chat_CreateMutationVariables
>;

/**
 * __useChat_CreateMutation__
 *
 * To run a mutation, you first call `useChat_CreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChat_CreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chatCreateMutation, { data, loading, error }] = useChat_CreateMutation({
 *   variables: {
 *      participantIds: // value for 'participantIds'
 *      name: // value for 'name'
 *      isGroup: // value for 'isGroup'
 *   },
 * });
 */
export function useChat_CreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Chat_CreateMutation,
    Chat_CreateMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<Chat_CreateMutation, Chat_CreateMutationVariables>(
    Chat_CreateDocument,
    options
  );
}
export type Chat_CreateMutationHookResult = ReturnType<
  typeof useChat_CreateMutation
>;
export type Chat_CreateMutationResult =
  Apollo.MutationResult<Chat_CreateMutation>;
export type Chat_CreateMutationOptions = Apollo.BaseMutationOptions<
  Chat_CreateMutation,
  Chat_CreateMutationVariables
>;
export const Chat_SendMessageDocument = gql`
  mutation Chat_SendMessage(
    $chatId: String!
    $content: String
    $receiverId: String
    $s3Key: String
  ) {
    sendMessage(
      chatId: $chatId
      content: $content
      receiverId: $receiverId
      s3Key: $s3Key
    ) {
      ...Chat_Message
    }
  }
  ${Chat_MessageFragmentDoc}
`;
export type Chat_SendMessageMutationFn = Apollo.MutationFunction<
  Chat_SendMessageMutation,
  Chat_SendMessageMutationVariables
>;

/**
 * __useChat_SendMessageMutation__
 *
 * To run a mutation, you first call `useChat_SendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChat_SendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chatSendMessageMutation, { data, loading, error }] = useChat_SendMessageMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      content: // value for 'content'
 *      receiverId: // value for 'receiverId'
 *      s3Key: // value for 's3Key'
 *   },
 * });
 */
export function useChat_SendMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Chat_SendMessageMutation,
    Chat_SendMessageMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Chat_SendMessageMutation,
    Chat_SendMessageMutationVariables
  >(Chat_SendMessageDocument, options);
}
export type Chat_SendMessageMutationHookResult = ReturnType<
  typeof useChat_SendMessageMutation
>;
export type Chat_SendMessageMutationResult =
  Apollo.MutationResult<Chat_SendMessageMutation>;
export type Chat_SendMessageMutationOptions = Apollo.BaseMutationOptions<
  Chat_SendMessageMutation,
  Chat_SendMessageMutationVariables
>;
export const Chat_MarkMessageAsReadDocument = gql`
  mutation Chat_MarkMessageAsRead($messageId: String!) {
    markMessageAsRead(messageId: $messageId) {
      ...Chat_Message
    }
  }
  ${Chat_MessageFragmentDoc}
`;
export type Chat_MarkMessageAsReadMutationFn = Apollo.MutationFunction<
  Chat_MarkMessageAsReadMutation,
  Chat_MarkMessageAsReadMutationVariables
>;

/**
 * __useChat_MarkMessageAsReadMutation__
 *
 * To run a mutation, you first call `useChat_MarkMessageAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChat_MarkMessageAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chatMarkMessageAsReadMutation, { data, loading, error }] = useChat_MarkMessageAsReadMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useChat_MarkMessageAsReadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Chat_MarkMessageAsReadMutation,
    Chat_MarkMessageAsReadMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Chat_MarkMessageAsReadMutation,
    Chat_MarkMessageAsReadMutationVariables
  >(Chat_MarkMessageAsReadDocument, options);
}
export type Chat_MarkMessageAsReadMutationHookResult = ReturnType<
  typeof useChat_MarkMessageAsReadMutation
>;
export type Chat_MarkMessageAsReadMutationResult =
  Apollo.MutationResult<Chat_MarkMessageAsReadMutation>;
export type Chat_MarkMessageAsReadMutationOptions = Apollo.BaseMutationOptions<
  Chat_MarkMessageAsReadMutation,
  Chat_MarkMessageAsReadMutationVariables
>;
export const Chat_UpdateLastReadDocument = gql`
  mutation Chat_UpdateLastRead($chatId: String!) {
    updateLastRead(chatId: $chatId) {
      ...Chat_Basic
    }
  }
  ${Chat_BasicFragmentDoc}
`;
export type Chat_UpdateLastReadMutationFn = Apollo.MutationFunction<
  Chat_UpdateLastReadMutation,
  Chat_UpdateLastReadMutationVariables
>;

/**
 * __useChat_UpdateLastReadMutation__
 *
 * To run a mutation, you first call `useChat_UpdateLastReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChat_UpdateLastReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chatUpdateLastReadMutation, { data, loading, error }] = useChat_UpdateLastReadMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChat_UpdateLastReadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Chat_UpdateLastReadMutation,
    Chat_UpdateLastReadMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Chat_UpdateLastReadMutation,
    Chat_UpdateLastReadMutationVariables
  >(Chat_UpdateLastReadDocument, options);
}
export type Chat_UpdateLastReadMutationHookResult = ReturnType<
  typeof useChat_UpdateLastReadMutation
>;
export type Chat_UpdateLastReadMutationResult =
  Apollo.MutationResult<Chat_UpdateLastReadMutation>;
export type Chat_UpdateLastReadMutationOptions = Apollo.BaseMutationOptions<
  Chat_UpdateLastReadMutation,
  Chat_UpdateLastReadMutationVariables
>;
export const Chat_DeleteMessageDocument = gql`
  mutation Chat_DeleteMessage($messageId: String!) {
    deleteMessage(messageId: $messageId) {
      ...Chat_Message
    }
  }
  ${Chat_MessageFragmentDoc}
`;
export type Chat_DeleteMessageMutationFn = Apollo.MutationFunction<
  Chat_DeleteMessageMutation,
  Chat_DeleteMessageMutationVariables
>;

/**
 * __useChat_DeleteMessageMutation__
 *
 * To run a mutation, you first call `useChat_DeleteMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChat_DeleteMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chatDeleteMessageMutation, { data, loading, error }] = useChat_DeleteMessageMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useChat_DeleteMessageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Chat_DeleteMessageMutation,
    Chat_DeleteMessageMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Chat_DeleteMessageMutation,
    Chat_DeleteMessageMutationVariables
  >(Chat_DeleteMessageDocument, options);
}
export type Chat_DeleteMessageMutationHookResult = ReturnType<
  typeof useChat_DeleteMessageMutation
>;
export type Chat_DeleteMessageMutationResult =
  Apollo.MutationResult<Chat_DeleteMessageMutation>;
export type Chat_DeleteMessageMutationOptions = Apollo.BaseMutationOptions<
  Chat_DeleteMessageMutation,
  Chat_DeleteMessageMutationVariables
>;
export const Chat_AddParticipantDocument = gql`
  mutation Chat_AddParticipant($chatId: String!, $userId: String!) {
    addChatParticipant(chatId: $chatId, userId: $userId) {
      ...Chat_Basic
    }
  }
  ${Chat_BasicFragmentDoc}
`;
export type Chat_AddParticipantMutationFn = Apollo.MutationFunction<
  Chat_AddParticipantMutation,
  Chat_AddParticipantMutationVariables
>;

/**
 * __useChat_AddParticipantMutation__
 *
 * To run a mutation, you first call `useChat_AddParticipantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChat_AddParticipantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chatAddParticipantMutation, { data, loading, error }] = useChat_AddParticipantMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useChat_AddParticipantMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Chat_AddParticipantMutation,
    Chat_AddParticipantMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Chat_AddParticipantMutation,
    Chat_AddParticipantMutationVariables
  >(Chat_AddParticipantDocument, options);
}
export type Chat_AddParticipantMutationHookResult = ReturnType<
  typeof useChat_AddParticipantMutation
>;
export type Chat_AddParticipantMutationResult =
  Apollo.MutationResult<Chat_AddParticipantMutation>;
export type Chat_AddParticipantMutationOptions = Apollo.BaseMutationOptions<
  Chat_AddParticipantMutation,
  Chat_AddParticipantMutationVariables
>;
export const Chat_RemoveParticipantDocument = gql`
  mutation Chat_RemoveParticipant($chatId: String!, $userId: String!) {
    removeChatParticipant(chatId: $chatId, userId: $userId) {
      ...Chat_Basic
    }
  }
  ${Chat_BasicFragmentDoc}
`;
export type Chat_RemoveParticipantMutationFn = Apollo.MutationFunction<
  Chat_RemoveParticipantMutation,
  Chat_RemoveParticipantMutationVariables
>;

/**
 * __useChat_RemoveParticipantMutation__
 *
 * To run a mutation, you first call `useChat_RemoveParticipantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChat_RemoveParticipantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [chatRemoveParticipantMutation, { data, loading, error }] = useChat_RemoveParticipantMutation({
 *   variables: {
 *      chatId: // value for 'chatId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useChat_RemoveParticipantMutation(
  baseOptions?: Apollo.MutationHookOptions<
    Chat_RemoveParticipantMutation,
    Chat_RemoveParticipantMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    Chat_RemoveParticipantMutation,
    Chat_RemoveParticipantMutationVariables
  >(Chat_RemoveParticipantDocument, options);
}
export type Chat_RemoveParticipantMutationHookResult = ReturnType<
  typeof useChat_RemoveParticipantMutation
>;
export type Chat_RemoveParticipantMutationResult =
  Apollo.MutationResult<Chat_RemoveParticipantMutation>;
export type Chat_RemoveParticipantMutationOptions = Apollo.BaseMutationOptions<
  Chat_RemoveParticipantMutation,
  Chat_RemoveParticipantMutationVariables
>;
export const Chat_MessageAddedDocument = gql`
  subscription Chat_MessageAdded($chatId: String!) {
    messageAdded(chatId: $chatId) {
      ...Chat_Message
    }
  }
  ${Chat_MessageFragmentDoc}
`;

/**
 * __useChat_MessageAddedSubscription__
 *
 * To run a query within a React component, call `useChat_MessageAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useChat_MessageAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChat_MessageAddedSubscription({
 *   variables: {
 *      chatId: // value for 'chatId'
 *   },
 * });
 */
export function useChat_MessageAddedSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    Chat_MessageAddedSubscription,
    Chat_MessageAddedSubscriptionVariables
  > &
    (
      | { variables: Chat_MessageAddedSubscriptionVariables; skip?: boolean }
      | { skip: boolean }
    )
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    Chat_MessageAddedSubscription,
    Chat_MessageAddedSubscriptionVariables
  >(Chat_MessageAddedDocument, options);
}
export type Chat_MessageAddedSubscriptionHookResult = ReturnType<
  typeof useChat_MessageAddedSubscription
>;
export type Chat_MessageAddedSubscriptionResult =
  Apollo.SubscriptionResult<Chat_MessageAddedSubscription>;
