import React, { useState, useCallback, useMemo } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  YStack, 
  XStack, 
  Text, 
  Button, 
  Input,
  Card,
  Avatar,
  Badge,
  Separator,
  Spinner,
  H4,
  H6,
} from 'tamagui';
import { Search, MessageCircle, Plus, Users } from '@tamagui/lucide-icons';
import { useGetMyChatsQuery } from '../../src/graphql/chats/chats.generated';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocketConnection } from '../../hooks/useWebSocketConnection';
import type { Chat_WithMessagesFragment } from '../../src/graphql/chats/chats.generated';

interface ChatListItemProps {
  chat: Chat_WithMessagesFragment;
  currentUserId: string;
  onPress: (chatId: string) => void;
}

function ChatListItem({ chat, currentUserId, onPress }: ChatListItemProps) {
  const router = useRouter();
  
  // Get the other participant for 1-on-1 chats
  const otherParticipant = chat.participants.find(p => p.userId !== currentUserId);
  
  // Get the latest message
  const latestMessage = chat.messages[chat.messages.length - 1];
  
  // Calculate unread count
  const unreadCount = chat.messages.filter(msg => 
    msg.senderId !== currentUserId && !msg.isRead
  ).length;
  
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handlePress = () => {
    onPress(chat.id);
    router.push(`/chat/${chat.id}`);
  };

  return (
    <Card
      pressStyle={{ scale: 0.98 }}
      onPress={handlePress}
      padding="$3"
      marginHorizontal="$3"
      marginVertical="$1"
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <XStack alignItems="center" space="$3">
        {/* Avatar */}
        <Avatar circular size="$5">
          <Avatar.Image 
            source={{ 
              uri: `https://api.dicebear.com/7.x/initials/svg?seed=${
                chat.isGroup ? chat.name : otherParticipant?.userId
              }` 
            }} 
          />
          <Avatar.Fallback backgroundColor="$blue10">
            {chat.isGroup ? (
              <Users size={20} color="white" />
            ) : (
              <Text color="white" fontSize="$4" fontWeight="600">
                {otherParticipant?.userId?.charAt(0).toUpperCase() || '?'}
              </Text>
            )}
          </Avatar.Fallback>
        </Avatar>

        {/* Chat Info */}
        <YStack flex={1} space="$1">
          <XStack alignItems="center" justifyContent="space-between">
            <Text 
              fontSize="$4" 
              fontWeight="600" 
              color="$color"
              numberOfLines={1}
              flex={1}
            >
              {chat.isGroup ? chat.name : `User ${otherParticipant?.userId}`}
            </Text>
            
            {latestMessage && (
              <Text fontSize="$2" color="$color">
                {formatTime(latestMessage.createdAt)}
              </Text>
            )}
          </XStack>

          <XStack alignItems="center" justifyContent="space-between">
            <Text 
              fontSize="$3" 
              color="$color" 
              numberOfLines={1}
              flex={1}
            >
              {latestMessage ? (
                latestMessage.content || (latestMessage.s3Key ? '📎 Attachment' : 'No message')
              ) : (
                'No messages yet'
              )}
            </Text>
            
            {unreadCount > 0 && (
              <Badge 
                size="$2" 
                backgroundColor="$blue10"
                color="white"
                marginLeft="$2"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
}

export default function ChatListScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const { data, loading, error, refetch } = useGetMyChatsQuery({
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  const { state: wsState } = useWebSocketConnection();

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!data?.myChats || !searchQuery.trim()) {
      return data?.myChats || [];
    }

    return data.myChats.filter(chat => {
      const searchLower = searchQuery.toLowerCase();
      
      // Search in chat name (for group chats)
      if (chat.name?.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search in participant names (for 1-on-1 chats)
      const otherParticipant = chat.participants.find(p => p.userId !== user?.id);
      if (otherParticipant?.userId.toLowerCase().includes(searchLower)) {
        return true;
      }
      
      // Search in recent messages
      const recentMessages = chat.messages.slice(-5);
      return recentMessages.some(msg => 
        msg.content?.toLowerCase().includes(searchLower)
      );
    });
  }, [data?.myChats, searchQuery, user?.id]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refresh chats:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleChatPress = useCallback((chatId: string) => {
    // This will be handled by the ChatListItem component
  }, []);

  const handleNewChat = useCallback(() => {
    router.push('/chat/contacts');
  }, [router]);

  const renderChatItem = useCallback(({ item }: { item: Chat_WithMessagesFragment }) => (
    <ChatListItem 
      chat={item} 
      currentUserId={user?.id || ''} 
      onPress={handleChatPress}
    />
  ), [user?.id, handleChatPress]);

  const renderEmptyState = () => (
    <YStack alignItems="center" justifyContent="center" padding="$6" space="$4">
      <MessageCircle size={64} color="$color" />
      <YStack alignItems="center" space="$2">
        <H4 color="$color">No conversations yet</H4>
        <Text color="$color" textAlign="center">
          Start a new conversation to begin chatting with other users
        </Text>
      </YStack>
      <Button 
        size="$4" 
        backgroundColor="$primary" 
        icon={Plus}
        onPress={handleNewChat}
      >
        Start New Chat
      </Button>
    </YStack>
  );

  const renderConnectionStatus = () => {
    if (!wsState.isConnected && !wsState.isConnecting) {
      return (
        <XStack 
          backgroundColor="$orange5" 
          padding="$2" 
          alignItems="center" 
          justifyContent="center"
          space="$2"
        >
          <Text fontSize="$2" color="$orange11">
            {wsState.error || 'Disconnected from chat server'}
          </Text>
        </XStack>
      );
    }
    
    if (wsState.isConnecting) {
      return (
        <XStack 
          backgroundColor="$blue5" 
          padding="$2" 
          alignItems="center" 
          justifyContent="center"
          space="$2"
        >
          <Spinner size="small" color="$blue11" />
          <Text fontSize="$2" color="$blue11">
            Connecting to chat server...
          </Text>
        </XStack>
      );
    }
    
    return null;
  };

  if (loading && !data) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" space="$4">
        <Spinner size="large" color="$blue10" />
        <Text color="$color">Loading conversations...</Text>
      </YStack>
    );
  }

  if (error && !data) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" space="$4" padding="$4">
        <MessageCircle size={64} color="$red10" />
        <YStack alignItems="center" space="$2">
          <H4 color="$red10">Failed to load chats</H4>
          <Text color="$color" textAlign="center">
            {error.message}
          </Text>
        </YStack>
        <Button onPress={handleRefresh} backgroundColor="$primary">
          Try Again
        </Button>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <Stack.Screen 
        options={{
          title: 'Messages',
          headerRight: () => (
            <Button 
              size="$3" 
              circular 
              icon={Plus} 
              onPress={handleNewChat}
              chromeless
            />
          ),
        }} 
      />
      
      {renderConnectionStatus()}
      
      {/* Search Bar */}
      <XStack padding="$3" space="$2">
        <Input
          flex={1}
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          size="$4"
        />
        <Button size="$4" icon={Search} chromeless />
      </XStack>

      {/* Chat List */}
      <YStack flex={1}>
        {filteredChats.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="$blue10"
              />
            }
            ItemSeparatorComponent={() => <Separator marginHorizontal="$3" />}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </YStack>
    </YStack>
  );
}