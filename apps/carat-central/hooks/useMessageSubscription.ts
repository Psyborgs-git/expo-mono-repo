import { useEffect, useRef, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { useMessageAddedSubscription } from '../src/graphql/chats/chats.generated';
import type { Chat_MessageFragment } from '../src/graphql/chats/chats.generated';

export interface MessageSubscriptionOptions {
  chatId: string;
  onMessageReceived?: (message: Chat_MessageFragment) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export interface MessageSubscriptionManager {
  isSubscribed: boolean;
  error: Error | null;
  lastMessage: Chat_MessageFragment | null;
  subscribe: () => void;
  unsubscribe: () => void;
}

export function useMessageSubscription({
  chatId,
  onMessageReceived,
  onError,
  enabled = true,
}: MessageSubscriptionOptions): MessageSubscriptionManager {
  const client = useApolloClient();
  const subscriptionRef = useRef<any>(null);
  const lastMessageRef = useRef<Chat_MessageFragment | null>(null);
  const isSubscribedRef = useRef(false);
  const errorRef = useRef<Error | null>(null);

  const { data, error, loading } = useMessageAddedSubscription({
    variables: { chatId },
    skip: !enabled || !chatId,
    onData: ({ data }) => {
      if (data?.data?.messageAdded) {
        const message = data.data.messageAdded;
        lastMessageRef.current = message;
        
        // Call the callback if provided
        if (onMessageReceived) {
          onMessageReceived(message);
        }

        // Update Apollo cache to add the new message
        client.cache.modify({
          id: `Chat:${chatId}`,
          fields: {
            messages(existingMessages = []) {
              const messageRef = client.cache.writeFragment({
                data: message,
                fragment: gql`
                  fragment NewMessage on Message {
                    id
                    chatId
                    senderId
                    content
                    s3Key
                    isRead
                    readAt
                    createdAt
                  }
                `,
              });
              
              // Check if message already exists to avoid duplicates
              const messageExists = existingMessages.some(
                (msg: any) => msg.__ref === messageRef?.__ref
              );
              
              if (!messageExists && messageRef) {
                return [...existingMessages, messageRef];
              }
              
              return existingMessages;
            },
          },
        });

        // Also update the chatMessages query cache
        const existingMessages = client.cache.readQuery({
          query: gql`
            query GetChatMessages($chatId: String!) {
              chatMessages(chatId: $chatId) {
                id
                chatId
                senderId
                content
                s3Key
                isRead
                readAt
                createdAt
              }
            }
          `,
          variables: { chatId },
        });

        if (existingMessages) {
          client.cache.writeQuery({
            query: gql`
              query GetChatMessages($chatId: String!) {
                chatMessages(chatId: $chatId) {
                  id
                  chatId
                  senderId
                  content
                  s3Key
                  isRead
                  readAt
                  createdAt
                }
              }
            `,
            variables: { chatId },
            data: {
              chatMessages: [...existingMessages.chatMessages, message],
            },
          });
        }
      }
    },
    onError: (subscriptionError) => {
      errorRef.current = subscriptionError;
      if (onError) {
        onError(subscriptionError);
      }
    },
  });

  const subscribe = useCallback(() => {
    if (!enabled || !chatId) {
      return;
    }
    
    isSubscribedRef.current = true;
    errorRef.current = null;
  }, [enabled, chatId]);

  const unsubscribe = useCallback(() => {
    isSubscribedRef.current = false;
    errorRef.current = null;
    lastMessageRef.current = null;
  }, []);

  // Auto-subscribe when enabled and chatId changes
  useEffect(() => {
    if (enabled && chatId) {
      subscribe();
    } else {
      unsubscribe();
    }

    return () => {
      unsubscribe();
    };
  }, [enabled, chatId, subscribe, unsubscribe]);

  // Update subscription state based on loading and error
  useEffect(() => {
    if (error) {
      errorRef.current = error;
      isSubscribedRef.current = false;
    } else if (!loading && enabled && chatId) {
      isSubscribedRef.current = true;
      errorRef.current = null;
    }
  }, [error, loading, enabled, chatId]);

  return {
    isSubscribed: isSubscribedRef.current && !loading && !error,
    error: errorRef.current,
    lastMessage: lastMessageRef.current,
    subscribe,
    unsubscribe,
  };
}

// Helper hook for managing multiple chat subscriptions
export function useMultipleMessageSubscriptions(chatIds: string[]) {
  const subscriptions = chatIds.map(chatId => 
    useMessageSubscription({ 
      chatId, 
      enabled: true 
    })
  );

  return {
    subscriptions,
    allSubscribed: subscriptions.every(sub => sub.isSubscribed),
    hasErrors: subscriptions.some(sub => sub.error !== null),
    errors: subscriptions.filter(sub => sub.error).map(sub => sub.error),
  };
}

// Import gql for cache operations
import { gql } from '@apollo/client';