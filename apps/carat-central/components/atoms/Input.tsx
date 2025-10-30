import React from 'react';
import {
  Input as TamaguiInput,
  InputProps as TamaguiInputProps,
} from 'tamagui';

export type AppInputProps = TamaguiInputProps & {
  label?: string;
  helperText?: string;
};

export const Input: React.FC<AppInputProps> = ({
  label,
  helperText,
  ...props
}) => {
  return <TamaguiInput {...props} />;
};

Input.displayName = 'Input';
