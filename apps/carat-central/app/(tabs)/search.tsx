import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FlatList, RefreshControl, Alert } from 'react-native';
import {
  View,
  YStack,
  XStack,
  H3,
  H4,
  Paragraph,
  Button,
  ScrollView,
  Separator,
  Sheet,
  Switch,
  Input,
} from 'tamagui';
import {
  Search,
  Grid3x3,
  List,
  Download,
  Bookmark,
  Clock,
  X,
  Star,
  Bell,
  BarChart3,
} from '@tamagui/lucide-icons';
import { SearchBar } from '../../components/molecules/SearchBar';
import { Select } from '../../components/ui/Select';
import { MultiSelect } from '../../components/ui/MultiSelect';
import { CaratInput } from '../../components/ui/CaratInput';
import { PriceInput } from '../../components/ui/PriceInput';
import { DiamondCard } from '../../components/molecules/DiamondCard';
import { useSearchDiamonds } from '../../hooks/useSearchDiamonds';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import type { DiamondFilters } from '../../components/diamond/DiamondFilters';
import type { DiamondSearchResult } from '../../src/generated/graphql';
import type {
  SavedSearchItem,
  SearchHistoryItem,
} from '../../hooks/useSearchHistory';

// Sort options
const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Carat: Low to High', value: 'carat_asc' },
  { label: 'Carat: High to Low', value: 'carat_desc' },
  { label: 'Recently Added', value: 'date_desc' },
];

// View options
type ViewMode = 'grid' | 'list';

// Filter options based on GraphQL enums
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

