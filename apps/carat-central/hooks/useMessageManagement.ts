import { useState, useCallback, useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { 
  useChat_GetMessagesQuery,
  useDeleteMessageMutation,
  useChat_MarkMessageAsReadMutation,
  type Chat_MessageFragment,
  GetChatMessagesDocument,
} from '../src/graphql/chats/chats.generated';

export interface MessageManagementOptions {
  chatId: string;
  pageSize?: number;
  enableSearch?: boolean;
  enablePagination?: boolean;
}

export interface MessageManagementState {
  messages: Chat_MessageFragment[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: Error | null;
  searchQuery: string;
  filteredMessages: Chat_MessageFragment[];
  selectedMessages: Set<string>;
}

export interface MessageManagementActions {
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  searchMessages: (query: string) => void;
  clearSearch: () => void;
  selectMessage: (messageId: string) => void;
  deselectMessage: (messageId: string) => void;
  selectAllMessages: () => void;
  clearSelection: () => void;
  deleteMessage: (messageId: string) => Promise<void>;
  deleteSelectedMessages: () => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export interface MessageManagement extends MessageManagementState, MessageManagementActions {}

export function useMessageManagement({
  chatId,
  pageSize = 50,
  enableSearch = true,
  enablePagination = true,
}: MessageManagementOptions): MessageManagement {
  const client = useApolloClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Main messages query
  const {
    data,
    loading: isLoading,
    error,
    fetchMore,
    refetch,
  } = useChat_GetMessagesQuery({
    variables: { 
      chatId, 
      limit: pageSize 
    },
    skip: !chatId,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Mutations
  const [deleteMessageMutation] = useDeleteMessageMutation({
    onError: (error) => {
      console.error('Delete message error:', error);
    },
  });

  const [markAsReadMutation] = useChat_MarkMessageAsReadMutation({
    onError: (error) => {
      console.error('Mark as read error:', error);
    },
  });

  const messages = data?.chatMessages || [];

  // Filter messages based on search query
  const filteredMessages = useMemo(() => {
    if (!enableSearch || !searchQuery.trim()) {
      return messages;
    }

    const query = searchQuery.toLowerCase();
    return messages.filter(message => 
      message.content?.toLowerCase().includes(query) ||
      message.senderId.toLowerCase().includes(query)
    );
  }, [messages, searchQuery, enableSearch]);

  // Check if there are more messages to load
  const hasMore = useMemo(() => {
    if (!enablePagination) return false;
    // This would typically come from pagination info in the GraphQL response
    // For now, we'll assume there are more if we have a full page
    return messages.length >= pageSize;
  }, [messages.length, pageSize, enablePagination]);

  // Load more messages
  const loadMore = useCallback(async () => {
    if (!enablePagination || isLoadingMore || !hasMore || !messages.length) {
      return;
    }

    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          chatId,
          cursor: messages[0]?.id, // Get older messages
          limit: pageSize,
        },
      });
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    enablePagination,
    isLoadingMore,
    hasMore,
    messages,
    fetchMore,
    chatId,
    pageSize,
  ]);

  // Refresh messages
  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refresh messages:', error);
    }
  }, [refetch]);

  // Search messages
  const searchMessages = useCallback((query: string) => {
    if (enableSearch) {
      setSearchQuery(query);
    }
  }, [enableSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Message selection
  const selectMessage = useCallback((messageId: string) => {
    setSelectedMessages(prev => new Set(prev).add(messageId));
  }, []);

  const deselectMessage = useCallback((messageId: string) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);

  const selectAllMessages = useCallback(() => {
    setSelectedMessages(new Set(filteredMessages.map(msg => msg.id)));
  }, [filteredMessages]);

  const clearSelection = useCallback(() => {
    setSelectedMessages(new Set());
  }, []);

  // Delete single message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await deleteMessageMutation({
        variables: { messageId },
        optimisticResponse: {
          deleteMessage: {
            __typename: 'Message',
            id: messageId,
            chatId,
            senderId: '',
            content: null,
            s3Key: null,
            isRead: false,
            readAt: null,
            createdAt: '',
          },
        },
        update: (cache) => {
          // Remove message from cache
          const existingData = cache.readQuery({
            query: GetChatMessagesDocument,
            variables: { chatId },
          });

          if (existingData) {
            cache.writeQuery({
              query: GetChatMessagesDocument,
              variables: { chatId },
              data: {
                chatMessages: existingData.chatMessages.filter(
                  msg => msg.id !== messageId
                ),
              },
            });
          }

          // Also remove from chat messages field
          cache.modify({
            id: `Chat:${chatId}`,
            fields: {
              messages(existingMessages = [], { readField }) {
                return existingMessages.filter(
                  (msgRef: any) => readField('id', msgRef) !== messageId
                );
              },
            },
          });
        },
      });

      // Remove from selection if selected
      deselectMessage(messageId);
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  }, [deleteMessageMutation, chatId, deselectMessage]);

  // Delete selected messages
  const deleteSelectedMessages = useCallback(async () => {
    const messagesToDelete = Array.from(selectedMessages);
    
    try {
      await Promise.all(
        messagesToDelete.map(messageId => deleteMessage(messageId))
      );
      clearSelection();
    } catch (error) {
      console.error('Failed to delete selected messages:', error);
      throw error;
    }
  }, [selectedMessages, deleteMessage, clearSelection]);

  // Mark single message as read
  const markAsRead = useCallback(async (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (!message || message.isRead) {
      return;
    }

    try {
      await markAsReadMutation({
        variables: { messageId },
        optimisticResponse: {
          markMessageAsRead: {
            ...message,
            isRead: true,
            readAt: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      throw error;
    }
  }, [messages, markAsReadMutation]);

  // Mark all messages as read
  const markAllAsRead = useCallback(async () => {
    const unreadMessages = messages.filter(msg => !msg.isRead);
    
    try {
      await Promise.all(
        unreadMessages.map(msg => markAsRead(msg.id))
      );
    } catch (error) {
      console.error('Failed to mark all messages as read:', error);
      throw error;
    }
  }, [messages, markAsRead]);

  return {
    // State
    messages,
    isLoading,
    isLoadingMore,
    hasMore,
    error: error || null,
    searchQuery,
    filteredMessages,
    selectedMessages,

    // Actions
    loadMore,
    refresh,
    searchMessages,
    clearSearch,
    selectMessage,
    deselectMessage,
    selectAllMessages,
    clearSelection,
    deleteMessage,
    deleteSelectedMessages,
    markAsRead,
    markAllAsRead,
  };
}

// Hook for message search with debouncing
export function useMessageSearch(chatId: string, debounceMs = 300) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setIsSearching(false);
    }, debounceMs);

    if (searchQuery) {
      setIsSearching(true);
    }

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Perform search
  const searchResults = useMemo(() => {
    // This would typically be a separate GraphQL query for searching messages
    // For now, we'll return empty results
    return [];
  }, [debouncedQuery]);

  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
    setIsSearching(false);
  }, []);

  return {
    searchQuery,
    debouncedQuery,
    isSearching,
    searchResults,
    updateSearchQuery,
    clearSearch,
  };
}

