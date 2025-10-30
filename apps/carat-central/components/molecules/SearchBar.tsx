import React from 'react';
import { XStack } from 'tamagui';
import { Input } from '../atoms/Input';
import { Search } from '@tamagui/lucide-icons';

export interface SearchBarProps {
  value?: string;
  onChangeText?: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
}) => {
  return (
    <XStack>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        leftIcon={<Search />}
      />
    </XStack>
  );
};

SearchBar.displayName = 'SearchBar';
