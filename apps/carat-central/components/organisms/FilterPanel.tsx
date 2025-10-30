import React from 'react';
import { ScrollView } from 'react-native';
import { YStack, XStack, Text, Separator } from 'tamagui';
import { FormField } from '@bdt/components';
import { Button } from '@bdt/components';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'range' | 'select';
  options?: Array<{ label: string; value: string }>;
}

export interface FilterPanelProps {
  fields: FilterField[];
  values: Record<string, any>;
  onValueChange: (k: string, v: any) => void;
  onApply: () => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  fields,
  values,
  onValueChange,
  onApply,
  onReset,
}) => {
  return (
    <YStack flex={1} backgroundColor='$background'>
      <ScrollView>
        <YStack padding='$4' space='$4'>
          <Text fontSize='$6' fontWeight={700}>
            Filters
          </Text>
          <Separator />

          {fields.map(f => (
            <FormField
              key={f.key}
              label={f.label}
              value={values[f.key]}
              onChangeText={v => onValueChange(f.key, v)}
            />
          ))}

          <XStack space='$3' marginTop='$4'>
            <Button variant='outlined' onPress={onReset} flex={1}>
              Reset
            </Button>
            <Button onPress={onApply} flex={1}>
              Apply
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
};

FilterPanel.displayName = 'FilterPanel';
