import { useGetDiamondQuery } from '../src/graphql/diamonds/diamonds.generated';
import { Diamond_BasicFragment } from '../src/graphql/diamonds/diamonds.generated';

export interface UseDiamondResult {
  diamond: Diamond_BasicFragment | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDiamond = (id: string): UseDiamondResult => {
  const { data, loading, error, refetch } = useGetDiamondQuery({
    variables: { id },
    skip: !id,
    errorPolicy: 'all',
  });

  const normalizedError = error ? (
    error.graphQLErrors?.length > 0 
      ? error.graphQLErrors[0].message 
      : error.networkError 
        ? 'Network error. Please check your connection and try again'
        : 'Failed to load diamond'
  ) : null;

  return {
    diamond: data?.diamond || null,
    loading,
    error: normalizedError,
    refetch,
  };
};