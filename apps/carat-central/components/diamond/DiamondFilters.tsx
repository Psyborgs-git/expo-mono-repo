import React, { useState, useCallback } from 'react';
import { Modal } from 'react-native';
import { styled } from 'tamagui';
import { YStack, XStack, H4, Paragraph, Button, ScrollView } from 'tamagui';
import Select from '../ui/Select';
import NumberInput from '../ui/NumberInput';

// Filter modal container
export const FilterModalContainer = styled(YStack, {
  name: 'FilterModalContainer',
  flex: 1,
  backgroundColor: '$background',
});

// Filter header
export const FilterHeader = styled(XStack, {
  name: 'FilterHeader',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderBottomWidth: 1,
  borderBottomColor: '$gray5',
});

// Filter content
export const FilterContent = styled(ScrollView, {
  name: 'FilterContent',
  flex: 1,
  padding: '$4',
});

// Filter section
export const FilterSection = styled(YStack, {
  name: 'FilterSection',
  gap: '$3',
  marginBottom: '$4',
});

// Range input container
export const RangeInputContainer = styled(XStack, {
  name: 'RangeInputContainer',
  alignItems: 'center',
  gap: '$3',
});

// Filter actions
export const FilterActions = styled(XStack, {
  name: 'FilterActions',
  gap: '$3',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  borderTopWidth: 1,
  borderTopColor: '$gray5',
});

export interface DiamondFilters {
  minCarat?: number;
  maxCarat?: number;
  minPrice?: number;
  maxPrice?: number;
  shapes?: string[];
  clarityGrades?: string[];
  colorGrades?: string[];
  cutGrades?: string[];
}

export interface DiamondFiltersProps {
  visible: boolean;
  filters: DiamondFilters;
  onFiltersChange: (filters: DiamondFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
}

// Filter options
const SHAPE_OPTIONS = [
  { label: 'Round', value: 'ROUND' },
  { label: 'Princess', value: 'PRINCESS' },
  { label: 'Cushion', value: 'CUSHION' },
  { label: 'Emerald', value: 'EMERALD' },
  { label: 'Oval', value: 'OVAL' },
];

const CLARITY_OPTIONS = [
  { label: 'FL', value: 'FL' },
  { label: 'IF', value: 'IF' },
  { label: 'VVS1', value: 'VVS1' },
  { label: 'VVS2', value: 'VVS2' },
  { label: 'VS1', value: 'VS1' },
  { label: 'VS2', value: 'VS2' },
  { label: 'SI1', value: 'SI1' },
  { label: 'SI2', value: 'SI2' },
  { label: 'I1', value: 'I1' },
];

const COLOR_OPTIONS = [
  { label: 'D', value: 'D' },
  { label: 'E', value: 'E' },
  { label: 'F', value: 'F' },
  { label: 'G', value: 'G' },
  { label: 'H', value: 'H' },
  { label: 'I', value: 'I' },
  { label: 'J', value: 'J' },
  { label: 'K', value: 'K' },
];

const CUT_OPTIONS = [
  { label: 'Ideal', value: 'IDEAL' },
  { label: 'Excellent', value: 'EXCELLENT' },
  { label: 'Very Good', value: 'VERY_GOOD' },
  { label: 'Good', value: 'GOOD' },
  { label: 'Fair', value: 'FAIR' },
  { label: 'Poor', value: 'POOR' },
];

export const DiamondFilters: React.FC<DiamondFiltersProps> = ({
  visible,
  filters,
  onFiltersChange,
  onClose,
  onApply,
  onClear,
}) => {
  const [localFilters, setLocalFilters] = useState<DiamondFilters>(filters);

  // Update local filters
  const updateFilter = useCallback((key: keyof DiamondFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Handle apply
  const handleApply = useCallback(() => {
    onFiltersChange(localFilters);
    onApply();
  }, [localFilters, onFiltersChange, onApply]);

  // Handle clear
  const handleClear = useCallback(() => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClear();
  }, [onFiltersChange, onClear]);

  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='pageSheet'
      onRequestClose={onClose}
    >
      <FilterModalContainer>
        <FilterHeader>
          <H4>Filter Diamonds</H4>
          <Button size='$3' circular onPress={onClose}>
            ✕
          </Button>
        </FilterHeader>

        <FilterContent showsVerticalScrollIndicator={false}>
          {/* Carat Range */}
          <FilterSection>
            <H4 fontSize='$4'>Carat Weight</H4>
            <RangeInputContainer>
              <NumberInput
                placeholder='Min'
                value={localFilters.minCarat?.toString() || ''}
                onValueChange={value =>
                  updateFilter(
                    'minCarat',
                    value ? parseFloat(value) : undefined
                  )
                }
                flex={1}
              />
              <Paragraph>to</Paragraph>
              <NumberInput
                placeholder='Max'
                value={localFilters.maxCarat?.toString() || ''}
                onValueChange={value =>
                  updateFilter(
                    'maxCarat',
                    value ? parseFloat(value) : undefined
                  )
                }
                flex={1}
              />
            </RangeInputContainer>
          </FilterSection>

          {/* Price Range */}
          <FilterSection>
            <H4 fontSize='$4'>Price Range</H4>
            <RangeInputContainer>
              <NumberInput
                placeholder='Min Price'
                value={localFilters.minPrice?.toString() || ''}
                onValueChange={value =>
                  updateFilter(
                    'minPrice',
                    value ? parseFloat(value) : undefined
                  )
                }
                flex={1}
              />
              <Paragraph>to</Paragraph>
              <NumberInput
                placeholder='Max Price'
                value={localFilters.maxPrice?.toString() || ''}
                onValueChange={value =>
                  updateFilter(
                    'maxPrice',
                    value ? parseFloat(value) : undefined
                  )
                }
                flex={1}
              />
            </RangeInputContainer>
          </FilterSection>

          {/* Shape */}
          <FilterSection>
            <H4 fontSize='$4'>Shape</H4>
            <Select
              placeholder='Select shapes...'
              options={SHAPE_OPTIONS}
              value={localFilters.shapes || []}
              onValueChange={value => updateFilter('shapes', value)}
              multiple
            />
          </FilterSection>

          {/* Clarity */}
          <FilterSection>
            <H4 fontSize='$4'>Clarity</H4>
            <Select
              placeholder='Select clarity grades...'
              options={CLARITY_OPTIONS}
              value={localFilters.clarityGrades || []}
              onValueChange={value => updateFilter('clarityGrades', value)}
              multiple
            />
          </FilterSection>

          {/* Color */}
          <FilterSection>
            <H4 fontSize='$4'>Color</H4>
            <Select
              placeholder='Select color grades...'
              options={COLOR_OPTIONS}
              value={localFilters.colorGrades || []}
              onValueChange={value => updateFilter('colorGrades', value)}
              multiple
            />
          </FilterSection>

          {/* Cut */}
          <FilterSection>
            <H4 fontSize='$4'>Cut</H4>
            <Select
              placeholder='Select cut grades...'
              options={CUT_OPTIONS}
              value={localFilters.cutGrades || []}
              onValueChange={value => updateFilter('cutGrades', value)}
              multiple
            />
          </FilterSection>
        </FilterContent>

        <FilterActions>
          <Button flex={1} variant='outlined' onPress={handleClear}>
            Clear All
          </Button>
          <Button flex={1} onPress={handleApply}>
            Apply Filters
          </Button>
        </FilterActions>
      </FilterModalContainer>
    </Modal>
  );
};
