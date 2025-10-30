import { useState, useCallback } from 'react';
// Minimal local definition for SearchSuggestion used by this hook
export interface SearchSuggestion {
  id: string;
  text: string;
  metadata?: Record<string, any> | null;
}
import type { SearchHistoryItem, SavedSearchItem, SearchAnalytics } from './useSearchHistory';
import type { DiamondFilters } from '../components/diamond/DiamondFilters';

// Suggestion categories
export type SuggestionCategory = 'history' | 'saved' | 'popular' | 'filter' | 'autocomplete';

// Enhanced search suggestion
export interface EnhancedSearchSuggestion extends SearchSuggestion {
  category: SuggestionCategory;
  filters?: DiamondFilters;
  resultCount?: number;
  lastUsed?: number;
  popularity?: number;
}

export interface UseSearchSuggestionsOptions {
  maxSuggestions?: number;
  includeHistory?: boolean;
  includeSaved?: boolean;
  includePopular?: boolean;
  includeFilters?: boolean;
  debounceMs?: number;
}

export interface UseSearchSuggestionsResult {
  suggestions: EnhancedSearchSuggestion[];
  loading: boolean;
  getSuggestions: (query: string) => EnhancedSearchSuggestion[];
  clearSuggestions: () => void;
}

// Common diamond-related search terms
const COMMON_DIAMOND_TERMS = [
  'round diamond',
  'princess cut',
  'cushion cut',
  'emerald cut',
  'oval diamond',
  'brilliant cut',
  'solitaire',
  'engagement ring',
  'wedding band',
  'certified diamond',
  'GIA certified',
  'natural diamond',
  'lab grown',
  'colorless',
  'near colorless',
  'eye clean',
  'excellent cut',
  'ideal cut',
  'very good',
  'flawless',
  'internally flawless',
  'VVS1',
  'VVS2',
  'VS1',
  'VS2',
  'SI1',
  'SI2',
  'D color',
  'E color',
  'F color',
  'G color',
  'H color',
  'I color',
  'J color',
  '1 carat',
  '2 carat',
  '0.5 carat',
  '1.5 carat',
  'half carat',
  'one carat',
  'two carat',
  'under $5000',
  'under $10000',
  'budget diamond',
  'luxury diamond',
  'investment diamond',
];

