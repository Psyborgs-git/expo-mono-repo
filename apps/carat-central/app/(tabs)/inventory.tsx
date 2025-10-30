import React, { useState, useCallback } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { View, YStack, XStack, Paragraph, Button } from 'tamagui';
import { Plus, Grid3x3, List, Download, Upload } from '@tamagui/lucide-icons';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { Loading } from '../../components/atoms/Loading';
import { useDiamonds } from '../../hooks/useDiamonds';
import { InventoryDiamondCard } from '../../components/diamond/InventoryDiamondCard';
import { InventoryFilters } from '../../components/diamond/InventoryFilters';
import { BulkActions } from '../../components/diamond/BulkActions';
import { Diamond_BasicFragment } from '../../src/graphql/diamonds/diamonds.generated';
import { router } from 'expo-router';

// Header component
const InventoryHeader: React.FC<{
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onAddDiamond: () => void;
  onImport?: () => void;
  onExport?: () => void;
}> = ({ viewMode, onViewModeChange, onAddDiamond, onImport, onExport }) => (
  <XStack
    alignItems='center'
    justifyContent='space-between'
    paddingHorizontal='$4'
    paddingVertical='$3'
    backgroundColor='$background'
    borderBottomWidth={1}
    borderBottomColor='#E0E0E0'
  >
    <Paragraph fontSize='$6' fontWeight='bold'>
      Inventory
    </Paragraph>

    <XStack alignItems='center' gap='$2'>
      {/* View mode toggle */}
      <XStack
        backgroundColor='$backgroundStrong'
        borderRadius='$3'
        padding='$1'
      >
        <Button
          size='$2'
          variant={viewMode === 'grid' ? 'outlined' : 'outlined'}
          onPress={() => onViewModeChange('grid')}
          circular
        >
          <Grid3x3 size={16} />
        </Button>
        <Button
          size='$2'
          variant='outlined'
          onPress={() => onViewModeChange('list')}
          circular
        >
          <List size={16} />
        </Button>
      </XStack>

      {/* Import/Export buttons */}
      {onImport && (
        <Button size='$3' variant='outlined' onPress={onImport}>
          <Upload size={16} />
        </Button>
      )}

      {onExport && (
        <Button size='$3' variant='outlined' onPress={onExport}>
          <Download size={16} />
        </Button>
      )}

      {/* Add diamond button */}
      <Button size='$3' onPress={onAddDiamond}>
        <Plus size={16} />
        Add
      </Button>
    </XStack>
  </XStack>
);

// Empty state component
const EmptyState: React.FC<{
  hasFilters: boolean;
  onAddDiamond: () => void;
  onClearFilters: () => void;
}> = ({ hasFilters, onAddDiamond, onClearFilters }) => (
  <YStack
    flex={1}
    justifyContent='center'
    alignItems='center'
    paddingHorizontal='$6'
    gap='$4'
  >
    <Paragraph fontSize='$6' fontWeight='600' textAlign='center'>
      {hasFilters
        ? 'No diamonds match your filters'
        : 'No diamonds in inventory'}
    </Paragraph>

    <Paragraph fontSize='$4' color='$colorPress' textAlign='center'>
      {hasFilters
        ? 'Try adjusting your search criteria or filters'
        : 'Start building your diamond inventory by adding your first diamond'}
    </Paragraph>

    <XStack gap='$3'>
      {hasFilters ? (
        <Button variant='outlined' onPress={onClearFilters}>
          Clear Filters
        </Button>
      ) : (
        <Button onPress={onAddDiamond}>
          <Plus size={16} />
          Add First Diamond
        </Button>
      )}
    </XStack>
  </YStack>
);

