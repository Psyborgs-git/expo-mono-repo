import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  YStack, 
  XStack, 
  Text, 
  Button, 
  Input,
  Card,
  Avatar,
  Spinner,
  H6,
  ScrollView,
} from 'tamagui';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Image as ImageIcon,
} from '@tamagui/lucide-icons';
import { 
  useChat_GetChatQuery,
  useChat_GetMessagesQuery,
  useChat_SendMessageMutation,
  useChat_MarkMessageAsReadMutation,
  useChat_UpdateLastReadMutation,
  type Chat_MessageFragment,
  type Chat_WithMessagesFragment,
} from '../../src/graphql/chats/chats.generated';
import { useAuth } from '../../contexts/AuthContext';
import { useMessageSubscription } from '../../hooks/useMessageSubscription';

interface MessageBubbleProps {
  message: Chat_MessageFragment;
  isOwn: boolean;
  showAvatar?: boolean;
  onLongPress?: (message: Chat_MessageFragment) => void;
}

function MessageBubble({ message, isOwn, showAvatar = false, onLongPress }: MessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatus = () => {
    if (isOwn) {
      if (message.isRead) {
        return <CheckCheck size={14} color="$blue10" />;
      } else {
        return <Check size={14} color="$color" />;
      }
    }
    return null;
  };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(message);
    }
  };

  return (
    <XStack
      alignItems="flex-end"
      justifyContent={isOwn ? 'flex-end' : 'flex-start'}
      marginVertical="$1"
      paddingHorizontal="$3"
      space="$2"
    >
      {/* Avatar for received messages */}
      {!isOwn && showAvatar && (
        <Avatar circular size="$3">
          <Avatar.Image 
            source={{ 
              uri: `https://api.dicebear.com/7.x/initials/svg?seed=${message.senderId}` 
            }} 
          />
          <Avatar.Fallback backgroundColor="$blue10">
            <Text color="white" fontSize="$2" fontWeight="600">
              {message.senderId.charAt(0).toUpperCase()}
            </Text>
          </Avatar.Fallback>
        </Avatar>
      )}
      
      {/* Spacer for alignment */}
      {!isOwn && !showAvatar && <YStack width="$3" />}

      {/* Message Content */}
      <Card
        maxWidth="75%"
        padding="$3"
        backgroundColor={isOwn ? '$blue10' : '$gray5'}
        borderRadius="$4"
        pressStyle={{ scale: 0.98 }}
        onLongPress={handleLongPress}
      >
        <YStack space="$1">
          {/* Message content */}
          {message.content && (
            <Text 
              color={isOwn ? 'white' : '$color'} 
              fontSize="$4"
              lineHeight="$1"
            >
              {message.content}
            </Text>
          )}
          
          {/* Attachment indicator */}
          {message.s3Key && (
            <XStack alignItems="center" space="$2">
              <ImageIcon size={16} color={isOwn ? 'white' : '$color11'} />
              <Text 
                color={isOwn ? 'white' : '$color11'} 
                fontSize="$3"
                fontStyle="italic"
              >
                Attachment
              </Text>
            </XStack>
          )}
          
          {/* Timestamp and status */}
          <XStack alignItems="center" justifyContent="flex-end" space="$1" marginTop="$1">
            <Text 
              color={isOwn ? 'rgba(255,255,255,0.8)' : '$color11'} 
              fontSize="$2"
            >
              {formatTime(message.createdAt)}
            </Text>
            {getMessageStatus()}
          </XStack>
        </YStack>
      </Card>
    </XStack>
  );
}

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onAttachFile?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

