import { InMemoryCache } from '@apollo/client';
import { persistCache, LocalStorageWrapper, SessionStorageWrapper } from 'apollo3-cache-persist';

export interface CachePersistenceConfig {
  cache: InMemoryCache;
  storage?: any; // AsyncStorage for React Native, localStorage for web
  maxSize?: number; // Maximum cache size in bytes (default: 1MB)
  debounce?: number; // Debounce interval in ms (default: 1000)
  trigger?: 'write' | 'background'; // When to persist (default: 'write')
}

export class CachePersistence {
  private persistor: any;
  private cache: InMemoryCache;
  private config: CachePersistenceConfig;

  constructor(config: CachePersistenceConfig) {
    this.cache = config.cache;
    this.config = {
      maxSize: 1024 * 1024, // 1MB default
      debounce: 1000, // 1 second default
      trigger: 'write',
      ...config,
    };
  }

  async initialize(): Promise<void> {
    try {
      // Set up cache persistence
      this.persistor = await persistCache({
        cache: this.cache as any,
        storage: this.getStorageWrapper(),
        maxSize: this.config.maxSize,
        debounce: this.config.debounce,
        trigger: this.config.trigger,
      });

      console.log('Cache persistence initialized');
    } catch (error) {
      console.warn('Failed to initialize cache persistence:', error);
      // Continue without persistence if it fails
    }
  }

  private getStorageWrapper() {
    if (!this.config.storage) {
      // Default to appropriate storage for environment
      if (typeof window !== 'undefined') {
        // Web environment
        return new LocalStorageWrapper(window.localStorage);
      } else {
        // React Native or Node environment
        throw new Error('Storage must be provided for non-web environments');
      }
    }

    // For React Native AsyncStorage
    if (this.config.storage.setItem && this.config.storage.getItem) {
      return this.config.storage;
    }

    // For web localStorage/sessionStorage
    if (typeof this.config.storage === 'object' && this.config.storage.localStorage) {
      return new LocalStorageWrapper(this.config.storage.localStorage);
    }

    if (typeof this.config.storage === 'object' && this.config.storage.sessionStorage) {
      return new SessionStorageWrapper(this.config.storage.sessionStorage);
    }

    return this.config.storage;
  }

  async purge(): Promise<void> {
    if (this.persistor) {
      await this.persistor.purge();
      console.log('Cache purged');
    }
  }

  async pause(): Promise<void> {
    if (this.persistor) {
      await this.persistor.pause();
      console.log('Cache persistence paused');
    }
  }

  async resume(): Promise<void> {
    if (this.persistor) {
      await this.persistor.resume();
      console.log('Cache persistence resumed');
    }
  }

  async remove(): Promise<void> {
    if (this.persistor) {
      await this.persistor.remove();
      console.log('Cache persistence removed');
    }
  }

  getSize(): number {
    if (this.persistor) {
      return this.persistor.getSize();
    }
    return 0;
  }
}

// Utility function to create cache persistence
export async function createCachePersistence(
  config: CachePersistenceConfig
): Promise<CachePersistence> {
  const persistence = new CachePersistence(config);
  await persistence.initialize();
  return persistence;
}

// Cache eviction policies
export const cacheEvictionPolicies = {
  // Evict old diamonds when cache gets too large
  evictOldDiamonds: (cache: InMemoryCache, maxAge: number = 24 * 60 * 60 * 1000) => {
    const now = Date.now();
    const cutoff = now - maxAge;

    try {
      // Get all diamonds from cache
      const diamonds = cache.extract();
      
      Object.keys(diamonds).forEach(key => {
        if (key.startsWith('Diamond:')) {
          const diamond = diamonds[key];
          if (diamond && diamond.updatedAt) {
            const updatedAt = new Date(diamond.updatedAt as string).getTime();
            if (updatedAt < cutoff) {
              cache.evict({ id: key });
            }
          }
        }
      });

      cache.gc();
      console.log('Evicted old diamonds from cache');
    } catch (error) {
      console.warn('Failed to evict old diamonds:', error);
    }
  },

  // Evict old chat messages
  evictOldMessages: (cache: InMemoryCache, maxAge: number = 7 * 24 * 60 * 60 * 1000) => {
    const now = Date.now();
    const cutoff = now - maxAge;

    try {
      const cacheData = cache.extract();
      
      Object.keys(cacheData).forEach(key => {
        if (key.startsWith('Message:')) {
          const message = cacheData[key];
          if (message && message.createdAt) {
            const createdAt = new Date(message.createdAt as string).getTime();
            if (createdAt < cutoff) {
              cache.evict({ id: key });
            }
          }
        }
      });

      cache.gc();
      console.log('Evicted old messages from cache');
    } catch (error) {
      console.warn('Failed to evict old messages:', error);
    }
  },

  // Clear all cached data
  clearAll: (cache: InMemoryCache) => {
    try {
      cache.reset();
      console.log('Cleared all cache data');
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  },

  // Clear specific entity type
  clearEntityType: (cache: InMemoryCache, entityType: string) => {
    try {
      const cacheData = cache.extract();
      
      Object.keys(cacheData).forEach(key => {
        if (key.startsWith(`${entityType}:`)) {
          cache.evict({ id: key });
        }
      });

      cache.gc();
      console.log(`Cleared ${entityType} entities from cache`);
    } catch (error) {
      console.warn(`Failed to clear ${entityType} entities:`, error);
    }
  },
};