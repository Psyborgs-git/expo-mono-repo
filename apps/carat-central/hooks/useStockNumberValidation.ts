import { useState, useCallback } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

// Query to check if stock number exists
// Note: This is a simplified version - in a real implementation,
// the backend would provide a specific endpoint for stock number validation
const CHECK_STOCK_NUMBER = gql`
  query CheckStockNumber {
    diamonds(first: 100) {
      edges {
        node {
          stockNumber
        }
      }
    }
  }
`;

export interface UseStockNumberValidationResult {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
  checkStockNumber: (stockNumber: string) => void;
  reset: () => void;
}

export const useStockNumberValidation = (): UseStockNumberValidationResult => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [checkStockNumberQuery, { loading: isChecking }] = useLazyQuery(CHECK_STOCK_NUMBER, {
    onCompleted: (data: any) => {
      // Check if any diamond has the same stock number
      const stockNumbers = data?.diamonds?.edges?.map((edge: any) => edge.node.stockNumber) || [];
      const exists = stockNumbers.includes(currentStockNumber);
      setIsAvailable(!exists);
      setError(null);
    },
    onError: (apolloError: any) => {
      console.error('Stock number validation error:', apolloError);
      setError('Failed to validate stock number');
      setIsAvailable(null);
    },
    fetchPolicy: 'network-only', // Always check with server
  });

  // Keep track of the current stock number being checked
  const [currentStockNumber, setCurrentStockNumber] = useState<string>('');

  const checkStockNumber = useCallback((stockNumber: string) => {
    if (!stockNumber?.trim()) {
      setIsAvailable(null);
      setError(null);
      return;
    }

    if (stockNumber.length < 3) {
      setIsAvailable(false);
      setError('Stock number must be at least 3 characters');
      return;
    }

    setError(null);
    setCurrentStockNumber(stockNumber.trim());
    checkStockNumberQuery();
  }, [checkStockNumberQuery]);

  const reset = useCallback(() => {
    setIsAvailable(null);
    setError(null);
  }, []);

  return {
    isChecking,
    isAvailable,
    error,
    checkStockNumber,
    reset,
  };
};