export default function SearchScreen() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<DiamondFilters>({});
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Search hooks
  const {
    searchResults,
    loading,
    hasSearched,
    search,
    updateFilters,
    clearSearch,
  } = useSearchDiamonds();

  const {
    searchHistory,
    savedSearches,
    analytics,
    addToHistory,
    clearHistory,
    removeFromHistory,
    saveSearch,
    deleteSavedSearch,
    updateSavedSearch,
  } = useSearchHistory();

  // Add search to history when results are received
  useEffect(() => {
    if (hasSearched && !loading && searchResults) {
      addToHistory(searchQuery, filters, searchResults.length);
    }
  }, [hasSearched, loading, searchResults, searchQuery, filters, addToHistory]);

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      search(query, filters);
    },
    [filters, search]
  );

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: DiamondFilters) => {
      setFilters(newFilters);
      updateFilters(newFilters);
    },
    [updateFilters]
  );

  // Handle clear all
  const handleClearAll = useCallback(() => {
    setSearchQuery('');
    setFilters({});
    setSortBy('relevance');
    clearSearch();
  }, [clearSearch]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (hasSearched) {
      search(searchQuery, filters);
    }
  }, [hasSearched, searchQuery, filters, search]);

  // Handle diamond press
  const handleDiamondPress = useCallback((diamond: DiamondSearchResult) => {
    console.log('Diamond pressed:', diamond.id);
  }, []);

  // Handle export results
  const handleExportResults = useCallback(() => {
    console.log('Export results');
  }, []);

  // Handle save search
  const handleSaveSearch = useCallback(() => {
    if (!hasSearched) return;
    setShowSaveDialog(true);
  }, [hasSearched]);

  // Handle save search confirm
  const handleSaveSearchConfirm = useCallback(async () => {
    if (!saveSearchName.trim()) return;

    try {
      await saveSearch(saveSearchName.trim(), searchQuery, filters);
      setSaveSearchName('');
      setShowSaveDialog(false);
      Alert.alert('Success', 'Search saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save search');
    }
  }, [saveSearchName, searchQuery, filters, saveSearch]);

  // Handle use saved search
  const handleUseSavedSearch = useCallback(
    async (savedSearch: SavedSearchItem) => {
      setSearchQuery(savedSearch.query);
      setFilters(savedSearch.filters);
      setShowSavedSearches(false);

      // Perform the search
      search(savedSearch.query, savedSearch.filters);
    },
    [search]
  );

  // Handle use history item
  const handleUseHistoryItem = useCallback(
    (historyItem: SearchHistoryItem) => {
      setSearchQuery(historyItem.query);
      setFilters(historyItem.filters);
      setShowSearchHistory(false);

      // Perform the search
      search(historyItem.query, historyItem.filters);
    },
    [search]
  );

  // Handle delete saved search
  const handleDeleteSavedSearch = useCallback(
    (id: string) => {
      Alert.alert(
        'Delete Saved Search',
        'Are you sure you want to delete this saved search?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteSavedSearch(id),
          },
        ]
      );
    },
    [deleteSavedSearch]
  );

  // Handle toggle search alert
  const handleToggleSearchAlert = useCallback(
    async (id: string, enabled: boolean) => {
      try {
        await updateSavedSearch(id, { alertEnabled: enabled });
      } catch (error) {
        Alert.alert('Error', 'Failed to update search alert');
      }
    },
    [updateSavedSearch]
  );

  // Render diamond item
  const renderDiamondItem = useCallback(
    ({ item }: { item: DiamondSearchResult }) => {
      return (
        <View paddingHorizontal='$2' paddingVertical='$1'>
          <DiamondCard
            diamond={{
              id: item.id,
              name: item.name,
              carat: item.carat,
              pricePerCarat: item.pricePerCarat,
              totalPrice: item.totalPrice,
              clarity: item.clarity as any,
              color: item.color as any,
              cut: item.cut as any,
              shape: item.shape as any,
              stockNumber: item.stockNumber,
              status: 'AVAILABLE' as any,
              isPublic: true,
            }}
            onPress={() => handleDiamondPress(item)}
            variant={viewMode === 'grid' ? 'compact' : 'detailed'}
          />
        </View>
      );
    },
    [viewMode, handleDiamondPress]
  );

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.minCarat || filters.maxCarat) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.shapes?.length) count++;
    if (filters.clarityGrades?.length) count++;
    if (filters.colorGrades?.length) count++;
    if (filters.cutGrades?.length) count++;
    return count;
  }, [filters]);

  // Get recent searches for SearchBar
  const recentSearches = useMemo(() => {
    return searchHistory
      .slice(0, 5)
      .map(item => item.query)
      .filter(query => query.trim().length > 0);
  }, [searchHistory]);

  return (
    <View flex={1} backgroundColor='$background'>
      {/* Header */}
      <YStack paddingHorizontal='$4' paddingTop='$4' paddingBottom='$2'>
        <XStack
          alignItems='center'
          justifyContent='space-between'
          marginBottom='$3'
        >
          <H3>Advanced Search</H3>
          <XStack gap='$2'>
            <Button size='$3' onPress={() => setShowSearchHistory(true)}>
              <Clock size={16} />
            </Button>
            <Button size='$3' onPress={() => setShowSavedSearches(true)}>
              <Bookmark size={16} />
            </Button>
            <Button size='$3' onPress={() => setShowAnalytics(true)}>
              <BarChart3 size={16} />
            </Button>
            {hasSearched && searchResults.length > 0 && (
              <Button size='$3' onPress={handleExportResults}>
                <Download size={16} />
              </Button>
            )}
          </XStack>
        </XStack>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onValueChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder='Search diamonds...'
          recentSearches={recentSearches}
          showFilterButton={true}
          filterActive={activeFilterCount > 0}
          onFilterPress={() => setShowFilters(true)}
          onRecentSearchPress={query => {
            setSearchQuery(query);
            handleSearch(query);
          }}
        />

        {/* Quick Actions */}
        {hasSearched && (
          <XStack
            alignItems='center'
            justifyContent='space-between'
            marginTop='$3'
          >
            <XStack alignItems='center' gap='$3'>
              <Paragraph fontSize='$3'>
                {searchResults.length} results
              </Paragraph>
              {activeFilterCount > 0 && (
                <Button size='$2' onPress={handleClearAll}>
                  Clear all
                </Button>
              )}
            </XStack>

            <XStack alignItems='center' gap='$2'>
              {/* Sort */}
              <Select
                options={SORT_OPTIONS}
                value={sortBy}
                onValueChange={setSortBy}
                placeholder='Sort by'
                size='small'
              />

              {/* View Mode */}
              <XStack
                backgroundColor='$backgroundStrong'
                borderRadius='$2'
                padding='$1'
              >
                <Button
                  size='$2'
                  backgroundColor={
                    viewMode === 'grid' ? '$primary' : '$backgroundStrong'
                  }
                  onPress={() => setViewMode('grid')}
                >
                  <Grid3x3 size={14} />
                </Button>
                <Button
                  size='$2'
                  backgroundColor={
                    viewMode === 'list' ? '$primary' : '$backgroundStrong'
                  }
                  onPress={() => setViewMode('list')}
                >
                  <List size={14} />
                </Button>
              </XStack>
            </XStack>
          </XStack>
        )}
      </YStack>

      {/* Results */}
      {hasSearched ? (
        <FlatList
          data={searchResults}
          renderItem={renderDiamondItem}
          keyExtractor={item => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          contentContainerStyle={{ padding: 8 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <YStack
              flex={1}
              justifyContent='center'
              alignItems='center'
              padding='$8'
            >
              <Search size={48} />
              <H4 marginTop='$4'>No diamonds found</H4>
              <Paragraph textAlign='center' marginTop='$2'>
                Try adjusting your search terms or filters
              </Paragraph>
            </YStack>
          }
        />
      ) : (
        <YStack
          flex={1}
          justifyContent='center'
          alignItems='center'
          padding='$8'
        >
          <Search size={64} />
          <H4 marginTop='$4'>Search for Diamonds</H4>
          <Paragraph textAlign='center' marginTop='$2'>
            Use the search bar above to find diamonds with advanced filters
          </Paragraph>
        </YStack>
      )}

      {/* Filter Sheet */}
      <Sheet
        modal
        open={showFilters}
        onOpenChange={setShowFilters}
        snapPoints={[90]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding='$4'>
          <YStack gap='$4'>
            <XStack alignItems='center' justifyContent='space-between'>
              <H4>Filters</H4>
              <XStack gap='$2'>
                <Button
                  size='$3'
                  onPress={() => {
                    setFilters({});
                    updateFilters({});
                  }}
                >
                  Clear
                </Button>
                <Button size='$3' onPress={handleSaveSearch}>
                  <Bookmark size={16} />
                  Save
                </Button>
              </XStack>
            </XStack>

            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack gap='$4'>
                {/* Carat Range */}
                <YStack gap='$2'>
                  <H4 fontSize='$4'>Carat Weight</H4>
                  <XStack gap='$3' alignItems='center'>
                    <CaratInput
                      value={filters.minCarat}
                      onValueChange={(value: number) =>
                        handleFiltersChange({ ...filters, minCarat: value })
                      }
                      placeholder='Min'
                      flex={1}
                    />
                    <Paragraph>to</Paragraph>
                    <CaratInput
                      value={filters.maxCarat}
                      onValueChange={(value: number) =>
                        handleFiltersChange({ ...filters, maxCarat: value })
                      }
                      placeholder='Max'
                      flex={1}
                    />
                  </XStack>
                </YStack>

                <Separator />

                {/* Price Range */}
                <YStack gap='$2'>
                  <H4 fontSize='$4'>Price Range</H4>
                  <XStack gap='$3' alignItems='center'>
                    <PriceInput
                      value={filters.minPrice}
                      onValueChange={(value: number) =>
                        handleFiltersChange({ ...filters, minPrice: value })
                      }
                      placeholder='Min'
                      flex={1}
                    />
                    <Paragraph>to</Paragraph>
                    <PriceInput
                      value={filters.maxPrice}
                      onValueChange={(value: number) =>
                        handleFiltersChange({ ...filters, maxPrice: value })
                      }
                      placeholder='Max'
                      flex={1}
                    />
                  </XStack>
                </YStack>

                <Separator />

                {/* Shape */}
                <YStack gap='$2'>
                  <H4 fontSize='$4'>Shape</H4>
                  <MultiSelect
                    options={SHAPE_OPTIONS}
                    values={filters.shapes || []}
                    onValuesChange={values =>
                      handleFiltersChange({ ...filters, shapes: values })
                    }
                    placeholder='Select shapes'
                  />
                </YStack>

                <Separator />

                {/* Clarity */}
                <YStack gap='$2'>
                  <H4 fontSize='$4'>Clarity</H4>
                  <MultiSelect
                    options={CLARITY_OPTIONS}
                    values={filters.clarityGrades || []}
                    onValuesChange={values =>
                      handleFiltersChange({ ...filters, clarityGrades: values })
                    }
                    placeholder='Select clarity grades'
                  />
                </YStack>

                <Separator />

                {/* Color */}
                <YStack gap='$2'>
                  <H4 fontSize='$4'>Color</H4>
                  <MultiSelect
                    options={COLOR_OPTIONS}
                    values={filters.colorGrades || []}
                    onValuesChange={values =>
                      handleFiltersChange({ ...filters, colorGrades: values })
                    }
                    placeholder='Select color grades'
                  />
                </YStack>

                <Separator />

                {/* Cut */}
                <YStack gap='$2'>
                  <H4 fontSize='$4'>Cut</H4>
                  <MultiSelect
                    options={CUT_OPTIONS}
                    values={filters.cutGrades || []}
                    onValuesChange={values =>
                      handleFiltersChange({ ...filters, cutGrades: values })
                    }
                    placeholder='Select cut grades'
                  />
                </YStack>
              </YStack>
            </ScrollView>

            <XStack gap='$3' paddingTop='$4'>
              <Button
                flex={1}
                backgroundColor='$backgroundStrong'
                onPress={() => setShowFilters(false)}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                backgroundColor='$primary'
                onPress={() => {
                  setShowFilters(false);
                  if (searchQuery) {
                    search(searchQuery, filters);
                  }
                }}
              >
                Apply Filters
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>

      {/* Save Search Dialog */}
      <Sheet
        modal
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        snapPoints={[40]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding='$4'>
          <YStack gap='$4'>
            <H4>Save Search</H4>

            <YStack gap='$2'>
              <Paragraph fontSize='$3'>
                Give your search a name to save it for later
              </Paragraph>
              <Input
                placeholder='Enter search name...'
                value={saveSearchName}
                onChangeText={setSaveSearchName}
                autoFocus
              />
            </YStack>

            <XStack gap='$3'>
              <Button
                flex={1}
                backgroundColor='$backgroundStrong'
                onPress={() => {
                  setSaveSearchName('');
                  setShowSaveDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                backgroundColor='$primary'
                onPress={handleSaveSearchConfirm}
                disabled={!saveSearchName.trim()}
              >
                Save
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
}
