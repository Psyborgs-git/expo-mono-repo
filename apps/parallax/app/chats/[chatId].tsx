import { useState, useEffect, useRef } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { YStack, XStack, Text, Input, Button, Avatar, Stack, useTheme } from 'tamagui';
import { useLocalSearchParams, Stack as NavStack } from 'expo-router';
import { Send } from '@tamagui/lucide-icons';
import { api } from '../../src/lib/api';
import { Message, Chat } from '../../src/lib/types';
import { LinearGradient } from 'tamagui/linear-gradient';

export default function ChatDetailsScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const theme = useTheme();

  const loadMessages = async () => {
    try {
      const [messagesResponse, chatsResponse] = await Promise.all([
        api.getChatMessages(chatId),
        api.getChats(),
      ]);

      setMessages(messagesResponse.items.reverse()); // Newest at bottom

      const currentChat = chatsResponse.find((c) => c.id === chatId);
      setChat(currentChat || null);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [chatId]);

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const sentMessage = await api.sendMessage(chatId, messageText);
      setMessages((prev) => [...prev, sentMessage]);
      
      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      setNewMessage(messageText); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const otherUser = chat?.participants.find((p) => p.id !== 'current-user');

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isCurrentUser = item.senderId === 'current-user';

    return (
      <Stack
        animation="quick"
        enterStyle={{
          opacity: 0,
          scale: 0.9,
          y: 10,
        }}
        opacity={1}
        scale={1}
        y={0}
      >
        <XStack
          justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
          paddingHorizontal="$4"
          paddingVertical="$2"
        >
          {!isCurrentUser && (
            <Avatar circular size="$3" marginRight="$2">
              <Avatar.Image source={{ uri: otherUser?.images[0] }} />
            </Avatar>
          )}

          <Stack maxWidth="75%" position="relative">
            {isCurrentUser ? (
              <LinearGradient
                colors={[theme.gradientPink?.val || '#FF006E', theme.gradientPurple?.val || '#8B5CF6']}
                start={[0, 0]}
                end={[1, 1]}
                style={{
                  padding: 12,
                  borderRadius: 16,
                  borderBottomRightRadius: 4,
                }}
              >
                <Text color="white" fontSize="$4">
                  {item.content}
                </Text>
                <Text color="rgba(255,255,255,0.8)" fontSize="$1" marginTop="$1">
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </LinearGradient>
            ) : (
              <YStack
                backgroundColor="$backgroundStrong"
                padding="$3"
                borderRadius="$4"
                borderBottomLeftRadius="$1"
              >
                <Text color="$color" fontSize="$4">
                  {item.content}
                </Text>
                <Text color="$colorPress" fontSize="$1" marginTop="$1">
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </YStack>
            )}
          </Stack>
        </XStack>
      </Stack>
    );
  };

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Text>Loading chat...</Text>
      </YStack>
    );
  }

  return (
    <>
      <NavStack.Screen
        options={{
          title: otherUser?.name || 'Chat',
          headerShown: true,
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <YStack flex={1} backgroundColor="$background">
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            inverted={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />

          {/* Input Bar with gradient accent */}
          <XStack
            padding="$3"
            space="$2"
            backgroundColor="$backgroundStrong"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            alignItems="center"
          >
            <Input
              flex={1}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              onSubmitEditing={handleSend}
              backgroundColor="$background"
              borderColor="$borderColor"
              borderRadius="$6"
              paddingHorizontal="$3"
              fontSize="$4"
              focusStyle={{
                borderColor: '$primary',
                borderWidth: 2,
              }}
            />
            <Stack position="relative">
              <LinearGradient
                colors={[theme.gradientPink?.val || '#FF006E', theme.gradientPurple?.val || '#8B5CF6']}
                start={[0, 0]}
                end={[1, 1]}
                style={{
                  borderRadius: 100,
                  width: 48,
                  height: 48,
                }}
              >
                <Button
                  circular
                  size="$4"
                  icon={<Send size={20} color="white" />}
                  onPress={handleSend}
                  backgroundColor="transparent"
                  pressStyle={{ opacity: 0.8, scale: 0.95 }}
                  disabled={!newMessage.trim() || isSending}
                  opacity={!newMessage.trim() ? 0.5 : 1}
                  animation="quick"
                />
              </LinearGradient>
            </Stack>
          </XStack>
        </YStack>
      </KeyboardAvoidingView>
    </>
  );
}
