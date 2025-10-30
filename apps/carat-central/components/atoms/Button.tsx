import React from 'react';
import {
  Button as TamaguiButton,
  ButtonProps as TamaguiButtonProps,
} from 'tamagui';

export type AppButtonProps = TamaguiButtonProps & {
  variant?: 'primary' | 'secondary' | 'outlined' | 'ghost';
  loading?: boolean;
};

export const Button: React.FC<AppButtonProps> = ({
  variant = 'primary',
  loading,
  children,
  ...props
}) => {
  const variantStyle: Partial<any> =
    variant === 'primary'
      ? { backgroundColor: '$primary', color: 'white' }
      : variant === 'secondary'
        ? { backgroundColor: '$backgroundStrong', color: '$color' }
        : variant === 'outlined'
          ? {
              backgroundColor: '$background',
              borderWidth: 1,
              borderColor: '$gray5',
            }
          : { backgroundColor: 'transparent', color: '$color' };

  return (
    <TamaguiButton {...variantStyle} {...props}>
      {loading ? '...' : children}
    </TamaguiButton>
  );
};

Button.displayName = 'Button';
