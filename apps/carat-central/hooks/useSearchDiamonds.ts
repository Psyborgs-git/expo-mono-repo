import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSearchDiamondsLazyQuery } from '../src/graphql/diamonds/diamonds.generated';
import type { DiamondSearchResult } from '../src/generated/graphql';
import type { DiamondFilters } from '../components/diamond/DiamondFilters';

export interface UseSearchDiamondsOptions {
  enabled?: boolean;
}

export interface UseSearchDiamondsResult {
  searchResults: DiamondSearchResult[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filters: DiamondFilters;
  hasSearched: boolean;
  search: (query: string, searchFilters?: DiamondFilters) => void;
  updateFilters: (newFilters: DiamondFilters) => void;
  clearSearch: () => void;
}

export const useSearchDiamonds = (
  options: UseSearchDiamondsOptions = {}
): UseSearchDiamondsResult => {
  const { enabled = true } = options;
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<DiamondFilters>({});
  const [hasSearched, setHasSearched] = useState(false);

  const [searchDiamonds, { data, loading, error }] = useSearchDiamondsLazyQuery({
    errorPolicy: 'all',
  });

  // Extract search results
  const searchResults = useMemo(() => {
    return data?.searchDiamonds || [];
  }, [data]);

  // Build filter string for GraphQL query
  const buildFilterString = useCallback((query: string, searchFilters: DiamondFilters) => {
    const filterParts: string[] = [];

    // Add text query
    if (query.trim()) {
      filterParts.push(`query:"${query.trim()}"`);
    }

    // Add carat range
    if (searchFilters.minCarat !== undefined) {
      filterParts.push(`minCarat:${searchFilters.minCarat}`);
    }
    if (searchFilters.maxCarat !== undefined) {
      filterParts.push(`maxCarat:${searchFilters.maxCarat}`);
    }

    // Add price range
    if (searchFilters.minPrice !== undefined) {
      filterParts.push(`minPrice:${searchFilters.minPrice}`);
    }
    if (searchFilters.maxPrice !== undefined) {
      filterParts.push(`maxPrice:${searchFilters.maxPrice}`);
    }

    // Add shapes
    if (searchFilters.shapes && searchFilters.shapes.length > 0) {
      filterParts.push(`shapes:[${searchFilters.shapes.map(s => `"${s}"`).join(',')}]`);
    }

    // Add clarity grades
    if (searchFilters.clarityGrades && searchFilters.clarityGrades.length > 0) {
      filterParts.push(`clarityGrades:[${searchFilters.clarityGrades.map(c => `"${c}"`).join(',')}]`);
    }

    // Add color grades
    if (searchFilters.colorGrades && searchFilters.colorGrades.length > 0) {
      filterParts.push(`colorGrades:[${searchFilters.colorGrades.map(c => `"${c}"`).join(',')}]`);
    }

    // Add cut grades
    if (searchFilters.cutGrades && searchFilters.cutGrades.length > 0) {
      filterParts.push(`cutGrades:[${searchFilters.cutGrades.map(c => `"${c}"`).join(',')}]`);
    }

    return `{${filterParts.join(',')}}`;
  }, []);

  // Perform search
  const search = useCallback(async (query: string, searchFilters: DiamondFilters = {}) => {
    if (!enabled) return;

    setSearchQuery(query);
    setFilters(searchFilters);
    setHasSearched(true);

    const filterString = buildFilterString(query, searchFilters);
    
    try {
      await searchDiamonds({
        variables: {
          filters: filterString,
        },
      });
    } catch (err) {
      console.error('Search error:', err);
    }
  }, [enabled, buildFilterString, searchDiamonds]);

  // Update filters and re-search
  const updateFilters = useCallback((newFilters: DiamondFilters) => {
    if (hasSearched) {
      search(searchQuery, newFilters);
    } else {
      setFilters(newFilters);
    }
  }, [hasSearched, searchQuery, search]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setFilters({});
    setHasSearched(false);
  }, []);

  // Format error message
  const errorMessage = useMemo(() => {
    if (!error) return null;
    return error.message || 'Search failed';
  }, [error]);

  return {
    searchResults,
    loading,
    error: errorMessage,
    searchQuery,
    filters,
    hasSearched,
    search,
    updateFilters,
    clearSearch,
  };
};