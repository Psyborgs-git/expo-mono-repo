// Mock authentication hook
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { User } from '../lib/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Mock authentication hook
 * In production, this would integrate with the real auth system
 */
export function useMockAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Get current user from mock API
      const user = await api.getCurrentUser();
      
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const refreshUser = async (): Promise<void> => {
    if (!authState.isAuthenticated) return;
    
    try {
      const user = await api.getCurrentUser();
      setAuthState((prev) => ({
        ...prev,
        user,
      }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  // Auto-login on mount (for demo purposes)
  useEffect(() => {
    const autoLogin = async () => {
      try {
        const user = await api.getCurrentUser();
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    autoLogin();
  }, []);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    login,
    logout,
    refreshUser,
  };
}
