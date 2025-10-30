import React, { useState } from 'react';
import { styled } from 'tamagui';
import {
  YStack,
  XStack,
  Paragraph,
  Button,
  ScrollView,
  Sheet,
  H4,
  Separator,
} from 'tamagui';
import {
  Filter,
  X,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from '@tamagui/lucide-icons';
import { SearchBar } from '@bdt/components';
import Select from '../ui/Select';
import NumberInput from '../ui/NumberInput';
import { DiamondFilters, DiamondSortOption } from '../../hooks/useDiamonds';

// Filter container
export const FilterContainer = styled(YStack, {
  name: 'FilterContainer',
  backgroundColor: '$background',
  borderBottomWidth: 1,
  borderBottomColor: '$borderColor',
});

// Filter header
export const FilterHeader = styled(XStack, {
  name: 'FilterHeader',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
});

// Filter button
export const FilterButton = styled(Button, {
  name: 'FilterButton',
  size: '$3',
  variant: 'outlined',
  borderRadius: '$3',

  variants: {
    active: {
      true: {
        backgroundColor: '$primary',
        borderColor: '$primary',
        color: '$colorInverse',
      },
    },
  },
});

// Sort button
export const SortButton = styled(Button, {
  name: 'SortButton',
  size: '$3',
  variant: 'outlined',
  borderRadius: '$3',
  minWidth: 120,
});

// Filter chip
export const FilterChip = styled(Button, {
  name: 'FilterChip',
  size: '$2',
  backgroundColor: '$primaryLight',
  borderColor: '$primary',
  borderRadius: '$6',
  paddingHorizontal: '$3',
});

// Filter chips container
export const FilterChips = styled(ScrollView, {
  name: 'FilterChips',
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  paddingHorizontal: '$4',
  paddingBottom: '$3',
});

// Filter section
export const FilterSection = styled(YStack, {
  name: 'FilterSection',
  gap: '$3',
  paddingVertical: '$3',
});

export const FilterSectionTitle = styled(H4, {
  name: 'FilterSectionTitle',
  fontSize: '$4',
  fontWeight: '600',
  color: '$colorStrong',
});

// Multi-select filter
export const MultiSelectFilter = styled(YStack, {
  name: 'MultiSelectFilter',
  gap: '$2',
});

export const MultiSelectOptions = styled(XStack, {
  name: 'MultiSelectOptions',
  flexWrap: 'wrap',
  gap: '$2',
});

export const MultiSelectOption = styled(Button, {
  name: 'MultiSelectOption',
  size: '$2',
  variant: 'outlined',
  borderRadius: '$3',

  variants: {
    selected: {
      true: {
        backgroundColor: '$primary',
        borderColor: '$primary',
        color: '$colorInverse',
      },
    },
  },
});

// Range filter
export const RangeFilter = styled(XStack, {
  name: 'RangeFilter',
  alignItems: 'center',
  gap: '$3',
});

// Constants for filter options
const DIAMOND_STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'RESERVED', label: 'Reserved' },
  { value: 'SOLD', label: 'Sold' },
];

const CLARITY_OPTIONS = [
  { value: 'FL', label: 'FL' },
  { value: 'IF', label: 'IF' },
  { value: 'VVS1', label: 'VVS1' },
  { value: 'VVS2', label: 'VVS2' },
  { value: 'VS1', label: 'VS1' },
  { value: 'VS2', label: 'VS2' },
  { value: 'SI1', label: 'SI1' },
  { value: 'SI2', label: 'SI2' },
  { value: 'I1', label: 'I1' },
  { value: 'I2', label: 'I2' },
  { value: 'I3', label: 'I3' },
];

const COLOR_OPTIONS = [
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'G', label: 'G' },
  { value: 'H', label: 'H' },
  { value: 'I', label: 'I' },
  { value: 'J', label: 'J' },
  { value: 'K', label: 'K' },
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
];

const CUT_OPTIONS = [
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'VERY_GOOD', label: 'Very Good' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
];

