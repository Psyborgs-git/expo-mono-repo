import React from 'react';
import { YStack, Text } from 'tamagui';
import { Input } from '../atoms/Input';

export interface FormFieldProps {
  label: string;
  value?: string;
  onChangeText?: (val: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  helperText,
  required,
  placeholder,
}) => {
  return (
    <YStack space='$2'>
      <Text fontSize='$3' fontWeight={600}>
        {label}
        {required ? '*' : null}
      </Text>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
      {error ? (
        <Text color='$error' fontSize='$2'>
          {error}
        </Text>
      ) : helperText ? (
        <Text color='$colorPress' fontSize='$2'>
          {helperText}
        </Text>
      ) : null}
    </YStack>
  );
};

FormField.displayName = 'FormField';
