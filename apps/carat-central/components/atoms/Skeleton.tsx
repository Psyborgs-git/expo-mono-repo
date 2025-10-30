import React from 'react';
import { View, StyleSheet } from 'react-native';

export type SkeletonProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
};

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 6,
  style,
}) => {
  return (
    <View
      style={[
        { width, height, borderRadius, backgroundColor: '#EAEAEA' },
        style,
      ]}
    />
  );
};

Skeleton.displayName = 'Skeleton';