const SHAPE_OPTIONS = [
  { value: 'ROUND', label: 'Round' },
  { value: 'PRINCESS', label: 'Princess' },
  { value: 'EMERALD', label: 'Emerald' },
  { value: 'ASSCHER', label: 'Asscher' },
  { value: 'MARQUISE', label: 'Marquise' },
  { value: 'OVAL', label: 'Oval' },
  { value: 'RADIANT', label: 'Radiant' },
  { value: 'PEAR', label: 'Pear' },
  { value: 'HEART', label: 'Heart' },
  { value: 'CUSHION', label: 'Cushion' },
];

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'updatedAt-desc', label: 'Recently Updated' },
  { value: 'carat-desc', label: 'Largest Carat' },
  { value: 'carat-asc', label: 'Smallest Carat' },
  { value: 'totalPrice-desc', label: 'Highest Price' },
  { value: 'totalPrice-asc', label: 'Lowest Price' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
];

// Props interface
export interface InventoryFiltersProps {
  filters: DiamondFilters;
  sortBy: DiamondSortOption;
  onFiltersChange: (filters: Partial<DiamondFilters>) => void;
  onSortChange: (sort: DiamondSortOption) => void;
  onClearFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
  onClearFilters,
  totalCount,
  filteredCount,
}) => {
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  // Handle search change
  const handleSearchChange = (search: string) => {
    onFiltersChange({ search: search || undefined });
  };

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    const [field, direction] = sortValue.split('-') as [string, 'asc' | 'desc'];
    onSortChange({
      field: field as DiamondSortOption['field'],
      direction,
    });
  };

  // Handle multi-select filter change
  const handleMultiSelectChange = (
    filterKey: keyof DiamondFilters,
    value: string,
    currentValues: string[] = []
  ) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    onFiltersChange({
      [filterKey]: newValues.length > 0 ? newValues : undefined,
    });
  };

  // Handle range filter change
  const handleRangeChange = (
    minKey: keyof DiamondFilters,
    maxKey: keyof DiamondFilters,
    minValue?: number,
    maxValue?: number
  ) => {
    onFiltersChange({
      [minKey]: minValue,
      [maxKey]: maxValue,
    });
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status?.length) count++;
    if (filters.minCarat !== undefined || filters.maxCarat !== undefined)
      count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined)
      count++;
    if (filters.clarity?.length) count++;
    if (filters.color?.length) count++;
    if (filters.cut?.length) count++;
    if (filters.shape?.length) count++;
    if (filters.isPublic !== undefined) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();
  const currentSortLabel =
    SORT_OPTIONS.find(
      option => option.value === `${sortBy.field}-${sortBy.direction}`
    )?.label || 'Sort';

  return (
    <FilterContainer>
      {/* Search bar */}
      <SearchBar
        value={filters.search || ''}
        onValueChange={handleSearchChange}
        placeholder='Search diamonds...'
        showFilterButton={false}
      />

      {/* Filter controls */}
      <FilterHeader>
        <XStack alignItems='center' gap='$3'>
          <FilterButton
            active={activeFilterCount > 0}
            onPress={() => setShowFilterSheet(true)}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <Paragraph
                fontSize='$2'
                backgroundColor='$background'
                color='$primary'
                paddingHorizontal='$1'
                borderRadius='$1'
                marginLeft='$1'
              >
                {activeFilterCount}
              </Paragraph>
            )}
          </FilterButton>

          <SortButton onPress={() => setShowFilterSheet(true)}>
            <ChevronDown size={16} />
            {currentSortLabel}
          </SortButton>
        </XStack>

        <Paragraph fontSize='$3' color='$colorPress'>
          {filteredCount} of {totalCount}
        </Paragraph>
      </FilterHeader>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <FilterChips>
          <XStack gap='$2' paddingRight='$4'>
            {filters.search && (
              <FilterChip
                onPress={() => onFiltersChange({ search: undefined })}
              >
                <Search size={12} />
                {filters.search}
                <X size={12} />
              </FilterChip>
            )}

            {filters.status?.map(status => (
              <FilterChip
                key={status}
                onPress={() =>
                  handleMultiSelectChange('status', status, filters.status)
                }
              >
                {
                  DIAMOND_STATUS_OPTIONS.find(opt => opt.value === status)
                    ?.label
                }
                <X size={12} />
              </FilterChip>
            ))}

            {(filters.minCarat !== undefined ||
              filters.maxCarat !== undefined) && (
              <FilterChip
                onPress={() => handleRangeChange('minCarat', 'maxCarat')}
              >
                Carat: {filters.minCarat || 0} - {filters.maxCarat || '∞'}
                <X size={12} />
              </FilterChip>
            )}

            {(filters.minPrice !== undefined ||
              filters.maxPrice !== undefined) && (
              <FilterChip
                onPress={() => handleRangeChange('minPrice', 'maxPrice')}
              >
                Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                <X size={12} />
              </FilterChip>
            )}

            {filters.isPublic !== undefined && (
              <FilterChip
                onPress={() => onFiltersChange({ isPublic: undefined })}
              >
                {filters.isPublic ? 'Public' : 'Private'}
                <X size={12} />
              </FilterChip>
            )}

            <Button
              size='$2'
              variant='ghost'
              onPress={onClearFilters}
              color='$red10'
            >
              Clear All
            </Button>
          </XStack>
        </FilterChips>
      )}

      {/* Filter sheet */}
      <Sheet
        modal
        open={showFilterSheet}
        onOpenChange={setShowFilterSheet}
        snapPoints={[85]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding='$4'>
          <ScrollView>
            <YStack gap='$4'>
              <XStack alignItems='center' justifyContent='space-between'>
                <H4>Filters & Sort</H4>
                <Button
                  size='$3'
                  variant='ghost'
                  onPress={() => setShowFilterSheet(false)}
                  circular
                >
                  <X size={20} />
                </Button>
              </XStack>

              {/* Sort Section */}
              <FilterSection>
                <FilterSectionTitle>Sort By</FilterSectionTitle>
                <Select
                  value={`${sortBy.field}-${sortBy.direction}`}
                  onValueChange={handleSortChange}
                  placeholder='Select sort option'
                >
                  {SORT_OPTIONS.map(option => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select>
              </FilterSection>

              <Separator />

              {/* Status Filter */}
              <FilterSection>
                <FilterSectionTitle>Status</FilterSectionTitle>
                <MultiSelectFilter>
                  <MultiSelectOptions>
                    {DIAMOND_STATUS_OPTIONS.map(option => (
                      <MultiSelectOption
                        key={option.value}
                        selected={filters.status?.includes(option.value)}
                        onPress={() =>
                          handleMultiSelectChange(
                            'status',
                            option.value,
                            filters.status
                          )
                        }
                      >
                        {option.label}
                      </MultiSelectOption>
                    ))}
                  </MultiSelectOptions>
                </MultiSelectFilter>
              </FilterSection>

              <Separator />

              {/* Visibility Filter */}
              <FilterSection>
                <FilterSectionTitle>Visibility</FilterSectionTitle>
                <MultiSelectOptions>
                  <MultiSelectOption
                    selected={filters.isPublic === true}
                    onPress={() =>
                      onFiltersChange({
                        isPublic: filters.isPublic === true ? undefined : true,
                      })
                    }
                  >
                    Public
                  </MultiSelectOption>
                  <MultiSelectOption
                    selected={filters.isPublic === false}
                    onPress={() =>
                      onFiltersChange({
                        isPublic:
                          filters.isPublic === false ? undefined : false,
                      })
                    }
                  >
                    Private
                  </MultiSelectOption>
                </MultiSelectOptions>
              </FilterSection>

              <Separator />

              {/* Carat Range */}
              <FilterSection>
                <FilterSectionTitle>Carat Weight</FilterSectionTitle>
                <RangeFilter>
                  <NumberInput
                    value={filters.minCarat}
                    onValueChange={value =>
                      handleRangeChange(
                        'minCarat',
                        'maxCarat',
                        value,
                        filters.maxCarat
                      )
                    }
                    placeholder='Min'
                    flex={1}
                    step={0.01}
                    precision={2}
                  />
                  <Paragraph color='$colorPress'>to</Paragraph>
                  <NumberInput
                    value={filters.maxCarat}
                    onValueChange={value =>
                      handleRangeChange(
                        'minCarat',
                        'maxCarat',
                        filters.minCarat,
                        value
                      )
                    }
                    placeholder='Max'
                    flex={1}
                    step={0.01}
                    precision={2}
                  />
                </RangeFilter>
              </FilterSection>

              <Separator />

              {/* Price Range */}
              <FilterSection>
                <FilterSectionTitle>Price Range</FilterSectionTitle>
                <RangeFilter>
                  <NumberInput
                    value={filters.minPrice}
                    onValueChange={value =>
                      handleRangeChange(
                        'minPrice',
                        'maxPrice',
                        value,
                        filters.maxPrice
                      )
                    }
                    placeholder='Min Price'
                    flex={1}
                    step={100}
                  />
                  <Paragraph color='$colorPress'>to</Paragraph>
                  <NumberInput
                    value={filters.maxPrice}
                    onValueChange={value =>
                      handleRangeChange(
                        'minPrice',
                        'maxPrice',
                        filters.minPrice,
                        value
                      )
                    }
                    placeholder='Max Price'
                    flex={1}
                    step={100}
                  />
                </RangeFilter>
              </FilterSection>

              <Separator />

              {/* Clarity Filter */}
              <FilterSection>
                <FilterSectionTitle>Clarity</FilterSectionTitle>
                <MultiSelectOptions>
                  {CLARITY_OPTIONS.map(option => (
                    <MultiSelectOption
                      key={option.value}
                      selected={filters.clarity?.includes(option.value)}
                      onPress={() =>
                        handleMultiSelectChange(
                          'clarity',
                          option.value,
                          filters.clarity
                        )
                      }
                    >
                      {option.label}
                    </MultiSelectOption>
                  ))}
                </MultiSelectOptions>
              </FilterSection>

              <Separator />

              {/* Color Filter */}
              <FilterSection>
                <FilterSectionTitle>Color</FilterSectionTitle>
                <MultiSelectOptions>
                  {COLOR_OPTIONS.map(option => (
                    <MultiSelectOption
                      key={option.value}
                      selected={filters.color?.includes(option.value)}
                      onPress={() =>
                        handleMultiSelectChange(
                          'color',
                          option.value,
                          filters.color
                        )
                      }
                    >
                      {option.label}
                    </MultiSelectOption>
                  ))}
                </MultiSelectOptions>
              </FilterSection>

              <Separator />

              {/* Cut Filter */}
              <FilterSection>
                <FilterSectionTitle>Cut</FilterSectionTitle>
                <MultiSelectOptions>
                  {CUT_OPTIONS.map(option => (
                    <MultiSelectOption
                      key={option.value}
                      selected={filters.cut?.includes(option.value)}
                      onPress={() =>
                        handleMultiSelectChange(
                          'cut',
                          option.value,
                          filters.cut
                        )
                      }
                    >
                      {option.label}
                    </MultiSelectOption>
                  ))}
                </MultiSelectOptions>
              </FilterSection>

              <Separator />

              {/* Shape Filter */}
              <FilterSection>
                <FilterSectionTitle>Shape</FilterSectionTitle>
                <MultiSelectOptions>
                  {SHAPE_OPTIONS.map(option => (
                    <MultiSelectOption
                      key={option.value}
                      selected={filters.shape?.includes(option.value)}
                      onPress={() =>
                        handleMultiSelectChange(
                          'shape',
                          option.value,
                          filters.shape
                        )
                      }
                    >
                      {option.label}
                    </MultiSelectOption>
                  ))}
                </MultiSelectOptions>
              </FilterSection>

              {/* Action buttons */}
              <XStack gap='$3' marginTop='$4'>
                <Button flex={1} variant='outlined' onPress={onClearFilters}>
                  Clear All
                </Button>
                <Button flex={1} onPress={() => setShowFilterSheet(false)}>
                  Apply Filters
                </Button>
              </XStack>
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </FilterContainer>
  );
};
