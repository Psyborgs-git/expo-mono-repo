import React from 'react';
import { ActivityIndicator } from 'react-native';
import { YStack } from 'tamagui';

export const Loading = ({
  size = 'large',
}: {
  size?: 'small' | 'large' | number;
}) => (
  <YStack flex={1} alignItems='center' justifyContent='center'>
    <ActivityIndicator size={size as any} />
  </YStack>
);

export default Loading;