export default function InventoryScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const {
    diamonds,
    totalCount,
    loading,
    error,
    hasNextPage,
    loadMore,
    refresh,
    filters,
    updateFilters,
    clearFilters,
    sortBy,
    updateSort,
    viewMode,
    setViewMode,
    selectedDiamonds,
    toggleDiamondSelection,
    selectAllDiamonds,
    clearSelection,
    handleDeleteDiamond,
    handlePublishDiamond,
    handleUnpublishDiamond,
    bulkDelete,
    bulkPublish,
    bulkUnpublish,
  } = useDiamonds();

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  // Navigation handlers
  const handleAddDiamond = useCallback(() => {
    router.push('/diamond/create');
  }, []);

  const handleViewDiamond = useCallback((diamond: Diamond_BasicFragment) => {
    router.push(`/diamond/${diamond.id}`);
  }, []);

  const handleEditDiamond = useCallback((diamond: Diamond_BasicFragment) => {
    router.push(`/diamond/${diamond.id}/edit`);
  }, []);

  // Diamond action handlers
  const handleDuplicateDiamond = useCallback(
    (diamond: Diamond_BasicFragment) => {
      router.push(`/diamond/create?duplicate=${diamond.id}`);
    },
    []
  );

  const handleShareDiamond = useCallback((diamond: Diamond_BasicFragment) => {
    // TODO: Implement share functionality
    console.log('Share diamond:', diamond.id);
  }, []);

  // Import/Export handlers
  const handleImport = useCallback(() => {
    // TODO: Implement import functionality
    console.log('Import diamonds');
  }, []);

  const handleExport = useCallback(() => {
    // TODO: Implement export functionality
    console.log('Export diamonds');
  }, []);

  // Render diamond item
  const renderDiamondItem = useCallback(
    ({ item: diamond }: { item: Diamond_BasicFragment }) => (
      <InventoryDiamondCard
        diamond={diamond}
        variant={viewMode === 'grid' ? 'compact' : 'detailed'}
        selectable={true}
        selected={selectedDiamonds.includes(diamond.id)}
        onSelect={toggleDiamondSelection}
        onView={handleViewDiamond}
        onEdit={handleEditDiamond}
        onDelete={handleDeleteDiamond}
        onPublish={handlePublishDiamond}
        onUnpublish={handleUnpublishDiamond}
        onDuplicate={handleDuplicateDiamond}
        onShare={handleShareDiamond}
      />
    ),
    [
      viewMode,
      selectedDiamonds,
      toggleDiamondSelection,
      handleViewDiamond,
      handleEditDiamond,
      handleDeleteDiamond,
      handlePublishDiamond,
      handleUnpublishDiamond,
      handleDuplicateDiamond,
      handleShareDiamond,
    ]
  );

  // Get item layout for performance
  const getItemLayout = useCallback(
    (data: any, index: number) => ({
      length: viewMode === 'grid' ? 280 : 320,
      offset: (viewMode === 'grid' ? 280 : 320) * index,
      index,
    }),
    [viewMode]
  );

  // Check if filters are active
  const hasActiveFilters = Object.values(filters).some(
    value =>
      value !== undefined &&
      value !== '' &&
      (Array.isArray(value) ? value.length > 0 : true)
  );

  if (error) {
    return (
      <AuthGuard requireOrganization={true}>
        <View flex={1} backgroundColor='$background'>
          <InventoryHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddDiamond={handleAddDiamond}
            onImport={handleImport}
            onExport={handleExport}
          />

          <YStack
            flex={1}
            justifyContent='center'
            alignItems='center'
            paddingHorizontal='$6'
          >
            <Paragraph
              fontSize='$5'
              color='$red10'
              textAlign='center'
              marginBottom='$3'
            >
              Error loading diamonds
            </Paragraph>
            <Paragraph
              fontSize='$3'
              color='$colorPress'
              textAlign='center'
              marginBottom='$4'
            >
              {error.message}
            </Paragraph>
            <Button onPress={handleRefresh}>Try Again</Button>
          </YStack>
        </View>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireOrganization={true}>
      <View flex={1} backgroundColor='$background'>
        {/* Header */}
        <InventoryHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddDiamond={handleAddDiamond}
          onImport={handleImport}
          onExport={handleExport}
        />

        {/* Filters */}
        <InventoryFilters
          filters={filters}
          sortBy={sortBy}
          onFiltersChange={updateFilters}
          onSortChange={updateSort}
          onClearFilters={clearFilters}
          totalCount={totalCount}
          filteredCount={diamonds.length}
        />

        {/* Content */}
        {loading && diamonds.length === 0 ? (
          <YStack flex={1} justifyContent='center' alignItems='center'>
            <Loading size='large' />
            <Paragraph color='$colorPress' marginTop='$3'>
              Loading diamonds...
            </Paragraph>
          </YStack>
        ) : diamonds.length === 0 ? (
          <EmptyState
            hasFilters={hasActiveFilters}
            onAddDiamond={handleAddDiamond}
            onClearFilters={clearFilters}
          />
        ) : (
          <FlatList
            data={diamonds}
            renderItem={renderDiamondItem}
            keyExtractor={item => item.id}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode} // Force re-render when view mode changes
            contentContainerStyle={{
              padding: 16,
              paddingBottom: selectedDiamonds.length > 0 ? 80 : 16,
            }}
            columnWrapperStyle={viewMode === 'grid' ? { gap: 16 } : undefined}
            ItemSeparatorComponent={
              viewMode === 'list' ? () => <View height='$3' /> : undefined
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            onEndReached={hasNextPage ? loadMore : undefined}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loading && diamonds.length > 0 ? (
                <YStack alignItems='center' paddingVertical='$4'>
                  <Loading />
                  <Paragraph color='$colorPress' marginTop='$2'>
                    Loading more...
                  </Paragraph>
                </YStack>
              ) : null
            }
            getItemLayout={getItemLayout}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        )}

        {/* Bulk actions */}
        <BulkActions
          selectedCount={selectedDiamonds.length}
          totalCount={diamonds.length}
          visible={selectedDiamonds.length > 0}
          onSelectAll={selectAllDiamonds}
          onClearSelection={clearSelection}
          onBulkDelete={() => bulkDelete(selectedDiamonds)}
          onBulkPublish={() => bulkPublish(selectedDiamonds)}
          onBulkUnpublish={() => bulkUnpublish(selectedDiamonds)}
        />
      </View>
    </AuthGuard>
  );
}
