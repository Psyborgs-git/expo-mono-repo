import React from 'react';
import { Card as TamaguiCard, StackProps, styled, YStack } from 'tamagui';

export type CardProps = StackProps & {
  variant?: 'default' | 'elevated' | 'outlined';
  children?: React.ReactNode;
};

const Styled = styled(TamaguiCard, {
  name: 'AppCard',
  borderRadius: '$3',
  padding: '$3',
});

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  ...props
}) => {
  const variantStyle: Partial<any> =
    variant === 'elevated'
      ? { shadowColor: '$shadowColor', elevation: 2 }
      : variant === 'outlined'
        ? { borderWidth: 1, borderColor: '$gray5' }
        : {};

  return (
    <Styled {...variantStyle} {...props}>
      {children}
    </Styled>
  );
};

Card.displayName = 'Card';
