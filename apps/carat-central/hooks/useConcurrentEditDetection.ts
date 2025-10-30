import { useState, useEffect, useCallback } from 'react';
import { Diamond_BasicFragment } from '../src/graphql/diamonds/diamonds.generated';

export interface ConcurrentEditState {
  hasConflict: boolean;
  lastKnownUpdate: string | null;
  currentUpdate: string | null;
}

export interface UseConcurrentEditDetectionResult {
  conflictState: ConcurrentEditState;
  checkForConflicts: (currentDiamond: Diamond_BasicFragment) => boolean;
  resolveConflict: () => void;
  updateLastKnown: (diamond: Diamond_BasicFragment) => void;
}

export const useConcurrentEditDetection = (
  initialDiamond: Diamond_BasicFragment
): UseConcurrentEditDetectionResult => {
  const [conflictState, setConflictState] = useState<ConcurrentEditState>({
    hasConflict: false,
    lastKnownUpdate: initialDiamond.updatedAt,
    currentUpdate: initialDiamond.updatedAt,
  });

  // Check for conflicts by comparing updatedAt timestamps
  const checkForConflicts = useCallback((currentDiamond: Diamond_BasicFragment): boolean => {
    const hasConflict = currentDiamond.updatedAt !== conflictState.lastKnownUpdate;
    
    if (hasConflict) {
      setConflictState(prev => ({
        ...prev,
        hasConflict: true,
        currentUpdate: currentDiamond.updatedAt,
      }));
    }
    
    return hasConflict;
  }, [conflictState.lastKnownUpdate]);

  // Resolve conflict by updating the last known timestamp
  const resolveConflict = useCallback(() => {
    setConflictState(prev => ({
      hasConflict: false,
      lastKnownUpdate: prev.currentUpdate,
      currentUpdate: prev.currentUpdate,
    }));
  }, []);

  // Update the last known timestamp (called after successful updates)
  const updateLastKnown = useCallback((diamond: Diamond_BasicFragment) => {
    setConflictState(prev => ({
      ...prev,
      lastKnownUpdate: diamond.updatedAt,
      currentUpdate: diamond.updatedAt,
      hasConflict: false,
    }));
  }, []);

  return {
    conflictState,
    checkForConflicts,
    resolveConflict,
    updateLastKnown,
  };
};