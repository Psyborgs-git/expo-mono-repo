import * as SecureStore from 'expo-secure-store';
import type { AuthTokens, AuthState } from '../types';

const TOKEN_KEY = '@auth_tokens';
const USER_KEY = '@auth_user';
const ORGANIZATION_KEY = '@auth_organization';

export interface AuthConfig {
  graphqlEndpoint?: string;
  onAuthStateChange?: (state: AuthState) => void;
}

export interface OTPCredentials {
  email?: string;
  mobile?: string;
  countryCode?: string;
  otp: string;
}

export interface Organization {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export class AuthManager {
  private tokens: AuthTokens | null = null;
  private user: any | null = null;
  private organization: Organization | null = null;
  private config: AuthConfig;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(config: AuthConfig = {}) {
    this.config = config;
    this.loadTokensFromStorage();
  }

  private async loadTokensFromStorage() {
    try {
      const [tokensStr, userStr, orgStr] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
        SecureStore.getItemAsync(ORGANIZATION_KEY),
      ]);

      if (tokensStr) {
        this.tokens = JSON.parse(tokensStr);
      }
      if (userStr) {
        this.user = JSON.parse(userStr);
      }
      if (orgStr) {
        this.organization = JSON.parse(orgStr);
      }

      this.notifyAuthStateChange();
    } catch (error) {
      console.error('Failed to load auth from storage:', error);
    }
  }

  async setAuth(tokens: AuthTokens, user?: any) {
    this.tokens = tokens;
    this.user = user || null;

    try {
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(tokens)),
        user ? SecureStore.setItemAsync(USER_KEY, JSON.stringify(user)) : Promise.resolve(),
      ]);

      this.notifyAuthStateChange();
    } catch (error) {
      console.error('Failed to save auth to storage:', error);
    }
  }

  async setOrganization(organization: Organization | null) {
    this.organization = organization;

    try {
      if (organization) {
        await SecureStore.setItemAsync(ORGANIZATION_KEY, JSON.stringify(organization));
      } else {
        await SecureStore.deleteItemAsync(ORGANIZATION_KEY);
      }

      this.notifyAuthStateChange();
    } catch (error) {
      console.error('Failed to save organization to storage:', error);
    }
  }

  async clearAuth() {
    this.tokens = null;
    this.user = null;
    this.organization = null;

    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
        SecureStore.deleteItemAsync(ORGANIZATION_KEY),
      ]);

      this.notifyAuthStateChange();
    } catch (error) {
      console.error('Failed to clear auth from storage:', error);
    }
  }

  getTokens(): AuthTokens | null {
    return this.tokens;
  }

  getUser(): any | null {
    return this.user;
  }

  getOrganization(): Organization | null {
    return this.organization;
  }

  isAuthenticated(): boolean {
    if (!this.tokens) return false;

    // Check if token is expired
    if (this.tokens.expiresAt && this.tokens.expiresAt < Date.now()) {
      return false;
    }

    return true;
  }

  async refreshTokens(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.tokens?.refreshToken || !this.config.graphqlEndpoint) {
      return false;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(this.config.graphqlEndpoint!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tokens!.accessToken}`,
          },
          body: JSON.stringify({
            query: `
              mutation CaratRefreshToken($refreshToken: String!) {
                caratRefreshToken(refreshToken: $refreshToken) {
                  accessToken
                  refreshToken
                }
              }
            `,
            variables: {
              refreshToken: this.tokens!.refreshToken,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0]?.message || 'Token refresh failed');
        }

        const newTokens = {
          accessToken: data.data.caratRefreshToken.accessToken,
          refreshToken: data.data.caratRefreshToken.refreshToken,
          expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour from now
        };

        await this.setAuth(newTokens, this.user);
        return true;
      } catch (error) {
        console.error('Token refresh failed:', error);
        await this.clearAuth();
        return false;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private notifyAuthStateChange() {
    if (this.config.onAuthStateChange) {
      this.config.onAuthStateChange({
        isAuthenticated: this.isAuthenticated(),
        tokens: this.tokens,
        user: this.user,
        organization: this.organization,
      });
    }
  }

  // OTP-based authentication methods
  async requestEmailOTP(email: string): Promise<{ message: string; otpId: string }> {
    if (!this.config.graphqlEndpoint) {
      throw new Error('GraphQL endpoint not configured');
    }

    try {
      const response = await fetch(this.config.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation CaratRequestEmailOTP($email: String!) {
              caratRequestEmailOTP(email: $email) {
                message
                otpId
              }
            }
          `,
          variables: { email },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to request OTP');
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'Failed to request OTP');
      }

      return data.data.caratRequestEmailOTP;
    } catch (error) {
      console.error('Request email OTP failed:', error);
      throw error;
    }
  }

  async requestMobileOTP(mobile: string, countryCode: string = '1'): Promise<{ message: string; otpId: string }> {
    if (!this.config.graphqlEndpoint) {
      throw new Error('GraphQL endpoint not configured');
    }

    try {
      const response = await fetch(this.config.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation CaratRequestMobileOTP($mobile: String!, $countryCode: String!) {
              caratRequestMobileOTP(mobile: $mobile, countryCode: $countryCode) {
                message
                otpId
              }
            }
          `,
          variables: { mobile, countryCode },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to request OTP');
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'Failed to request OTP');
      }

      return data.data.caratRequestMobileOTP;
    } catch (error) {
      console.error('Request mobile OTP failed:', error);
      throw error;
    }
  }

  async verifyEmailOTP(email: string, otp: string): Promise<{ accessToken: string; refreshToken: string; users: any }> {
    if (!this.config.graphqlEndpoint) {
      throw new Error('GraphQL endpoint not configured');
    }

    try {
      const response = await fetch(this.config.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation CaratVerifyEmailOTP($email: String!, $otp: String!) {
              caratVerifyEmailOTP(email: $email, otp: $otp) {
                accessToken
                refreshToken
                users {
                  id
                  email
                  name
                }
              }
            }
          `,
          variables: { email, otp },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify OTP');
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'Failed to verify OTP');
      }

      const authPayload = data.data.caratVerifyEmailOTP;
      const tokens = {
        accessToken: authPayload.accessToken,
        refreshToken: authPayload.refreshToken,
        expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour from now
      };

      await this.setAuth(tokens, authPayload.users);
      return authPayload;
    } catch (error) {
      console.error('Verify email OTP failed:', error);
      throw error;
    }
  }

  async verifyMobileOTP(mobile: string, otp: string, countryCode: string = '1'): Promise<{ accessToken: string; refreshToken: string; users: any }> {
    if (!this.config.graphqlEndpoint) {
      throw new Error('GraphQL endpoint not configured');
    }

    try {
      const response = await fetch(this.config.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation CaratVerifyMobileOTP($mobile: String!, $otp: String!, $countryCode: String!) {
              caratVerifyMobileOTP(mobile: $mobile, otp: $otp, countryCode: $countryCode) {
                accessToken
                refreshToken
                users {
                  id
                  email
                  name
                }
              }
            }
          `,
          variables: { mobile, otp, countryCode },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify OTP');
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'Failed to verify OTP');
      }

      const authPayload = data.data.caratVerifyMobileOTP;
      const tokens = {
        accessToken: authPayload.accessToken,
        refreshToken: authPayload.refreshToken,
        expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour from now
      };

      await this.setAuth(tokens, authPayload.users);
      return authPayload;
    } catch (error) {
      console.error('Verify mobile OTP failed:', error);
      throw error;
    }
  }

  async fetchUserOrganizations(): Promise<Organization[]> {
    if (!this.config.graphqlEndpoint || !this.tokens?.accessToken) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(this.config.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.tokens.accessToken}`,
        },
        body: JSON.stringify({
          query: `
            query MyOrganizations {
              myOrganizations {
                id
                name
                description
                isActive
              }
            }
          `,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'Failed to fetch organizations');
      }

      return data.data.myOrganizations;
    } catch (error) {
      console.error('Fetch organizations failed:', error);
      throw error;
    }
  }

  async logout() {
    await this.clearAuth();
  }
}
