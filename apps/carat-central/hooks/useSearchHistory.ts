import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DiamondFilters } from '../components/diamond/DiamondFilters';

// Storage keys
const SEARCH_HISTORY_KEY = '@carat_central:search_history';
const SAVED_SEARCHES_KEY = '@carat_central:saved_searches';

// Search history item
export interface SearchHistoryItem {
  id: string;
  query: string;
  filters: DiamondFilters;
  timestamp: number;
  resultCount?: number;
}

// Saved search item
export interface SavedSearchItem {
  id: string;
  name: string;
  query: string;
  filters: DiamondFilters;
  createdAt: number;
  lastUsed?: number;
  alertEnabled?: boolean;
  resultCount?: number;
}

// Search analytics
export interface SearchAnalytics {
  totalSearches: number;
  popularQueries: Array<{ query: string; count: number }>;
  popularFilters: Array<{ filter: string; count: number }>;
  averageResultCount: number;
}

export interface UseSearchHistoryResult {
  // Search history
  searchHistory: SearchHistoryItem[];
  addToHistory: (query: string, filters: DiamondFilters, resultCount?: number) => Promise<void>;
  clearHistory: () => Promise<void>;
  removeFromHistory: (id: string) => Promise<void>;
  
  // Saved searches
  savedSearches: SavedSearchItem[];
  saveSearch: (name: string, query: string, filters: DiamondFilters) => Promise<void>;
  updateSavedSearch: (id: string, updates: Partial<SavedSearchItem>) => Promise<void>;
  deleteSavedSearch: (id: string) => Promise<void>;
  useSavedSearch: (id: string) => Promise<SavedSearchItem | null>;
  
  // Analytics
  analytics: SearchAnalytics;
  
  // Loading state
  loading: boolean;
  error: string | null;
}

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Load data from storage
const loadFromStorage = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultValue;
  }
};

// Save data to storage
const saveToStorage = async <T>(key: string, data: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
};

// Calculate analytics
const calculateAnalytics = (history: SearchHistoryItem[]): SearchAnalytics => {
  const queryCount: Record<string, number> = {};
  const filterCount: Record<string, number> = {};
  let totalResultCount = 0;
  let validResultCount = 0;

  history.forEach((item) => {
    // Count queries
    if (item.query.trim()) {
      queryCount[item.query] = (queryCount[item.query] || 0) + 1;
    }

    // Count filters
    Object.entries(item.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value) && value.length > 0) {
          filterCount[key] = (filterCount[key] || 0) + 1;
        } else if (!Array.isArray(value)) {
          filterCount[key] = (filterCount[key] || 0) + 1;
        }
      }
    });

    // Count results
    if (item.resultCount !== undefined) {
      totalResultCount += item.resultCount;
      validResultCount++;
    }
  });

  // Sort and limit popular queries
  const popularQueries = Object.entries(queryCount)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Sort and limit popular filters
  const popularFilters = Object.entries(filterCount)
    .map(([filter, count]) => ({ filter, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalSearches: history.length,
    popularQueries,
    popularFilters,
    averageResultCount: validResultCount > 0 ? totalResultCount / validResultCount : 0,
  };
};

export const useSearchHistory = (): UseSearchHistoryResult => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([]);
  const [analytics, setAnalytics] = useState<SearchAnalytics>({
    totalSearches: 0,
    popularQueries: [],
    popularFilters: [],
    averageResultCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [historyData, savedData] = await Promise.all([
          loadFromStorage<SearchHistoryItem[]>(SEARCH_HISTORY_KEY, []),
          loadFromStorage<SavedSearchItem[]>(SAVED_SEARCHES_KEY, []),
        ]);

        setSearchHistory(historyData);
        setSavedSearches(savedData);
        setAnalytics(calculateAnalytics(historyData));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load search data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Add to search history
  const addToHistory = useCallback(async (
    query: string, 
    filters: DiamondFilters, 
    resultCount?: number
  ) => {
    try {
      const newItem: SearchHistoryItem = {
        id: generateId(),
        query: query.trim(),
        filters,
        timestamp: Date.now(),
        resultCount,
      };

      const updatedHistory = [newItem, ...searchHistory]
        .slice(0, 100); // Keep only last 100 searches

      setSearchHistory(updatedHistory);
      setAnalytics(calculateAnalytics(updatedHistory));
      await saveToStorage(SEARCH_HISTORY_KEY, updatedHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to history');
    }
  }, [searchHistory]);

  // Clear search history
  const clearHistory = useCallback(async () => {
    try {
      setSearchHistory([]);
      setAnalytics({
        totalSearches: 0,
        popularQueries: [],
        popularFilters: [],
        averageResultCount: 0,
      });
      await saveToStorage(SEARCH_HISTORY_KEY, []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear history');
    }
  }, []);

  // Remove from search history
  const removeFromHistory = useCallback(async (id: string) => {
    try {
      const updatedHistory = searchHistory.filter(item => item.id !== id);
      setSearchHistory(updatedHistory);
      setAnalytics(calculateAnalytics(updatedHistory));
      await saveToStorage(SEARCH_HISTORY_KEY, updatedHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from history');
    }
  }, [searchHistory]);

  // Save search
  const saveSearch = useCallback(async (
    name: string, 
    query: string, 
    filters: DiamondFilters
  ) => {
    try {
      const newSavedSearch: SavedSearchItem = {
        id: generateId(),
        name: name.trim(),
        query: query.trim(),
        filters,
        createdAt: Date.now(),
        alertEnabled: false,
      };

      const updatedSaved = [newSavedSearch, ...savedSearches];
      setSavedSearches(updatedSaved);
      await saveToStorage(SAVED_SEARCHES_KEY, updatedSaved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save search');
    }
  }, [savedSearches]);

  // Update saved search
  const updateSavedSearch = useCallback(async (
    id: string, 
    updates: Partial<SavedSearchItem>
  ) => {
    try {
      const updatedSaved = savedSearches.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      setSavedSearches(updatedSaved);
      await saveToStorage(SAVED_SEARCHES_KEY, updatedSaved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update saved search');
    }
  }, [savedSearches]);

  // Delete saved search
  const deleteSavedSearch = useCallback(async (id: string) => {
    try {
      const updatedSaved = savedSearches.filter(item => item.id !== id);
      setSavedSearches(updatedSaved);
      await saveToStorage(SAVED_SEARCHES_KEY, updatedSaved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete saved search');
    }
  }, [savedSearches]);

  // Use saved search
  const useSavedSearch = useCallback(async (id: string): Promise<SavedSearchItem | null> => {
    try {
      const savedSearch = savedSearches.find(item => item.id === id);
      if (!savedSearch) return null;

      // Update last used timestamp
      await updateSavedSearch(id, { lastUsed: Date.now() });
      
      return savedSearch;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to use saved search');
      return null;
    }
  }, [savedSearches, updateSavedSearch]);

  return {
    // Search history
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
    
    // Saved searches
    savedSearches,
    saveSearch,
    updateSavedSearch,
    deleteSavedSearch,
    useSavedSearch,
    
    // Analytics
    analytics,
    
    // Loading state
    loading,
    error,
  };
};