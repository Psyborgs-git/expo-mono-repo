import React, { ReactNode } from 'react';
import { View, Text, YStack, Spinner } from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  requireOrganization?: boolean;
  fallback?: ReactNode;
}

export function AuthGuard({ 
  children, 
  requireOrganization = false, 
  fallback 
}: AuthGuardProps) {
  const { isAuthenticated, organization, isLoading, user } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <YStack space="$4" alignItems="center">
          <Spinner size="large" color="$blue10" />
          <Text fontSize="$4" color="$gray10">
            Loading...
          </Text>
        </YStack>
      </View>
    );
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <YStack space="$4" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" color="$color">
            Authentication Required
          </Text>
          <Text fontSize="$4" color="$gray10" textAlign="center">
            Please log in to access this content
          </Text>
        </YStack>
      </View>
    );
  }

  // Check organization requirement
  if (requireOrganization && !organization) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <View flex={1} backgroundColor="$background" justifyContent="center" alignItems="center">
        <YStack space="$4" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" color="$color">
            Organization Required
          </Text>
          <Text fontSize="$4" color="$gray10" textAlign="center">
            Please select an organization to continue
          </Text>
        </YStack>
      </View>
    );
  }

  // Render protected content
  return <>{children}</>;
}

// Higher-order component version
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: { requireOrganization?: boolean } = {}
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard requireOrganization={options.requireOrganization}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}