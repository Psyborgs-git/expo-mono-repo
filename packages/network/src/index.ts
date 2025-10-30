// Network package - GraphQL client with auth, caching, and interceptors
export { createApolloClient, type ApolloClientConfig } from './apollo-client';
export { AuthManager, type AuthConfig, type Organization } from './auth/auth-manager';
export { CacheManager } from './cache/cache-manager';
export { CachePersistence, createCachePersistence, cacheEvictionPolicies } from './cache/cache-persistence';
export { optimisticResponses, cacheUpdates } from './cache/cache-policies';
export { useAuth } from './auth/use-auth';
export * from './types';