// Filter-based suggestions
const FILTER_SUGGESTIONS = [
  { text: 'Round diamonds under $5000', filters: { shapes: ['ROUND'], maxPrice: 5000 } },
  { text: 'Princess cut 1+ carat', filters: { shapes: ['PRINCESS'], minCarat: 1 } },
  { text: 'Colorless diamonds (D-F)', filters: { colorGrades: ['D', 'E', 'F'] } },
  { text: 'Eye clean diamonds (VS+)', filters: { clarityGrades: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2'] } },
  { text: 'Excellent cut quality', filters: { cutGrades: ['EXCELLENT', 'IDEAL'] } },
  { text: 'Large diamonds (2+ carat)', filters: { minCarat: 2 } },
  { text: 'Budget friendly (under $3000)', filters: { maxPrice: 3000 } },
  { text: 'Premium diamonds ($10000+)', filters: { minPrice: 10000 } },
];

// Generate suggestions from search history
const generateHistorySuggestions = (
  history: SearchHistoryItem[],
  query: string,
  maxSuggestions: number
): EnhancedSearchSuggestion[] => {
  return history
    .filter(item => 
      item.query.toLowerCase().includes(query.toLowerCase()) ||
      query.length === 0
    )
    .slice(0, maxSuggestions)
    .map(item => ({
      id: `history_${item.id}`,
      text: item.query,
      category: 'history' as SuggestionCategory,
      filters: item.filters,
      resultCount: item.resultCount || undefined,
      lastUsed: item.timestamp,
      metadata: { timestamp: item.timestamp },
    }));
};

// Generate suggestions from saved searches
const generateSavedSuggestions = (
  saved: SavedSearchItem[],
  query: string,
  maxSuggestions: number
): EnhancedSearchSuggestion[] => {
  return saved
    .filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.query.toLowerCase().includes(query.toLowerCase()) ||
      query.length === 0
    )
    .slice(0, maxSuggestions)
    .map(item => ({
      id: `saved_${item.id}`,
      text: item.name,
      category: 'saved' as SuggestionCategory,
      filters: item.filters,
      resultCount: item.resultCount || undefined,
      lastUsed: item.lastUsed || undefined,
      metadata: { 
        originalQuery: item.query,
        createdAt: item.createdAt,
        alertEnabled: item.alertEnabled,
      },
    }));
};

// Generate suggestions from popular queries
const generatePopularSuggestions = (
  analytics: SearchAnalytics,
  query: string,
  maxSuggestions: number
): EnhancedSearchSuggestion[] => {
  return analytics.popularQueries
    .filter(item => 
      item.query.toLowerCase().includes(query.toLowerCase()) ||
      query.length === 0
    )
    .slice(0, maxSuggestions)
    .map(item => ({
      id: `popular_${item.query}`,
      text: item.query,
      category: 'popular' as SuggestionCategory,
      popularity: item.count,
      metadata: { count: item.count },
    }));
};

// Generate filter-based suggestions
const generateFilterSuggestions = (
  query: string,
  maxSuggestions: number
): EnhancedSearchSuggestion[] => {
  return FILTER_SUGGESTIONS
    .filter(item => 
      item.text.toLowerCase().includes(query.toLowerCase()) ||
      query.length === 0
    )
    .slice(0, maxSuggestions)
    .map((item, index) => ({
      id: `filter_${index}`,
      text: item.text,
      category: 'filter' as SuggestionCategory,
      filters: item.filters,
    }));
};

// Generate autocomplete suggestions
const generateAutocompleteSuggestions = (
  query: string,
  maxSuggestions: number
): EnhancedSearchSuggestion[] => {
  if (query.length < 2) return [];

  return COMMON_DIAMOND_TERMS
    .filter(term => 
      term.toLowerCase().includes(query.toLowerCase()) &&
      term.toLowerCase() !== query.toLowerCase()
    )
    .slice(0, maxSuggestions)
    .map((term, index) => ({
      id: `autocomplete_${index}`,
      text: term,
      category: 'autocomplete' as SuggestionCategory,
    }));
};

export const useSearchSuggestions = (
  searchHistory: SearchHistoryItem[],
  savedSearches: SavedSearchItem[],
  analytics: SearchAnalytics,
  options: UseSearchSuggestionsOptions = {}
): UseSearchSuggestionsResult => {
  const {
    maxSuggestions = 10,
    includeHistory = true,
    includeSaved = true,
    includePopular = true,
    includeFilters = true,
    debounceMs = 300,
  } = options;

  const [suggestions, setSuggestions] = useState<EnhancedSearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate suggestions for a query
  const getSuggestions = useCallback((query: string): EnhancedSearchSuggestion[] => {
    const allSuggestions: EnhancedSearchSuggestion[] = [];
    const perCategoryLimit = Math.ceil(maxSuggestions / 4);

    // Add history suggestions
    if (includeHistory) {
      const historySuggestions = generateHistorySuggestions(
        searchHistory,
        query,
        perCategoryLimit
      );
      allSuggestions.push(...historySuggestions);
    }

    // Add saved search suggestions
    if (includeSaved) {
      const savedSuggestions = generateSavedSuggestions(
        savedSearches,
        query,
        perCategoryLimit
      );
      allSuggestions.push(...savedSuggestions);
    }

    // Add popular query suggestions
    if (includePopular) {
      const popularSuggestions = generatePopularSuggestions(
        analytics,
        query,
        perCategoryLimit
      );
      allSuggestions.push(...popularSuggestions);
    }

    // Add filter-based suggestions
    if (includeFilters) {
      const filterSuggestions = generateFilterSuggestions(
        query,
        perCategoryLimit
      );
      allSuggestions.push(...filterSuggestions);
    }

    // Add autocomplete suggestions
    const autocompleteSuggestions = generateAutocompleteSuggestions(
      query,
      perCategoryLimit
    );
    allSuggestions.push(...autocompleteSuggestions);

    // Sort suggestions by relevance
    const sortedSuggestions = allSuggestions
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.text.toLowerCase() === query.toLowerCase() ? 1 : 0;
        const bExact = b.text.toLowerCase() === query.toLowerCase() ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;

        // Prioritize starts with query
        const aStarts = a.text.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
        const bStarts = b.text.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
        if (aStarts !== bStarts) return bStarts - aStarts;

        // Prioritize by category (saved > history > popular > filter > autocomplete)
        const categoryPriority = {
          saved: 5,
          history: 4,
          popular: 3,
          filter: 2,
          autocomplete: 1,
        };
        const aPriority = categoryPriority[a.category] || 0;
        const bPriority = categoryPriority[b.category] || 0;
        if (aPriority !== bPriority) return bPriority - aPriority;

        // Sort by recency for history/saved
        if (a.category === 'history' || a.category === 'saved') {
          const aTime = a.lastUsed || 0;
          const bTime = b.lastUsed || 0;
          return bTime - aTime;
        }

        // Sort by popularity for popular queries
        if (a.category === 'popular') {
          const aPopularity = a.popularity || 0;
          const bPopularity = b.popularity || 0;
          return bPopularity - aPopularity;
        }

        return 0;
      })
      .slice(0, maxSuggestions);

    return sortedSuggestions;
  }, [
    searchHistory,
    savedSearches,
    analytics,
    maxSuggestions,
    includeHistory,
    includeSaved,
    includePopular,
    includeFilters,
  ]);



  // Clear suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    loading,
    getSuggestions,
    clearSuggestions,
  };
};