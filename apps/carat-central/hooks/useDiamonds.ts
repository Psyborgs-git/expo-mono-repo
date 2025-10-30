import { useState, useCallback, useMemo } from 'react';
import { 
  useGetDiamondsQuery,
  useDeleteDiamondMutation,
  usePublishDiamondMutation,
  useUnpublishDiamondMutation,
  Diamond_BasicFragment
} from '../src/graphql/diamonds/diamonds.generated';
import { useToast } from '../components/hooks/useToast';

export interface DiamondFilters {
  search?: string;
  status?: string[];
  minCarat?: number;
  maxCarat?: number;
  minPrice?: number;
  maxPrice?: number;
  clarity?: string[];
  color?: string[];
  cut?: string[];
  shape?: string[];
  isPublic?: boolean;
}

export interface DiamondSortOption {
  field: 'createdAt' | 'updatedAt' | 'carat' | 'totalPrice' | 'name';
  direction: 'asc' | 'desc';
}

export const useDiamonds = () => {
  const [filters, setFilters] = useState<DiamondFilters>({});
  const [sortBy, setSortBy] = useState<DiamondSortOption>({ field: 'createdAt', direction: 'desc' });
  const [selectedDiamonds, setSelectedDiamonds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { showSuccess, showError } = useToast();

  // Query diamonds with pagination
  const {
    data,
    loading,
    error,
    fetchMore,
    refetch,
  } = useGetDiamondsQuery({
    variables: {
      first: 20,
    },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Mutations
  const [deleteDiamond] = useDeleteDiamondMutation({
    onCompleted: () => {
      showSuccess('Diamond deleted successfully');
    },
    onError: (error: any) => {
      showError(error.message || 'Failed to delete diamond');
    },
    update: (cache: any, { data: mutationData }: any) => {
      if (mutationData?.deleteDiamond.success) {
        // Remove from cache
        cache.modify({
          fields: {
            diamonds(existingDiamonds: any, { readField }: any) {
              return {
                ...existingDiamonds,
                edges: existingDiamonds.edges.filter(
                  (edge: any) => readField('id', edge.node) !== mutationData.deleteDiamond.id
                ),
                totalCount: existingDiamonds.totalCount - 1,
              };
            },
          },
        });
      }
    },
  });

  const [publishDiamond] = usePublishDiamondMutation({
    onCompleted: () => {
      showSuccess('Diamond published successfully');
    },
    onError: (error: any) => {
      showError(error.message || 'Failed to publish diamond');
    },
  });

  const [unpublishDiamond] = useUnpublishDiamondMutation({
    onCompleted: () => {
      showSuccess('Diamond unpublished successfully');
    },
    onError: (error: any) => {
      showError(error.message || 'Failed to unpublish diamond');
    },
  });

  // Get diamonds from query result
  const diamonds = useMemo(() => {
    return data?.diamonds?.edges?.map((edge: any) => edge.node) || [];
  }, [data]);

  // Apply client-side filtering and sorting
  const filteredAndSortedDiamonds = useMemo(() => {
    let filtered = [...diamonds];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(diamond => 
        diamond.name?.toLowerCase().includes(searchLower) ||
        diamond.stockNumber?.toLowerCase().includes(searchLower) ||
        diamond.shape.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(diamond => 
        filters.status!.includes(diamond.status)
      );
    }

    if (filters.minCarat !== undefined) {
      filtered = filtered.filter(diamond => diamond.carat >= filters.minCarat!);
    }

    if (filters.maxCarat !== undefined) {
      filtered = filtered.filter(diamond => diamond.carat <= filters.maxCarat!);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(diamond => diamond.totalPrice >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(diamond => diamond.totalPrice <= filters.maxPrice!);
    }

    if (filters.clarity && filters.clarity.length > 0) {
      filtered = filtered.filter(diamond => 
        filters.clarity!.includes(diamond.clarity)
      );
    }

    if (filters.color && filters.color.length > 0) {
      filtered = filtered.filter(diamond => 
        filters.color!.includes(diamond.color)
      );
    }

    if (filters.cut && filters.cut.length > 0) {
      filtered = filtered.filter(diamond => 
        filters.cut!.includes(diamond.cut)
      );
    }

    if (filters.shape && filters.shape.length > 0) {
      filtered = filtered.filter(diamond => 
        filters.shape!.includes(diamond.shape)
      );
    }

    if (filters.isPublic !== undefined) {
      filtered = filtered.filter(diamond => diamond.isPublic === filters.isPublic);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy.field) {
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'carat':
          aValue = a.carat;
          bValue = b.carat;
          break;
        case 'totalPrice':
          aValue = a.totalPrice;
          bValue = b.totalPrice;
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortBy.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [diamonds, filters, sortBy]);

  // Pagination info
  const pageInfo = data?.diamonds?.pageInfo;
  const totalCount = data?.diamonds?.totalCount || 0;

  // Load more diamonds
  const loadMore = useCallback(async () => {
    if (pageInfo?.hasNextPage && !loading) {
      try {
        await fetchMore({
          variables: {
            after: pageInfo.endCursor,
            first: 20,
          },
        });
      } catch (error) {
        console.error('Error loading more diamonds:', error);
      }
    }
  }, [pageInfo, loading, fetchMore]);

  // Refresh diamonds
  const refresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing diamonds:', error);
    }
  }, [refetch]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<DiamondFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Update sort
  const updateSort = useCallback((newSort: DiamondSortOption) => {
    setSortBy(newSort);
  }, []);

  // Selection management
  const toggleDiamondSelection = useCallback((diamondId: string) => {
    setSelectedDiamonds(prev => 
      prev.includes(diamondId)
        ? prev.filter(id => id !== diamondId)
        : [...prev, diamondId]
    );
  }, []);

  const selectAllDiamonds = useCallback(() => {
    setSelectedDiamonds(filteredAndSortedDiamonds.map(d => d.id));
  }, [filteredAndSortedDiamonds]);

  const clearSelection = useCallback(() => {
    setSelectedDiamonds([]);
  }, []);

  // Bulk actions
  const bulkDelete = useCallback(async (diamondIds: string[]) => {
    try {
      await Promise.all(
        diamondIds.map(id => deleteDiamond({ variables: { id } }))
      );
      setSelectedDiamonds([]);
    } catch (error) {
      console.error('Error in bulk delete:', error);
    }
  }, [deleteDiamond]);

  const bulkPublish = useCallback(async (diamondIds: string[]) => {
    try {
      await Promise.all(
        diamondIds.map(id => publishDiamond({ variables: { id } }))
      );
      setSelectedDiamonds([]);
    } catch (error) {
      console.error('Error in bulk publish:', error);
    }
  }, [publishDiamond]);

  const bulkUnpublish = useCallback(async (diamondIds: string[]) => {
    try {
      await Promise.all(
        diamondIds.map(id => unpublishDiamond({ variables: { id } }))
      );
      setSelectedDiamonds([]);
    } catch (error) {
      console.error('Error in bulk unpublish:', error);
    }
  }, [unpublishDiamond]);

  // Individual actions
  const handleDeleteDiamond = useCallback(async (diamondIdOrDiamond: string | { id: string }) => {
    const diamondId = typeof diamondIdOrDiamond === 'string' ? diamondIdOrDiamond : diamondIdOrDiamond.id;
    try {
      await deleteDiamond({ variables: { id: diamondId } });
    } catch (error) {
      console.error('Error deleting diamond:', error);
    }
  }, [deleteDiamond]);

  const handlePublishDiamond = useCallback(async (diamondIdOrDiamond: string | { id: string }) => {
    const diamondId = typeof diamondIdOrDiamond === 'string' ? diamondIdOrDiamond : diamondIdOrDiamond.id;
    try {
      await publishDiamond({ variables: { id: diamondId } });
    } catch (error) {
      console.error('Error publishing diamond:', error);
    }
  }, [publishDiamond]);

  const handleUnpublishDiamond = useCallback(async (diamondIdOrDiamond: string | { id: string }) => {
    const diamondId = typeof diamondIdOrDiamond === 'string' ? diamondIdOrDiamond : diamondIdOrDiamond.id;
    try {
      await unpublishDiamond({ variables: { id: diamondId } });
    } catch (error) {
      console.error('Error unpublishing diamond:', error);
    }
  }, [unpublishDiamond]);

  return {
    // Data
    diamonds: filteredAndSortedDiamonds,
    totalCount,
    loading,
    error,
    
    // Pagination
    hasNextPage: pageInfo?.hasNextPage || false,
    loadMore,
    refresh,
    
    // Filtering and sorting
    filters,
    updateFilters,
    clearFilters,
    sortBy,
    updateSort,
    
    // View mode
    viewMode,
    setViewMode,
    
    // Selection
    selectedDiamonds,
    toggleDiamondSelection,
    selectAllDiamonds,
    clearSelection,
    
    // Actions
    handleDeleteDiamond,
    handlePublishDiamond,
    handleUnpublishDiamond,
    bulkDelete,
    bulkPublish,
    bulkUnpublish,
  };
};