function MessageInput({ onSendMessage, onAttachFile, isLoading, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleAttach = () => {
    if (onAttachFile && !isLoading && !disabled) {
      onAttachFile();
    }
  };

  return (
    <XStack 
      padding="$3" 
      space="$2" 
      alignItems="flex-end"
      backgroundColor="$background"
      borderTopWidth={1}
      borderTopColor="$borderColor"
    >
      <Button
        size="$4"
        circular
        icon={Paperclip}
        onPress={handleAttach}
        disabled={isLoading || disabled}
        chromeless
      />
      
      <Input
        flex={1}
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
        multiline
        maxHeight={100}
        size="$4"
        disabled={disabled}
        onSubmitEditing={handleSend}
        returnKeyType="send"
        blurOnSubmit={false}
      />
      
      <Button
        size="$4"
        circular
        icon={isLoading ? Spinner : Send}
        onPress={handleSend}
        disabled={!message.trim() || isLoading || disabled}
        backgroundColor="$primary"
      />
    </XStack>
  );
}

export default function ChatScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // GraphQL hooks
  const { data: chatData, loading: chatLoading, error: chatError } = useChat_GetChatQuery({
    variables: { chatId: chatId! },
    skip: !chatId,
    fetchPolicy: 'cache-and-network',
  });

  const { 
    data: messagesData, 
    loading: messagesLoading, 
    error: messagesError,
    fetchMore,
  } = useChat_GetMessagesQuery({
    variables: { chatId: chatId!, limit: 50 },
    skip: !chatId,
    fetchPolicy: 'cache-and-network',
  });

  const [sendMessage, { loading: sendingMessage }] = useChat_SendMessageMutation({
    onCompleted: () => {
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      console.error('Send message error:', error);
    },
  });

  const [markAsRead] = useChat_MarkMessageAsReadMutation();
  const [updateLastRead] = useChat_UpdateLastReadMutation();

  // Set up real-time message subscription
  const { isSubscribed, error: subscriptionError } = useMessageSubscription({
    chatId: chatId!,
    enabled: !!chatId,
    onMessageReceived: (newMessage) => {
      // Mark message as read if it's not from current user
      if (newMessage.senderId !== user?.id && !newMessage.isRead) {
        markAsRead({ 
          variables: { messageId: newMessage.id },
          optimisticResponse: {
            markMessageAsRead: {
              ...newMessage,
              isRead: true,
              readAt: new Date().toISOString(),
            },
          },
        });
      }
      
      // Scroll to bottom for new messages
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    },
    onError: (error) => {
      console.error('Message subscription error:', error);
    },
  });

  // Get chat info
  const chat = chatData?.chat;
  const messages = messagesData?.chatMessages || [];
  
  // Get other participant info
  const otherParticipant = useMemo(() => {
    if (!chat || chat.isGroup) return null;
    return chat.participants.find(p => p.userId !== user?.id);
  }, [chat, user?.id]);

  // Handle sending messages
  const handleSendMessage = useCallback(async (content: string) => {
    if (!chatId || !content.trim()) return;

    try {
      await sendMessage({
        variables: {
          chatId,
          content: content.trim(),
        },
        optimisticResponse: {
          sendMessage: {
            __typename: 'Message',
            id: `temp-${Date.now()}`,
            chatId,
            senderId: user?.id || '',
            content: content.trim(),
            s3Key: null,
            isRead: false,
            readAt: null,
            createdAt: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [chatId, sendMessage, user?.id]);

  // Handle file attachment
  const handleAttachFile = useCallback(() => {
    Alert.alert(
      'Attach File',
      'File attachment feature coming soon!',
      [{ text: 'OK' }]
    );
  }, []);

  // Handle message long press
  const handleMessageLongPress = useCallback((message: Chat_MessageFragment) => {
    const isOwn = message.senderId === user?.id;
    const options = ['Copy'];
    
    if (isOwn) {
      options.push('Delete');
    }
    
    options.push('Cancel');

    Alert.alert(
      'Message Options',
      message.content || 'Attachment',
      options.map((option, index) => ({
        text: option,
        style: option === 'Cancel' ? 'cancel' : option === 'Delete' ? 'destructive' : 'default',
        onPress: () => {
          if (option === 'Copy' && message.content) {
            // Copy to clipboard - would need Clipboard API
            Alert.alert('Copied', 'Message copied to clipboard');
          } else if (option === 'Delete') {
            // Delete message - would need delete mutation
            Alert.alert('Delete', 'Delete message feature coming soon!');
          }
        },
      }))
    );
  }, [user?.id]);

  // Load more messages
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !messages.length) return;

    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          cursor: messages[0]?.id,
          limit: 20,
        },
      });
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchMore, messages, isLoadingMore]);

  // Mark chat as read when entering
  useEffect(() => {
    if (chatId && user?.id) {
      updateLastRead({ variables: { chatId } });
    }
  }, [chatId, user?.id, updateLastRead]);

  // Render message item
  const renderMessage = useCallback(({ item, index }: { item: Chat_MessageFragment; index: number }) => {
    const isOwn = item.senderId === user?.id;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !isOwn && (!previousMessage || previousMessage.senderId !== item.senderId);

    return (
      <MessageBubble
        message={item}
        isOwn={isOwn}
        showAvatar={showAvatar}
        onLongPress={handleMessageLongPress}
      />
    );
  }, [messages, user?.id, handleMessageLongPress]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Loading state
  if (chatLoading || messagesLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" space="$4">
        <Spinner size="large" color="$blue10" />
        <Text color="$color">Loading chat...</Text>
      </YStack>
    );
  }

  // Error state
  if (chatError || messagesError) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" space="$4" padding="$4">
        <Text color="$red10" textAlign="center">
          {chatError?.message || messagesError?.message || 'Failed to load chat'}
        </Text>
        <Button onPress={handleBack} backgroundColor="$primary">
          Go Back
        </Button>
      </YStack>
    );
  }

  // Chat not found
  if (!chat) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" space="$4" padding="$4">
        <Text color="$color" textAlign="center">
          Chat not found
        </Text>
        <Button onPress={handleBack} backgroundColor="$primary">
          Go Back
        </Button>
      </YStack>
    );
  }

  const chatTitle = chat.isGroup ? chat.name : `User ${otherParticipant?.userId}`;
  const isOnline = true; // Would come from real-time presence data

  return (
    <KeyboardAvoidingView 
      flex={1} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <YStack flex={1} backgroundColor="$background">
        <Stack.Screen 
          options={{
            title: chatTitle || 'Chat',
            headerLeft: () => (
              <Button 
                size="$3" 
                circular 
                icon={ArrowLeft} 
                onPress={handleBack}
                chromeless
              />
            ),
            headerRight: () => (
              <Button 
                size="$3" 
                circular 
                icon={MoreVertical} 
                onPress={() => Alert.alert('Options', 'Chat options coming soon!')}
                chromeless
              />
            ),
            headerTitle: () => (
              <YStack alignItems="center">
                <Text fontSize="$5" fontWeight="600" color="$color">
                  {chatTitle}
                </Text>
                {!chat.isGroup && (
                  <Text fontSize="$2" color="$color">
                    {isOnline ? 'Online' : 'Last seen recently'}
                  </Text>
                )}
              </YStack>
            ),
          }} 
        />

        {/* Connection status */}
        {!isSubscribed && (
          <XStack 
            backgroundColor="$orange5" 
            padding="$2" 
            alignItems="center" 
            justifyContent="center"
          >
            <Text fontSize="$2" color="$orange11">
              {subscriptionError?.message || 'Connecting to chat...'}
            </Text>
          </XStack>
        )}

        {/* Messages List */}
        <YStack flex={1}>
          {messages.length === 0 ? (
            <YStack flex={1} alignItems="center" justifyContent="center" space="$4">
              <Text color="$color" textAlign="center">
                No messages yet. Start the conversation!
              </Text>
            </YStack>
          ) : (
            <FlatList
              ref={flatListRef}
              data={[...messages].reverse()} // Reverse to show latest at bottom
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              ListHeaderComponent={
                isLoadingMore ? (
                  <XStack alignItems="center" justifyContent="center" padding="$3">
                    <Spinner size="small" color="$blue10" />
                    <Text color="$color" marginLeft="$2">Loading more...</Text>
                  </XStack>
                ) : null
              }
              contentContainerStyle={{ 
                paddingVertical: 10,
                flexGrow: 1,
                justifyContent: 'flex-end',
              }}
              showsVerticalScrollIndicator={false}
              inverted={false}
            />
          )}
        </YStack>

        {/* Message Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onAttachFile={handleAttachFile}
          isLoading={sendingMessage}
          disabled={!isSubscribed}
        />
      </YStack>
    </KeyboardAvoidingView>
  );
}