import React from 'react';
import { YStack, XStack, Text } from 'tamagui';
import { Card } from '@bdt/components';
import { Badge } from '@bdt/components';

export interface DiamondCardProps {
  id: string;
  certificateId?: string | null;
  shape?: string | null;
  carat?: number | null;
  color?: string | null;
  clarity?: string | null;
  cut?: string | null;
  price?: number | null;
  location?: string | null;
  onPress?: () => void;
  isLoading?: boolean;
}

export const DiamondCard: React.FC<DiamondCardProps> = ({
  id,
  certificateId,
  shape,
  carat,
  color,
  clarity,
  cut,
  price,
  location,
  onPress,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Card variant='outlined'>
        <YStack>
          <Text>Loading...</Text>
        </YStack>
      </Card>
    );
  }

  return (
    <Card variant='elevated' onPress={onPress}>
      <YStack space='$2'>
        <XStack justifyContent='space-between'>
          <Text fontWeight={700}>{shape || 'Unknown'}</Text>
          {location ? <Badge variant='info'>{location}</Badge> : null}
        </XStack>

        <Text fontSize='$2'>Cert: {certificateId || '—'}</Text>

        <XStack space='$2' flexWrap='wrap'>
          {carat ? <Badge>{carat}ct</Badge> : null}
          {color ? <Badge>{color}</Badge> : null}
          {clarity ? <Badge>{clarity}</Badge> : null}
          {cut ? <Badge>{cut}</Badge> : null}
        </XStack>

        {price ? (
          <Text fontWeight={800} color='$primary'>
            ${price.toLocaleString()}
          </Text>
        ) : null}
      </YStack>
    </Card>
  );
};

DiamondCard.displayName = 'DiamondCard';
