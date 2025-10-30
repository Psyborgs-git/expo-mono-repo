import { useState, useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { YStack, XStack, Text, Avatar, Circle, Separator } from 'tamagui';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { Chat } from '../../src/lib/types';

export default function ChatsScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const loadChats = async () => {
    try {
      const data = await api.getChats();
      setChats(data);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadChats();
  };

  const handleChatPress = (chatId: string) => {
    router.push(`/chats/${chatId}`);
  };

  const renderChat = ({ item }: { item: Chat }) => {
    const otherUser = item.participants.find((p) => p.id !== 'current-user');
    if (!otherUser) return null;

    const timeAgo = new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <YStack
        onPress={() => handleChatPress(item.id)}
        pressStyle={{ opacity: 0.7 }}
        padding="$3"
        backgroundColor="$background"
      >
        <XStack space="$3" alignItems="center">
          <Avatar circular size="$5">
            <Avatar.Image
              source={{ uri: otherUser.images[0] }}
            />
            <Avatar.Fallback backgroundColor="$pink10" />
          </Avatar>

          <YStack flex={1}>
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontWeight="600" fontSize="$5">
                {otherUser.name}
              </Text>
              <Text fontSize="$2" color="$gray10">
                {timeAgo}
              </Text>
            </XStack>
            
            <XStack justifyContent="space-between" alignItems="center" marginTop="$1">
              <Text
                flex={1}
                fontSize="$3"
                color="$gray11"
                numberOfLines={1}
              >
                {item.lastMessage.content}
              </Text>
              {item.unreadCount > 0 && (
                <Circle
                  size={20}
                  backgroundColor="pink"
                  marginLeft="$2"
                >
                  <Text color="white" fontSize="$1" fontWeight="bold">
                    {item.unreadCount}
                  </Text>
                </Circle>
              )}
            </XStack>
          </YStack>
        </XStack>
        <Separator marginTop="$3" />
      </YStack>
    );
  };

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Text>Loading chats...</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <YStack padding="$6" alignItems="center">
            <Text color="$gray10">No chats yet. Start exploring!</Text>
          </YStack>
        }
      />
    </YStack>
  );
}
