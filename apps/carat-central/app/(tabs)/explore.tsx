import React, { useState, useCallback } from 'react';
import { View, YStack, H2, Paragraph } from 'tamagui';
import { DiamondList } from '../../components/organisms/DiamondList';
import { SearchBar } from '@bdt/components';

// Local diamond type used by the UI components
type DiamondType = {
  id: string;
  name?: string | null | undefined;
  carat: number;
  clarity: string | null | undefined;
  color: string | null | undefined;
  cut: string | null | undefined;
  shape: string | null | undefined;
  pricePerCarat: number | null | undefined;
  totalPrice: number | null | undefined;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  stockNumber?: string | null | undefined;
  certificate?: string | null | undefined;
  isPublic: boolean;
};
import { usePublicDiamonds } from '../../hooks/usePublicDiamonds';
import { useSearchDiamonds } from '../../hooks/useSearchDiamonds';
import { DiamondDetailModal } from '../../components/diamond/DiamondDetailModal';
import { DiamondFilters } from '../../components/diamond/DiamondFilters';
import type { Diamond_BasicFragment } from '../../src/graphql/diamonds/diamonds.generated';
import type { DiamondFilters as DiamondFiltersType } from '../../components/diamond/DiamondFilters';

// Convert GraphQL diamond to component diamond type
const convertDiamond = (diamond: Diamond_BasicFragment): DiamondType => ({
  id: diamond.id,
  name: diamond.name ?? undefined,
  carat: diamond.carat,
  clarity: diamond.clarity,
  color: diamond.color,
  cut: diamond.cut,
  shape: diamond.shape,
  pricePerCarat: diamond.pricePerCarat,
  totalPrice: diamond.totalPrice,
  status: diamond.status as 'AVAILABLE' | 'RESERVED' | 'SOLD',
  stockNumber: diamond.stockNumber ?? undefined,
  certificate: diamond.certificate ?? undefined,
  isPublic: diamond.isPublic,
});

// Convert search result to component diamond type
const convertSearchResult = (result: any): DiamondType => ({
  id: result.id,
  name: result.name,
  carat: result.carat,
  clarity: result.clarity,
  color: result.color,
  cut: result.cut,
  shape: result.shape,
  pricePerCarat: result.pricePerCarat,
  totalPrice: result.totalPrice,
  status: 'AVAILABLE' as const,
  stockNumber: result.stockNumber,
  isPublic: true,
});

