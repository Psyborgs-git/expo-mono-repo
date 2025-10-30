import React from 'react';
import { XStack, Text, styled } from 'tamagui';

export type BadgeProps = {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  children?: React.ReactNode;
};

const Root = styled(XStack, {
  name: 'AppBadge',
  paddingHorizontal: '$2',
  paddingVertical: '$1',
  borderRadius: '$2',
  alignItems: 'center',
  justifyContent: 'center',
});

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
}) => {
  const bg =
    variant === 'primary'
      ? '$primary'
      : variant === 'success'
        ? '$success'
        : variant === 'warning'
          ? '$warning'
          : variant === 'error'
            ? '$error'
            : variant === 'info'
              ? '$info'
              : '$backgroundStrong';
  const color = variant === 'default' ? '$color' : 'white';

  return (
    <Root backgroundColor={bg}>
      <Text color={color} fontWeight={600} fontSize='$2'>
        {children}
      </Text>
    </Root>
  );
};

Badge.displayName = 'Badge';
