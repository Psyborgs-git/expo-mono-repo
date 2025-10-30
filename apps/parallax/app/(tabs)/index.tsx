import { useState, useEffect } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { YStack, XStack, Text, Avatar, Circle, Separator, Stack, AnimatePresence, useTheme } from 'tamagui';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { Chat } from '../../src/lib/types';
import { LinearGradient } from 'tamagui/linear-gradient';

export default function ChatsScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();
  const theme = useTheme();

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

  const renderChat = ({ item, index }: { item: Chat; index: number }) => {
    const otherUser = item.participants.find((p) => p.id !== 'current-user');
    if (!otherUser) return null;

    const timeAgo = new Date(item.lastMessage.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <Stack
        animation="quick"
        enterStyle={{
          opacity: 0,
          x: -20,
        }}
        opacity={1}
        x={0}
      >
        <YStack
          onPress={() => handleChatPress(item.id)}
          pressStyle={{ opacity: 0.7, scale: 0.98 }}
          padding="$3.5"
          backgroundColor="$background"
          hoverStyle={{ backgroundColor: '$backgroundHover' }}
          animation="quick"
        >
          <XStack space="$3" alignItems="center">
            {/* Avatar with gradient border */}
            <Stack position="relative">
              <LinearGradient
                colors={[theme.gradientPink?.val || '#FF006E', theme.gradientPurple?.val || '#8B5CF6']}
                start={[0, 0]}
                end={[1, 1]}
                style={{
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  borderRadius: 100,
                }}
              />
              <Avatar circular size="$5" backgroundColor="$background">
                <Avatar.Image source={{ uri: otherUser.images[0] }} />
                <Avatar.Fallback backgroundColor="$primary" />
              </Avatar>
            </Stack>

            <YStack flex={1}>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="700" fontSize="$5" color="$color">
                  {otherUser.name}
                </Text>
                <Text fontSize="$2" color="$colorPress">
                  {timeAgo}
                </Text>
              </XStack>

              <XStack justifyContent="space-between" alignItems="center" marginTop="$1.5">
                <Text flex={1} fontSize="$3" color="$colorPress" numberOfLines={1}>
                  {item.lastMessage.content}
                </Text>
                {item.unreadCount > 0 && (
                  <Stack
                    animation="bouncy"
                    enterStyle={{
                      scale: 0,
                      opacity: 0,
                    }}
                    scale={1}
                    opacity={1}
                  >
                    <LinearGradient
                      colors={[theme.gradientPink?.val || '#FF006E', theme.gradientPurple?.val || '#8B5CF6']}
                      start={[0, 0]}
                      end={[1, 1]}
                      style={{
                        borderRadius: 100,
                        minWidth: 22,
                        height: 22,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 8,
                      }}
                    >
                      <Text color="white" fontSize="$1" fontWeight="bold">
                        {item.unreadCount}
                      </Text>
                    </LinearGradient>
                  </Stack>
                )}
              </XStack>
            </YStack>
          </XStack>
        </YStack>
        <Separator marginHorizontal="$4" />
      </Stack>
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
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh}
            tintColor={theme.primary?.val || '#FF006E'}
          />
        }
        ListEmptyComponent={
          <YStack padding="$6" alignItems="center">
            <Text color="$colorPress" fontSize="$4">
              No chats yet. Start exploring! 💬
            </Text>
          </YStack>
        }
      />
    </YStack>
  );
}
