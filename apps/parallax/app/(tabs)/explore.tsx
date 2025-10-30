import { useState, useEffect } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { YStack, XStack, Text, Image, Card, Button } from 'tamagui';
import { MapPin, Heart, X } from '@tamagui/lucide-icons';
import { api } from '../../src/lib/api';
import { ExploreCard } from '../../src/lib/types';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function ExploreScreen() {
  const [cards, setCards] = useState<ExploreCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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
    console.log('Liked:', cards[currentIndex]?.user.name);
    setCurrentIndex((prev) => prev + 1);
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
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$4">
        <Text fontSize="$6" fontWeight="bold" marginBottom="$2">
          That's everyone for now!
        </Text>
        <Text color="$gray10" textAlign="center">
          Check back later for new matches
        </Text>
      </YStack>
    );
  }

  const { user, compatibilityScore, tags } = currentCard;

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4" justifyContent="center">
      <Card
        elevate
        bordered
        width={CARD_WIDTH}
        height={550}
        borderRadius="$6"
        overflow="hidden"
        animation="bouncy"
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

        {/* Gradient Overlay */}
        <YStack
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          padding="$4"
          paddingTop="$8"
          backgroundColor="rgba(0,0,0,0.4)"
        >
          {/* User Info */}
          <YStack space="$2">
            <XStack alignItems="center" space="$2">
              <Text color="white" fontSize="$7" fontWeight="bold">
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

            <Text color="white" fontSize="$4" numberOfLines={2}>
              {user.bio}
            </Text>

            {/* Compatibility Score */}
            <XStack space="$2" marginTop="$2" flexWrap="wrap">
              <Card
                backgroundColor="rgba(255, 255, 255, 0.2)"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$4"
              >
                <Text color="white" fontSize="$2" fontWeight="600">
                  {Math.round(compatibilityScore * 100)}% Match
                </Text>
              </Card>
              {tags.map((tag) => (
                <Card
                  key={tag}
                  backgroundColor="rgba(255, 255, 255, 0.2)"
                  paddingHorizontal="$3"
                  paddingVertical="$1"
                  borderRadius="$4"
                >
                  <Text color="white" fontSize="$2">
                    {tag}
                  </Text>
                </Card>
              ))}
            </XStack>
          </YStack>
        </YStack>
      </Card>

      {/* Action Buttons */}
      <XStack justifyContent="center" space="$4" marginTop="$4">
        <Button
          circular
          size="$6"
          icon={<X size={32} color="$red10" />}
          onPress={handlePass}
          backgroundColor="white"
          borderWidth={2}
          borderColor="$gray5"
          pressStyle={{ scale: 0.95 }}
        />
        <Button
          circular
          size="$6"
          icon={<Heart size={32} color="$pink10" />}
          onPress={handleLike}
          backgroundColor="white"
          borderWidth={2}
          borderColor="$pink10"
          pressStyle={{ scale: 0.95 }}
        />
      </XStack>
    </YStack>
  );
}
