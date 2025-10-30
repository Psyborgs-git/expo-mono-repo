import { useState, useCallback, useMemo } from 'react';
import { useGetPublicDiamondsQuery } from '../src/graphql/diamonds/diamonds.generated';
import type { Diamond_BasicFragment } from '../src/graphql/diamonds/diamonds.generated';

export interface UsePublicDiamondsOptions {
  pageSize?: number;
  enabled?: boolean;
}

export interface UsePublicDiamondsResult {
  diamonds: Diamond_BasicFragment[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  hasNextPage: boolean;
  loadingMore: boolean;
  totalCount: number;
  refresh: () => void;
  loadMore: () => void;
}

export const usePublicDiamonds = (
  options: UsePublicDiamondsOptions = {}
): UsePublicDiamondsResult => {
  const { pageSize = 20, enabled = true } = options;
  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, error, refetch, fetchMore } = useGetPublicDiamondsQuery({
    variables: {
      first: pageSize,
    },
    skip: !enabled,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  });

  // Extract diamonds from edges
  const diamonds = useMemo(() => {
    return data?.publicDiamonds?.edges?.map(edge => edge.node) || [];
  }, [data]);

  // Pagination info
  const pageInfo = data?.publicDiamonds?.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage || false;
  const totalCount = data?.publicDiamonds?.totalCount || 0;

  // Handle refresh
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // Handle load more
  const loadMore = useCallback(async () => {
    if (!hasNextPage || loading) return;

    try {
      await fetchMore({
        variables: {
          first: pageSize,
          after: pageInfo?.endCursor,
        },
      });
    } catch (err) {
      console.error('Error loading more diamonds:', err);
    }
  }, [hasNextPage, loading, fetchMore, pageSize, pageInfo?.endCursor]);

  // Format error message
  const errorMessage = useMemo(() => {
    if (!error) return null;
    return error.message || 'Failed to load diamonds';
  }, [error]);

  return {
    diamonds,
    loading,
    error: errorMessage,
    refreshing,
    hasNextPage,
    loadingMore: loading && diamonds.length > 0,
    totalCount,
    refresh,
    loadMore,
  };
};