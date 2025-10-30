import React from 'react';
import { FlatList } from 'react-native';
import { YStack } from 'tamagui';
import { DiamondCard } from '../molecules/DiamondCard';

export interface DiamondListProps {
  diamonds: Array<any>;
  onDiamondPress?: (d: any) => void;
  isLoading?: boolean;
  numColumns?: number;
}

export const DiamondList: React.FC<DiamondListProps> = ({
  diamonds,
  onDiamondPress,
  isLoading = false,
  numColumns = 2,
}) => {
  if (isLoading) {
    return (
      <YStack padding='$4'>
        <DiamondCard id='s-1' isLoading />
        <DiamondCard id='s-2' isLoading />
      </YStack>
    );
  }

  return (
    <FlatList
      data={diamonds}
      renderItem={({ item }) => (
        <YStack flex={1} padding='$2'>
          <DiamondCard {...item} onPress={() => onDiamondPress?.(item)} />
        </YStack>
      )}
      keyExtractor={item => item.id}
      numColumns={numColumns}
    />
  );
};

DiamondList.displayName = 'DiamondList';
