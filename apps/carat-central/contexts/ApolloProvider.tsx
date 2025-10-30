import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import {
  ApolloProvider as BaseApolloProvider,
  ApolloClient,
} from '@apollo/client';
import { createApolloClient } from '@bdt/network/src/apollo-client';
import { useAuth } from './AuthContext';

interface ApolloContextType {
  client: ApolloClient<any>;
}

const ApolloContext = createContext<ApolloContextType | null>(null);

interface ApolloProviderProps {
  children: ReactNode;
  graphqlEndpoint: string;
  websocketEndpoint?: string;
}

export function ApolloProvider({
  children,
  graphqlEndpoint,
  websocketEndpoint,
}: ApolloProviderProps) {
  const { authManager, organization } = useAuth();

  const client = useMemo(() => {
    return createApolloClient({
      graphqlEndpoint,
      websocketEndpoint,
      authManager,
      getOrgId: () => organization?.id,
      enableCache: true,
      enablePersistence: true,
    });
  }, [graphqlEndpoint, websocketEndpoint, authManager, organization?.id]);

  const contextValue: ApolloContextType = {
    client,
  };

  return (
    <ApolloContext.Provider value={contextValue}>
      <BaseApolloProvider client={client}>{children}</BaseApolloProvider>
    </ApolloContext.Provider>
  );
}

export function useApolloClient(): ApolloContextType {
  const context = useContext(ApolloContext);
  if (!context) {
    throw new Error('useApolloClient must be used within an ApolloProvider');
  }
  return context;
}
