import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { AuthManager, type Organization } from '@bdt/network';
import type { AuthState } from '@bdt/network';

interface AuthContextType extends AuthState {
  authManager: AuthManager;
  requestEmailOTP: (
    email: string
  ) => Promise<{ message: string; otpId: string }>;
  requestMobileOTP: (
    mobile: string,
    countryCode?: string
  ) => Promise<{ message: string; otpId: string }>;
  verifyEmailOTP: (email: string, otp: string) => Promise<void>;
  verifyMobileOTP: (
    mobile: string,
    otp: string,
    countryCode?: string
  ) => Promise<void>;
  fetchOrganizations: () => Promise<Organization[]>;
  selectOrganization: (organization: Organization) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  graphqlEndpoint: string;
}

export function AuthProvider({ children, graphqlEndpoint }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    tokens: null,
    user: null,
    organization: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authManager] = useState(
    () =>
      new AuthManager({
        graphqlEndpoint,
        onAuthStateChange: state => {
          setAuthState(state);
          setIsLoading(false);
        },
      })
  );

  useEffect(() => {
    // Initial load will trigger onAuthStateChange
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  const requestEmailOTP = async (email: string) => {
    try {
      setError(null);
      setIsLoading(true);
      return await authManager.requestEmailOTP(email);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to request OTP';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const requestMobileOTP = async (mobile: string, countryCode = '1') => {
    try {
      setError(null);
      setIsLoading(true);
      return await authManager.requestMobileOTP(mobile, countryCode);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to request OTP';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailOTP = async (email: string, otp: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await authManager.verifyEmailOTP(email, otp);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to verify OTP';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMobileOTP = async (
    mobile: string,
    otp: string,
    countryCode = '1'
  ) => {
    try {
      setError(null);
      setIsLoading(true);
      await authManager.verifyMobileOTP(mobile, otp, countryCode);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to verify OTP';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrganizations = async (): Promise<Organization[]> => {
    try {
      setError(null);
      return await authManager.fetchUserOrganizations();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch organizations';
      setError(errorMessage);
      throw err;
    }
  };

  const selectOrganization = async (organization: Organization) => {
    try {
      setError(null);
      await authManager.setOrganization(organization);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to select organization';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authManager.logout();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to logout';
      setError(errorMessage);
      throw err;
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    authManager,
    requestEmailOTP,
    requestMobileOTP,
    verifyEmailOTP,
    verifyMobileOTP,
    fetchOrganizations,
    selectOrganization,
    logout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
