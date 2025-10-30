import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  split,
  type TypePolicies,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { AuthManager } from './auth/auth-manager';
import type { NetworkConfig } from './types';

export interface ApolloClientConfig extends NetworkConfig {
  authManager?: AuthManager;
  websocketEndpoint?: string;
  getOrgId?: () => string | undefined;
  enablePersistence?: boolean;
  storage?: any; // AsyncStorage or similar
}

export function createApolloClient(config: ApolloClientConfig) {
  const {
    graphqlEndpoint,
    websocketEndpoint,
    authManager,
    getOrgId,
    enableCache = true,
    enablePersistence = false,
    storage,
    headers = {},
  } = config;

  // HTTP Link
  const httpLink = new HttpLink({
    uri: graphqlEndpoint,
  });

  // WebSocket Link for subscriptions
  const wsLink = websocketEndpoint ? new GraphQLWsLink(createClient({
    url: websocketEndpoint,
    connectionParams: async () => {
      const tokens = authManager ? await authManager.getTokens() : null;
      const orgId = getOrgId ? getOrgId() : undefined;
      
      return {
        ...(tokens?.accessToken && {
          authorization: `Bearer ${tokens.accessToken}`,
        }),
        ...(orgId && {
          'org-id': orgId,
        }),
      };
    },
  })) : null;

  // Auth Link - adds authorization and org-id headers
  const authLink = setContext(async (_, { headers: contextHeaders }) => {
    const tokens = authManager ? await authManager.getTokens() : null;
    const orgId = getOrgId ? getOrgId() : undefined;

    return {
      headers: {
        ...headers,
        ...contextHeaders,
        ...(tokens?.accessToken && {
          authorization: `Bearer ${tokens.accessToken}`,
        }),
        ...(orgId && {
          'org-id': orgId,
        }),
      },
    };
  });

  // Enhanced Error Link - handles GraphQL error codes and token refresh
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        const errorCode = err.extensions?.code;
        
        // Handle authentication errors
        if (errorCode === 'UNAUTHENTICATED' && authManager) {
          return authManager.refreshTokens().then(async (success: boolean) => {
            if (success) {
              // Retry the failed request with new tokens
              const tokens = await authManager.getTokens();
              const orgId = getOrgId ? getOrgId() : undefined;
              const oldHeaders = operation.getContext().headers;
              
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  authorization: `Bearer ${tokens?.accessToken}`,
                  ...(orgId && { 'org-id': orgId }),
                },
              });
              return forward(operation);
            }
            // If refresh failed, clear auth and don't retry
            authManager.clearAuth();
            return;
          });
        }
        
        // Handle permission errors
        if (errorCode === 'FORBIDDEN') {
          console.warn(`[Permission error]: ${err.message}`);
        }
        
        // Handle validation errors
        if (errorCode === 'BAD_USER_INPUT') {
          console.warn(`[Validation error]: ${err.message}`);
        }
        
        // Handle rate limiting
        if (errorCode === 'RATE_LIMITED') {
          console.warn(`[Rate limit error]: ${err.message}`);
        }
      }
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
      
      // Handle specific network error codes
      if ('statusCode' in networkError) {
        switch (networkError.statusCode) {
          case 401:
            console.warn('[Network]: Unauthorized - token may be expired');
            break;
          case 403:
            console.warn('[Network]: Forbidden - insufficient permissions');
            break;
          case 429:
            console.warn('[Network]: Rate limited');
            break;
          case 500:
            console.error('[Network]: Internal server error');
            break;
        }
      }
    }
  });

  // Split link for HTTP and WebSocket
  const splitLink = wsLink ? split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    from([errorLink, authLink, httpLink])
  ) : from([errorLink, authLink, httpLink]);

  // Enhanced cache with comprehensive type policies
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          diamonds: {
            keyArgs: false,
            merge(existing, incoming, { args }) {
              if (!existing) {
                return incoming;
              }

              const merged = { ...incoming };
              
              if (args?.after) {
                // Pagination: append new edges
                merged.edges = [...(existing.edges || []), ...(incoming.edges || [])];
              } else {
                // Fresh query: replace edges
                merged.edges = incoming.edges || [];
              }
              
              return merged;
            },
          },
          publicDiamonds: {
            keyArgs: false,
            merge(existing, incoming, { args }) {
              if (!existing) {
                return incoming;
              }

              const merged = { ...incoming };
              
              if (args?.after) {
                // Pagination: append new edges
                merged.edges = [...(existing.edges || []), ...(incoming.edges || [])];
              } else {
                // Fresh query: replace edges
                merged.edges = incoming.edges || [];
              }
              
              return merged;
            },
          },
          chatMessages: {
            keyArgs: ['chatId'],
            merge(existing = [], incoming, { args }) {
              if (args?.cursor) {
                // Load more messages: prepend to existing (older messages)
                return [...incoming, ...existing];
              } else {
                // Fresh load: replace all
                return incoming;
              }
            },
          },
          myChats: {
            merge(existing = [], incoming) {
              // Always replace with fresh data for chat list
              return incoming;
            },
          },
          myOrders: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          myRequests: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          myOrgRequests: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          publicRequests: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          findSimilarDiamonds: {
            keyArgs: ['diamondId'],
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          searchDiamonds: {
            keyArgs: ['filters'],
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
      Diamond: {
        keyFields: ['id'],
      },
      Chat: {
        keyFields: ['id'],
        fields: {
          messages: {
            merge(existing = [], incoming) {
              // Merge messages by ID to avoid duplicates
              const existingIds = new Set(existing.map((msg: any) => msg.id));
              const newMessages = incoming.filter((msg: any) => !existingIds.has(msg.id));
              return [...existing, ...newMessages].sort(
                (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );
            },
          },
        },
      },
      Message: {
        keyFields: ['id'],
      },
      Order: {
        keyFields: ['id'],
      },
      DiamondRequest: {
        keyFields: ['id'],
      },
      RequestResponse: {
        keyFields: ['id'],
      },
      Organization: {
        keyFields: ['id'],
      },
      User: {
        keyFields: ['id'],
      },
      CaratUserType: {
        keyFields: ['id'],
      },
      UserBasic: {
        keyFields: ['id'],
      },
      UserBasicInfo: {
        keyFields: ['id'],
      },
      OrganizationBasic: {
        keyFields: ['id'],
      },
      OrgBasicInfo: {
        keyFields: ['id'],
      },
    },
  });

  const client = new ApolloClient({
    link: splitLink,
    cache,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });

  // Set up cache persistence if enabled
  if (enablePersistence && storage) {
    setupCachePersistence(cache, storage).catch(error => {
      console.warn('Failed to setup cache persistence:', error);
    });
  }

  return client;
}

// Utility function to setup cache persistence
async function setupCachePersistence(cache: InMemoryCache, storage: any) {
  try {
    const { persistCache } = await import('apollo3-cache-persist');
    
    await persistCache({
      cache,
      storage,
      maxSize: 1024 * 1024, // 1MB
      debounce: 1000, // 1 second
      trigger: 'write',
    });

    console.log('Cache persistence initialized');
  } catch (error) {
    console.warn('Cache persistence setup failed:', error);
  }
}