// Hook for read receipt management
export function useReadReceipts(chatId: string, currentUserId: string) {
  const client = useApolloClient();

  // Get unread messages count
  const getUnreadCount = useCallback(() => {
    try {
      const data = client.readQuery({
        query: GetChatMessagesDocument,
        variables: { chatId },
      });

      if (data?.chatMessages) {
        return data.chatMessages.filter(
          msg => msg.senderId !== currentUserId && !msg.isRead
        ).length;
      }
    } catch (error) {
      console.error('Failed to get unread count:', error);
    }
    
    return 0;
  }, [client, chatId, currentUserId]);

  // Mark messages as read when they come into view
  const markMessagesAsReadInView = useCallback(async (messageIds: string[]) => {
    const unreadMessageIds = messageIds.filter(id => {
      try {
        const message = client.readFragment({
          id: `Message:${id}`,
          fragment: gql`
            fragment MessageReadStatus on Message {
              id
              isRead
              senderId
            }
          `,
        });
        
        return message && !message.isRead && message.senderId !== currentUserId;
      } catch {
        return false;
      }
    });

    if (unreadMessageIds.length > 0) {
      // Mark messages as read in batches
      const batchSize = 10;
      for (let i = 0; i < unreadMessageIds.length; i += batchSize) {
        const batch = unreadMessageIds.slice(i, i + batchSize);
        await Promise.all(
          batch.map(messageId =>
            client.mutate({
              mutation: gql`
                mutation MarkMessageAsRead($messageId: String!) {
                  markMessageAsRead(messageId: $messageId) {
                    id
                    isRead
                    readAt
                  }
                }
              `,
              variables: { messageId },
            })
          )
        );
      }
    }
  }, [client, currentUserId]);

  return {
    getUnreadCount,
    markMessagesAsReadInView,
  };
}

import React from 'react';
import { gql } from '@apollo/client';