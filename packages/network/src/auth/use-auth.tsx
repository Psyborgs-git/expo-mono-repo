import { useState, useEffect, useCallback } from 'react'
import type { AuthState } from '../types'
import type { AuthManager } from './auth-manager'

export function useAuth(authManager: AuthManager) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: authManager.isAuthenticated(),
    tokens: authManager.getTokens(),
    user: authManager.getUser(),
    organization: authManager.getOrganization(),
  })

  useEffect(() => {
    const unsubscribe = () => {
      // Setup auth state listener
      authManager['config'].onAuthStateChange = setAuthState
    }

    return unsubscribe
  }, [authManager])

  const login = useCallback(
    async (countryCode: string, phoneNumber: string) => {
      return authManager.loginWithPhoneNumber(countryCode, phoneNumber)
    },
    [authManager]
  )

  const logout = useCallback(async () => {
    await authManager.logout()
  }, [authManager])

  return {
    ...authState,
    login,
    logout,
  }
}
