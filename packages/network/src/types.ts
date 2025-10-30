export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface NetworkConfig {
  graphqlEndpoint: string;
  authEndpoint?: string;
  enableCache?: boolean;
  enableDevTools?: boolean;
  headers?: Record<string, string>;
}

export interface AuthState {
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  user: any | null;
  organization: any | null;
}