export default function ExploreScreen() {
  const [selectedDiamond, setSelectedDiamond] =
    useState<Diamond_BasicFragment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Public diamonds (default view)
  const {
    diamonds,
    loading,
    error,
    refreshing,
    hasNextPage,
    loadingMore,
    totalCount,
    refresh,
    loadMore,
  } = usePublicDiamonds();

  // Search functionality
  const {
    searchResults,
    loading: searchLoading,
    error: searchError,
    searchQuery,
    filters,
    hasSearched,
    search,
    updateFilters,
    clearSearch,
  } = useSearchDiamonds();

  // Handle diamond press
  const handleDiamondPress = useCallback(
    (diamond: DiamondType) => {
      if (hasSearched) {
        // For search results, create a basic diamond object
        const searchDiamond: Diamond_BasicFragment = {
          __typename: 'Diamond' as const,
          id: diamond.id,
          name: diamond.name || null,
          carat: diamond.carat,
          clarity: diamond.clarity as any,
          color: diamond.color as any,
          cut: diamond.cut as any,
          shape: diamond.shape as any,
          pricePerCarat: diamond.pricePerCarat,
          totalPrice: diamond.totalPrice,
          status: diamond.status as any,
          stockNumber: diamond.stockNumber || null,
          certificate: diamond.certificate || null,
          certificateNumber: null,
          isPublic: diamond.isPublic,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          organizationId: '',
          ownerId: '',
        };
        setSelectedDiamond(searchDiamond);
      } else {
        const originalDiamond = diamonds.find(d => d.id === diamond.id);
        if (originalDiamond) {
          setSelectedDiamond(originalDiamond);
        }
      }
      setModalVisible(true);
    },
    [diamonds, hasSearched]
  );

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setSelectedDiamond(null);
  }, []);

  // Handle contact seller (requires authentication)
  const handleContactSeller = useCallback((diamond: Diamond_BasicFragment) => {
    // TODO: Navigate to login or show auth required message
    console.log('Contact seller for diamond:', diamond.id);
  }, []);

  // Handle add to favorites (requires authentication)
  const handleAddToFavorites = useCallback((diamond: Diamond_BasicFragment) => {
    // TODO: Navigate to login or show auth required message
    console.log('Add to favorites:', diamond.id);
  }, []);

  // Handle similar diamond press
  const handleSimilarDiamondPress = useCallback(
    (similarDiamond: DiamondType) => {
      // Create a basic diamond object for the similar diamond
      const diamond: Diamond_BasicFragment = {
        __typename: 'Diamond' as const,
        id: similarDiamond.id,
        name: similarDiamond.name || null,
        carat: similarDiamond.carat,
        clarity: similarDiamond.clarity as any,
        color: similarDiamond.color as any,
        cut: similarDiamond.cut as any,
        shape: similarDiamond.shape as any,
        pricePerCarat: similarDiamond.pricePerCarat,
        totalPrice: similarDiamond.totalPrice,
        status: similarDiamond.status as any,
        stockNumber: similarDiamond.stockNumber || null,
        certificate: similarDiamond.certificate || null,
        certificateNumber: null,
        isPublic: similarDiamond.isPublic,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        organizationId: '',
        ownerId: '',
      };
      setSelectedDiamond(diamond);
    },
    []
  );

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        search(query, filters);
      } else {
        clearSearch();
      }
    },
    [search, filters, clearSearch]
  );

  // Handle filter toggle
  const handleFilterToggle = useCallback(() => {
    setFiltersVisible(true);
  }, []);

  // Handle filter apply
  const handleFilterApply = useCallback(() => {
    setFiltersVisible(false);
    if (hasSearched) {
      search(searchQuery, filters);
    }
  }, [hasSearched, search, searchQuery, filters]);

  // Handle filter clear
  const handleFilterClear = useCallback(() => {
    clearSearch();
    setSearchValue('');
  }, [clearSearch]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    if (hasSearched) {
      search(searchQuery, filters);
    } else {
      refresh();
    }
  }, [hasSearched, search, searchQuery, filters, refresh]);

  // Determine which data to show
  const displayDiamonds = hasSearched
    ? searchResults.map(convertSearchResult)
    : diamonds.map(convertDiamond);

  const displayLoading = hasSearched ? searchLoading : loading;
  const displayError = hasSearched ? searchError : error;
  const displayTotalCount = hasSearched ? searchResults.length : totalCount;

  // Check if filters are active
  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof DiamondFiltersType];
    return Array.isArray(value) ? value.length > 0 : value !== undefined;
  });

  return (
    <View flex={1} backgroundColor='$background'>
      {/* Header */}
      <YStack paddingHorizontal='$4' paddingTop='$4' paddingBottom='$2'>
        <H2>Explore Diamonds</H2>
        <Paragraph fontSize='$3' opacity={0.7}>
          {hasSearched
            ? `${displayTotalCount} search results`
            : displayTotalCount > 0
              ? `${displayTotalCount} diamonds available`
              : 'Discover beautiful diamonds'}
        </Paragraph>
      </YStack>

      {/* Search Bar */}
      <YStack paddingHorizontal='$4' paddingBottom='$3'>
        <SearchBar
          value={searchValue}
          onValueChange={setSearchValue}
          onSearch={handleSearch}
          placeholder='Search diamonds...'
          showFilterButton={true}
          filterActive={hasActiveFilters}
          onFilterPress={handleFilterToggle}
        />
      </YStack>

      {/* Diamond List */}
      <DiamondList
        diamonds={displayDiamonds}
        loading={displayLoading}
        refreshing={refreshing}
        hasNextPage={hasSearched ? false : hasNextPage}
        loadingMore={hasSearched ? false : loadingMore}
        error={displayError}
        emptyMessage={
          hasSearched
            ? 'No diamonds match your search'
            : 'No diamonds available at the moment'
        }
        numColumns={2}
        variant='compact'
        showActions={true}
        showStatus={false}
        onDiamondPress={handleDiamondPress}
        onRefresh={handleRefresh}
        {...(hasSearched ? {} : { onLoadMore: loadMore })}
      />

      {/* Diamond Detail Modal */}
      <DiamondDetailModal
        diamond={selectedDiamond}
        visible={modalVisible}
        onClose={handleModalClose}
        onContactSeller={handleContactSeller}
        onAddToFavorites={handleAddToFavorites}
        onSimilarDiamondPress={handleSimilarDiamondPress}
      />

      {/* Filters Modal */}
      <DiamondFilters
        visible={filtersVisible}
        filters={filters}
        onFiltersChange={updateFilters}
        onClose={() => setFiltersVisible(false)}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
      />
    </View>
  );
}
