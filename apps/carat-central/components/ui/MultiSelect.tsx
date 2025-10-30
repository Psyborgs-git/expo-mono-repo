import React from 'react';
import { YStack, Button, Text } from 'tamagui';

type MultiSelectProps = {
  options: Array<{ value: string; label: string }>;
  // support both `selected`/`onChange` and `values`/`onValuesChange` prop shapes
  selected?: string[];
  values?: string[];
  onChange?: (selected: string[]) => void;
  onValuesChange?: (values: string[]) => void;
  placeholder?: string;
};

export const MultiSelect = ({
  options,
  selected = [],
  values,
  onChange,
  onValuesChange,
}: MultiSelectProps) => {
  const current = values ?? selected ?? [];
  const emit = (next: string[]) => {
    if (onValuesChange) onValuesChange(next);
    if (onChange) onChange(next);
  };

  const toggle = (value: string) => {
    if (current.includes(value)) emit(current.filter(s => s !== value));
    else emit([...current, value]);
  };

  return (
    <YStack gap={8}>
      {options.map(opt => (
        <Button key={opt.value} onPress={() => toggle(opt.value)}>
          <Text>
            {opt.label} {current.includes(opt.value) ? '✓' : ''}
          </Text>
        </Button>
      ))}
    </YStack>
  );
};

export default MultiSelect;
