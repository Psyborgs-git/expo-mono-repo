import { useState, useCallback } from 'react';
import { useUpdateDiamondMutation } from '../src/graphql/diamonds/diamonds.generated';
import { UpdateDiamondInput } from '../src/generated/graphql';

export interface UseUpdateDiamondResult {
  updateDiamond: (id: string, input: UpdateDiamondInput) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
  reset: () => void;
}

export const useUpdateDiamond = (): UseUpdateDiamondResult => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [updateDiamondMutation, { loading }] = useUpdateDiamondMutation({
    onCompleted: () => {
      setSuccess(true);
      setError(null);
    },
    onError: (apolloError) => {
      console.error('Update diamond error:', apolloError);
      
      // Extract meaningful error message
      let errorMessage = 'Failed to update diamond';
      
      if (apolloError.graphQLErrors?.length > 0) {
        const graphQLError = apolloError.graphQLErrors[0];
        errorMessage = graphQLError.message;
        
        // Handle specific error codes
        if (graphQLError.extensions?.code === 'NOT_FOUND') {
          errorMessage = 'Diamond not found';
        } else if (graphQLError.extensions?.code === 'VALIDATION_ERROR') {
          errorMessage = 'Please check your input and try again';
        } else if (graphQLError.extensions?.code === 'UNAUTHORIZED') {
          errorMessage = 'You do not have permission to edit this diamond';
        } else if (graphQLError.extensions?.code === 'FORBIDDEN') {
          errorMessage = 'You cannot edit this diamond';
        }
      } else if (apolloError.networkError) {
        errorMessage = 'Network error. Please check your connection and try again';
      }
      
      setError(errorMessage);
      setSuccess(false);
    },
    // Update the cache with the updated diamond
    update: (cache, { data }) => {
      if (data?.updateDiamond) {
        // The cache will automatically update due to the normalized cache
        // and the diamond ID being the same
      }
    },
  });

  const updateDiamond = useCallback(async (id: string, input: UpdateDiamondInput) => {
    setError(null);
    setSuccess(false);
    
    // Validate input before sending
    if (input.pricePerCarat !== undefined && input.pricePerCarat <= 0) {
      setError('Price per carat must be greater than 0');
      return;
    }
    
    if (input.totalPrice !== undefined && input.totalPrice <= 0) {
      setError('Total price must be greater than 0');
      return;
    }
    
    try {
      await updateDiamondMutation({
        variables: { id, input },
      });
    } catch (error) {
      // Error is handled by the onError callback
      console.error('Update diamond mutation error:', error);
    }
  }, [updateDiamondMutation]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return {
    updateDiamond,
    loading,
    error,
    success,
    reset,
  };
};