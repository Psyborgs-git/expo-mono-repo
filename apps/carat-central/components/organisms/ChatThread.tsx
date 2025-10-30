import React, { useRef, useEffect } from 'react';
import { FlatList } from 'react-native';
import { YStack } from 'tamagui';
import { MessageBubble } from '../molecules/MessageBubble';

export interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  isRead?: boolean;
}

export interface ChatThreadProps {
  messages: ChatMessage[];
  currentUserId: string;
  onLoadMore?: () => void;
}

export const ChatThread: React.FC<ChatThreadProps> = ({
  messages,
  currentUserId,
  onLoadMore,
}) => {
  const ref = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length) {
      setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  return (
    <YStack flex={1}>
      <FlatList
        ref={ref}
        data={messages}
        renderItem={({ item }) => (
          <MessageBubble
            message={item.content}
            timestamp={item.createdAt}
            variant={item.senderId === currentUserId ? 'sent' : 'received'}
            senderName={item.senderName}
            senderAvatar={item.senderAvatar}
            isRead={item.isRead}
          />
        )}
        keyExtractor={item => item.id}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
      />
    </YStack>
  );
};

ChatThread.displayName = 'ChatThread';
