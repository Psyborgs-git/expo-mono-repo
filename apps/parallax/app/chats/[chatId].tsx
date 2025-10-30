import { useState, useEffect } from 'react';
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { YStack, XStack, Text, Input, Button, Avatar } from 'tamagui';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Send } from '@tamagui/lucide-icons';
import { api } from '../../src/lib/api';
import { Message, Chat } from '../../src/lib/types';

export default function ChatDetailsScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
    if (!newMessage.trim()) return;

    try {
      const sentMessage = await api.sendMessage(chatId, newMessage.trim());
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const otherUser = chat?.participants.find((p) => p.id !== 'current-user');

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === 'current-user';
    
    return (
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
        
        <YStack
          maxWidth="75%"
          backgroundColor={isCurrentUser ? '$pink10' : '$gray3'}
          padding="$3"
          borderRadius="$4"
          borderBottomRightRadius={isCurrentUser ? 0 : '$4'}
          borderBottomLeftRadius={isCurrentUser ? '$4' : 0}
        >
          <Text color={isCurrentUser ? 'white' : '$gray12'} fontSize="$4">
            {item.content}
          </Text>
          <Text
            color={isCurrentUser ? 'rgba(255,255,255,0.7)' : '$gray10'}
            fontSize="$1"
            marginTop="$1"
          >
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </YStack>
      </XStack>
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
      <Stack.Screen
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
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 10 }}
            inverted={false}
          />

          {/* Input Bar */}
          <XStack
            padding="$3"
            space="$2"
            backgroundColor="$gray1"
            borderTopWidth={1}
            borderTopColor="$gray5"
            alignItems="center"
          >
            <Input
              flex={1}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              onSubmitEditing={handleSend}
              backgroundColor="white"
              borderColor="$gray5"
            />
            <Button
              circular
              size="$4"
              icon={<Send size={20} color="white" />}
              onPress={handleSend}
              backgroundColor="$pink10"
              pressStyle={{ opacity: 0.8 }}
              disabled={!newMessage.trim()}
            />
          </XStack>
        </YStack>
      </KeyboardAvoidingView>
    </>
  );
}
