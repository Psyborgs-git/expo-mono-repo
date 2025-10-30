import type { ApolloError } from '@apollo/client/errors';

// Error handling utilities for GraphQL operations
export interface GraphQLErrorInfo {
  message: string;
  code: string;
  path?: string[];
  details?: any;
  requestId?: string;
}

export function normalizeGraphQLError(error: ApolloError): GraphQLErrorInfo {
  const graphQLError = error.graphQLErrors[0];
  
  if (graphQLError) {
    return {
      message: graphQLError.message,
      code: graphQLError.extensions?.code || 'UNKNOWN',
      path: graphQLError.path,
      details: error.graphQLErrors,
      requestId: graphQLError.extensions?.requestId,
    };
  }
  
  return {
    message: error.message,
    code: 'NETWORK_ERROR',
  };
}

export function isAuthenticationError(error: ApolloError): boolean {
  return error.graphQLErrors.some(
    (err: any) => err.extensions?.code === 'UNAUTHENTICATED'
  );
}

export function isPermissionError(error: ApolloError): boolean {
  return error.graphQLErrors.some(
    (err: any) => err.extensions?.code === 'FORBIDDEN'
  );
}

export function isValidationError(error: ApolloError): boolean {
  return error.graphQLErrors.some(
    (err: any) => err.extensions?.code === 'BAD_USER_INPUT'
  );
}

export function isRateLimitError(error: ApolloError): boolean {
  return error.graphQLErrors.some(
    (err: any) => err.extensions?.code === 'RATE_LIMITED'
  );
}

// Pagination utilities
export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string | null;
  endCursor?: string | null;
}

export interface PaginationArgs {
  first?: number;
  last?: number;
  after?: string | null;
  before?: string | null;
}

export function createPaginationArgs(
  direction: 'forward' | 'backward',
  limit: number = 20,
  cursor?: string | null
): PaginationArgs {
  if (direction === 'forward') {
    return {
      first: limit,
      after: cursor || null,
    };
  } else {
    return {
      last: limit,
      before: cursor || null,
    };
  }
}

// Cache utilities
export function generateOptimisticId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function isOptimisticId(id: string): boolean {
  return id.startsWith('temp-');
}

// Common field policies for pagination
export const paginationFieldPolicy = {
  keyArgs: false,
  merge(existing: any, incoming: any, { args }: any) {
    if (!existing) {
      return incoming;
    }

    const merged = { ...incoming };
    
    if (args?.after) {
      // Forward pagination: append new edges
      merged.edges = [...(existing.edges || []), ...(incoming.edges || [])];
    } else if (args?.before) {
      // Backward pagination: prepend new edges
      merged.edges = [...(incoming.edges || []), ...(existing.edges || [])];
    } else {
      // Fresh query: replace edges
      merged.edges = incoming.edges || [];
    }
    
    return merged;
  },
};

// Subscription utilities
export function createSubscriptionOptions(variables: any) {
  return {
    variables,
    shouldResubscribe: true,
    errorPolicy: 'all' as const,
    fetchPolicy: 'no-cache' as const,
  };
}

// Query utilities
export function createQueryOptions(variables?: any, fetchPolicy?: string) {
  return {
    variables,
    fetchPolicy: (fetchPolicy || 'cache-first') as any,
    errorPolicy: 'all' as const,
    notifyOnNetworkStatusChange: true,
  };
}

// Mutation utilities
export function createMutationOptions(
  optimisticResponse?: any,
  update?: any,
  refetchQueries?: any[]
) {
  return {
    optimisticResponse,
    update,
    refetchQueries,
    errorPolicy: 'all' as const,
    awaitRefetchQueries: true,
  };
}