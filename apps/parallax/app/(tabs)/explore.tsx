import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { YStack, XStack, Text, Image, Card, Button, Stack, AnimatePresence, useTheme } from 'tamagui';
import { MapPin, Heart, X } from '@tamagui/lucide-icons';
import { api } from '../../src/lib/api';
import { ExploreCard } from '../../src/lib/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'tamagui/linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function ExploreScreen() {
  const [cards, setCards] = useState<ExploreCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const theme = useTheme();

  const loadCards = async () => {
    try {
      const response = await api.searchExplore();
      setCards(response.items);
    } catch (error) {
      console.error('Failed to load explore cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const handleLike = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLiked(true);
    console.log('Liked:', cards[currentIndex]?.user.name);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setLiked(false);
    }, 300);
  };

  const handlePass = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Passed:', cards[currentIndex]?.user.name);
    setCurrentIndex((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Text>Loading profiles...</Text>
      </YStack>
    );
  }

  const currentCard = cards[currentIndex];

  if (!currentCard) {
    return (
      <Stack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$4">
        <LinearGradient
          colors={[theme.gradientPink?.val || '#FF006E', theme.gradientPurple?.val || '#8B5CF6']}
          start={[0, 0]}
          end={[1, 1]}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
          }}
        />
        <Text fontSize="$6" fontWeight="bold" marginBottom="$2">
          That's everyone for now! 🎉
        </Text>
        <Text color="$colorPress" textAlign="center">
          Check back later for new matches
        </Text>
      </Stack>
    );
  }

  const { user, compatibilityScore, tags } = currentCard;

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" justifyContent="center">
      <AnimatePresence>
        <Card
          key={currentIndex}
          elevate
          bordered
          width={CARD_WIDTH}
          height={550}
          borderRadius="$6"
          overflow="hidden"
          animation="bouncy"
          enterStyle={{
            opacity: 0,
            scale: 0.9,
            y: 20,
          }}
          exitStyle={{
            opacity: 0,
            scale: 0.95,
            x: liked ? 200 : -200,
          }}
          opacity={1}
          scale={1}
          y={0}
          x={0}
        >
          {/* Profile Image */}
          <Card.Background>
            <Image
              source={{ uri: user.images[0] }}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          </Card.Background>

          {/* Gradient Overlay with Gen-Z colors */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
            locations={[0, 0.5, 1]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '60%',
            }}
          />

          {/* User Info */}
          <YStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            padding="$4"
            paddingTop="$8"
          >
            <YStack space="$2">
              <XStack alignItems="center" space="$2">
                <Text color="white" fontSize="$8" fontWeight="bold">
                  {user.name}, {user.age}
                </Text>
              </XStack>

              {user.distanceKm && (
                <XStack alignItems="center" space="$1">
                  <MapPin size={16} color="white" />
                  <Text color="white" fontSize="$3">
                    {user.distanceKm.toFixed(1)} km away
                  </Text>
                </XStack>
              )}

              <Text color="white" fontSize="$4" numberOfLines={2} marginTop="$1">
                {user.bio}
              </Text>

              {/* Compatibility Score with gradient */}
              <XStack space="$2" marginTop="$3" flexWrap="wrap">
                <Stack
                  backgroundColor="rgba(255, 255, 255, 0.25)"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$6"
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.3)"
                >
                  <Text color="white" fontSize="$3" fontWeight="700">
                    {Math.round(compatibilityScore * 100)}% Match ✨
                  </Text>
                </Stack>
                {tags.slice(0, 3).map((tag) => (
                  <Stack
                    key={tag}
                    backgroundColor="rgba(255, 255, 255, 0.2)"
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$6"
                    borderWidth={1}
                    borderColor="rgba(255, 255, 255, 0.2)"
                  >
                    <Text color="white" fontSize="$2">
                      {tag}
                    </Text>
                  </Stack>
                ))}
              </XStack>
            </YStack>
          </YStack>
        </Card>
      </AnimatePresence>

      {/* Action Buttons with animations */}
      <XStack justifyContent="center" space="$5" marginTop="$5">
        <Button
          circular
          size="$6"
          icon={<X size={32} color="$color" />}
          onPress={handlePass}
          backgroundColor="$background"
          borderWidth={3}
          borderColor="$borderColor"
          pressStyle={{ scale: 0.85, borderColor: '$primary' }}
          animation="bouncy"
          hoverStyle={{ scale: 1.05 }}
          shadowColor="$shadowColor"
          shadowRadius={8}
          shadowOffset={{ width: 0, height: 4 }}
        />
        <Button
          circular
          size="$7"
          icon={<Heart size={36} color="white" />}
          onPress={handleLike}
          backgroundColor="$primary"
          borderWidth={0}
          pressStyle={{ scale: 0.85 }}
          animation="bouncy"
          hoverStyle={{ scale: 1.1 }}
          shadowColor="$primary"
          shadowRadius={12}
          shadowOffset={{ width: 0, height: 6 }}
          shadowOpacity={0.4}
        />
      </XStack>
    </YStack>
  );
}
