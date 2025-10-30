import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Avatar, Button, Card, Separator, Stack, useTheme } from 'tamagui';
import { Edit3, Settings, LogOut } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { api } from '../../src/lib/api';
import { User } from '../../src/lib/types';
import { LinearGradient } from 'tamagui/linear-gradient';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const theme = useTheme();

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
    <ScrollView style={{ flex: 1, backgroundColor: theme.background?.val || '#FFFFFF' }}>
      <YStack space="$4">
        {/* Gradient Header */}
        <Stack position="relative" height={280} overflow="hidden">
          <LinearGradient
            colors={[
              theme.gradientPink?.val || '#FF006E',
              theme.gradientPurple?.val || '#8B5CF6',
              theme.gradientBlue?.val || '#3B82F6',
            ]}
            start={[0, 0]}
            end={[1, 1]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />

          {/* Profile Info on Gradient */}
          <YStack alignItems="center" paddingTop="$6" space="$3">
            <Stack position="relative">
              {/* Gradient border for avatar */}
              <LinearGradient
                colors={['#FFFFFF', 'rgba(255,255,255,0.8)']}
                start={[0, 0]}
                end={[1, 1]}
                style={{
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  borderRadius: 100,
                }}
              />
              <Avatar
                circular
                size="$12"
                borderWidth={4}
                borderColor="white"
                animation="bouncy"
                hoverStyle={{ scale: 1.05 }}
              >
                <Avatar.Image source={{ uri: user.images[0] }} />
                <Avatar.Fallback backgroundColor="$primary" />
              </Avatar>
            </Stack>

            <Text fontSize="$8" fontWeight="bold" color="white">
              {user.name}
            </Text>

            <Text fontSize="$4" color="rgba(255,255,255,0.9)">
              {user.age} years old
            </Text>

            <Button
              icon={<Edit3 size={20} color="white" />}
              onPress={() => router.push('/profile/edit')}
              backgroundColor="rgba(255,255,255,0.25)"
              borderWidth={2}
              borderColor="white"
              color="white"
              pressStyle={{ opacity: 0.8, scale: 0.95 }}
              hoverStyle={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
              animation="quick"
              marginTop="$2"
            >
              Edit Profile
            </Button>
          </YStack>
        </Stack>

        <YStack padding="$4" space="$4" marginTop="$-6">
          {/* Bio Card with subtle gradient */}
          <Card
            bordered
            padding="$4"
            borderRadius="$6"
            backgroundColor="$background"
            animation="quick"
            enterStyle={{ opacity: 0, y: 20 }}
            opacity={1}
            y={0}
            shadowColor="$shadowColor"
            shadowRadius={8}
            shadowOffset={{ width: 0, height: 4 }}
          >
            <Text fontSize="$5" fontWeight="700" marginBottom="$3" color="$color">
              About Me
            </Text>
            <Text fontSize="$4" color="$colorPress" lineHeight={22}>
              {user.bio}
            </Text>
          </Card>

          {/* Traits with bounce animation */}
          <Card
            bordered
            padding="$4"
            borderRadius="$6"
            backgroundColor="$background"
            animation="quick"
            enterStyle={{ opacity: 0, y: 20 }}
            opacity={1}
            y={0}
            shadowColor="$shadowColor"
            shadowRadius={8}
            shadowOffset={{ width: 0, height: 4 }}
          >
            <Text fontSize="$5" fontWeight="700" marginBottom="$3" color="$color">
              My Traits
            </Text>
            <XStack space="$2" flexWrap="wrap">
              {user.traits.map((trait, index) => (
                <Stack
                  key={trait}
                  animation="bouncy"
                  enterStyle={{
                    opacity: 0,
                    scale: 0,
                  }}
                  opacity={1}
                  scale={1}
                  marginBottom="$2"
                >
                  <LinearGradient
                    colors={[
                      theme.gradientPink?.val || '#FF006E',
                      theme.gradientPurple?.val || '#8B5CF6',
                    ]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                    }}
                  >
                    <Text color="white" fontSize="$3" fontWeight="600">
                      {trait}
                    </Text>
                  </LinearGradient>
                </Stack>
              ))}
            </XStack>
          </Card>

          {/* Photos Gallery */}
          <Card
            bordered
            padding="$4"
            borderRadius="$6"
            backgroundColor="$background"
            animation="quick"
            enterStyle={{ opacity: 0, y: 20 }}
            opacity={1}
            y={0}
            shadowColor="$shadowColor"
            shadowRadius={8}
            shadowOffset={{ width: 0, height: 4 }}
          >
            <Text fontSize="$5" fontWeight="700" marginBottom="$3" color="$color">
              Photos ({user.images.length})
            </Text>
            <XStack space="$2" flexWrap="wrap">
              {user.images.map((image, index) => (
                <Stack
                  key={index}
                  animation="quick"
                  enterStyle={{
                    opacity: 0,
                    scale: 0.8,
                  }}
                  opacity={1}
                  scale={1}
                  hoverStyle={{ scale: 1.05 }}
                  pressStyle={{ scale: 0.95 }}
                >
                  <Avatar size="$9" borderRadius="$4">
                    <Avatar.Image source={{ uri: image }} />
                  </Avatar>
                </Stack>
              ))}
            </XStack>
          </Card>

          {/* Settings Buttons */}
          <YStack space="$3">
            <Button
              icon={<Settings size={20} />}
              backgroundColor="$backgroundStrong"
              color="$color"
              justifyContent="flex-start"
              borderRadius="$4"
              pressStyle={{ backgroundColor: '$backgroundPress', scale: 0.98 }}
              animation="quick"
              fontSize="$4"
              fontWeight="600"
            >
              Settings
            </Button>

            <Button
              icon={<LogOut size={20} />}
              backgroundColor="$backgroundStrong"
              color="$error"
              justifyContent="flex-start"
              borderRadius="$4"
              pressStyle={{ backgroundColor: '$backgroundPress', scale: 0.98 }}
              animation="quick"
              fontSize="$4"
              fontWeight="600"
            >
              Log Out
            </Button>
          </YStack>

          {/* Bottom Padding */}
          <YStack height={40} />
        </YStack>
      </YStack>
    </ScrollView>
  );
}
