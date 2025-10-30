import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Avatar, Button, Card, Separator } from 'tamagui';
import { Edit3, Settings, LogOut } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { User } from '../../src/lib/types';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadUser = async () => {
    try {
      const data = await api.getCurrentUser();
      setUser(data);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (isLoading || !user) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Text>Loading profile...</Text>
      </YStack>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '$background' }}>
      <YStack padding="$4" space="$4">
        {/* Profile Header */}
        <YStack alignItems="center" space="$3" paddingVertical="$4">
          <Avatar circular size="$10">
            <Avatar.Image source={{ uri: user.images[0] }} />
            <Avatar.Fallback backgroundColor="pink" />
          </Avatar>
          
          <Text fontSize="$7" fontWeight="bold">
            {user.name}
          </Text>
          
          <Text fontSize="$4" color="$gray10">
            {user.age} years old
          </Text>

          <Button
            icon={<Edit3 size={20} />}
            onPress={() => router.push('/profile/edit')}
            backgroundColor="pink"
            color="white"
            pressStyle={{ opacity: 0.8 }}
          >
            Edit Profile
          </Button>
        </YStack>

        <Separator />

        {/* Bio Section */}
        <Card bordered padding="$4">
          <Text fontSize="$5" fontWeight="600" marginBottom="$2">
            About Me
          </Text>
          <Text fontSize="$4" color="$gray11">
            {user.bio}
          </Text>
        </Card>

        {/* Traits */}
        <Card bordered padding="$4">
          <Text fontSize="$5" fontWeight="600" marginBottom="$3">
            My Traits
          </Text>
          <XStack space="$2" flexWrap="wrap">
            {user.traits.map((trait) => (
              <Card
                key={trait}
                backgroundColor="lightpink"
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$4"
                marginBottom="$2"
              >
                <Text color="pink" fontSize="$3">
                  {trait}
                </Text>
              </Card>
            ))}
          </XStack>
        </Card>

        {/* Photos */}
        <Card bordered padding="$4">
          <Text fontSize="$5" fontWeight="600" marginBottom="$3">
            Photos ({user.images.length})
          </Text>
          <XStack space="$2" flexWrap="wrap">
            {user.images.map((image, index) => (
              <Avatar key={index} size="$8" borderRadius="$3">
                <Avatar.Image source={{ uri: image }} />
              </Avatar>
            ))}
          </XStack>
        </Card>

        {/* Settings */}
        <YStack space="$2">
          <Button
            icon={<Settings size={20} />}
            backgroundColor="$gray2"
            color="$gray12"
            justifyContent="flex-start"
          >
            Settings
          </Button>
          
          <Button
            icon={<LogOut size={20} />}
            backgroundColor="$gray2"
            color="red"
            justifyContent="flex-start"
          >
            Log Out
          </Button>
        </YStack>

        {/* Bottom Padding */}
        <YStack height={40} />
      </YStack>
    </ScrollView>
  );
}
