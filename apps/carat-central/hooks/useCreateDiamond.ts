import { useState, useCallback } from 'react';
import { useCreateDiamondMutation } from '../src/graphql/diamonds/diamonds.generated';
import { CreateDiamondInput } from '../src/generated/graphql';

export interface UseCreateDiamondResult {
  createDiamond: (input: CreateDiamondInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export const useCreateDiamond = (): UseCreateDiamondResult => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [createDiamondMutation, { loading }] = useCreateDiamondMutation({
    onCompleted: () => {
      setSuccess(true);
      setError(null);
    },
    onError: (apolloError) => {
      console.error('Create diamond error:', apolloError);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to create diamond';
      
      if (apolloError.graphQLErrors?.length > 0) {
        const graphQLError = apolloError.graphQLErrors[0];
        errorMessage = graphQLError.message;
        
        // Handle specific error codes
        if (graphQLError.extensions?.code === 'DUPLICATE_STOCK_NUMBER') {
          errorMessage = 'A diamond with this stock number already exists';
        } else if (graphQLError.extensions?.code === 'VALIDATION_ERROR') {
          errorMessage = 'Please check your input and try again';
        } else if (graphQLError.extensions?.code === 'UNAUTHORIZED') {
          errorMessage = 'You do not have permission to create diamonds';
        }
      } else if (apolloError.networkError) {
        errorMessage = 'Network error. Please check your connection and try again';
      }
      
      setError(errorMessage);
      setSuccess(false);
    },
    // Update the cache to include the new diamond
    update: (cache, { data }) => {
      if (data?.createDiamond) {
        // Invalidate the diamonds query to refetch the list
        cache.evict({ fieldName: 'diamonds' });
        cache.gc();
      }
    },
  });

  const createDiamond = useCallback(async (input: CreateDiamondInput) => {
    setError(null);
    setSuccess(false);
    
    // Validate input before sending
    if (!input.stockNumber?.trim()) {
      setError('Stock number is required');
      return;
    }
    
    if (!input.carat || input.carat <= 0) {
      setError('Carat must be greater than 0');
      return;
    }
    
    if (!input.pricePerCarat || input.pricePerCarat <= 0) {
      setError('Price per carat must be greater than 0');
      return;
    }
    
    try {
      await createDiamondMutation({
        variables: { input },
      });
    } catch (error) {
      // Error is handled by the onError callback
      console.error('Create diamond mutation error:', error);
    }
  }, [createDiamondMutation]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    createDiamond,
    loading,
    error,
    success,
    reset,
  };
};