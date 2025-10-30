import React from 'react';
import { Avatar as TamaguiAvatar, Text } from 'tamagui';

export type AvatarProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
  fallback?: string;
};

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  src,
  fallback,
}) => {
  const sizeMap: Record<string, number> = { sm: 24, md: 32, lg: 40, xl: 56 };
  return (
    <TamaguiAvatar circular size={sizeMap[size]}>
      {src ? (
        <TamaguiAvatar.Image src={src} />
      ) : (
        <TamaguiAvatar.Fallback backgroundColor='$primary'>
          <Text color='white'>
            {(fallback || '').slice(0, 2).toUpperCase() || 'U'}
          </Text>
        </TamaguiAvatar.Fallback>
      )}
    </TamaguiAvatar>
  );
};

Avatar.displayName = 'Avatar';
