# @bdt/network

Shared network layer for all Expo apps with GraphQL, auth, and caching support.

## Features

- ✅ Apollo Client for GraphQL
- ✅ OAuth2 / JWT authentication with automatic token refresh
- ✅ Secure token storage with AsyncStorage
- ✅ Network caching and optimization
- ✅ Error handling and retry logic
- ✅ React hooks for auth and GraphQL

## Installation

Already installed as part of the monorepo workspace.

## Usage

### Setup Apollo Client

```ts
import { createApolloClient, AuthManager } from '@bdt/network';

const authManager = new AuthManager({
  tokenEndpoint: 'https://api.example.com/auth/token',
  onAuthStateChange: (state) => {
    console.log('Auth state changed:', state);
  },
});

const client = createApolloClient({
  graphqlEndpoint: 'https://api.example.com/graphql',
  authManager,
  enableCache: true,
});
```

### Use Authentication

```tsx
import { useAuth } from '@bdt/network';

function LoginScreen() {
  const { isAuthenticated, user, login, logout } = useAuth(authManager);

  const handleLogin = async () => {
    const success = await login('user@example.com', 'password');
    if (success) {
      console.log('Logged in!');
    }
  };

  return (
    <View>
      {isAuthenticated ? (
        <>
          <Text>Welcome, {user?.name}</Text>
          <Button onPress={logout}>Logout</Button>
        </>
      ) : (
        <Button onPress={handleLogin}>Login</Button>
      )}
    </View>
  );
}
```

### Use GraphQL Queries

```tsx
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

function UsersList() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data.users}
      renderItem={({ item }) => <Text>{item.name}</Text>}
    />
  );
}
```

## API Reference

### `createApolloClient(config)`

Creates an Apollo Client instance with auth and error handling.

**Config Options:**
- `graphqlEndpoint` (string): GraphQL API endpoint
- `authManager` (AuthManager): Auth manager instance
- `enableCache` (boolean): Enable caching (default: true)
- `headers` (object): Additional headers

### `AuthManager`

Manages authentication tokens and state.

**Methods:**
- `setAuth(tokens, user)`: Set auth tokens and user
- `clearAuth()`: Clear auth state
- `getTokens()`: Get current tokens
- `getUser()`: Get current user
- `isAuthenticated()`: Check if authenticated
- `refreshTokens()`: Refresh access token
- `loginWithCredentials(email, password)`: Login with email/password
- `logout()`: Logout user

### `useAuth(authManager)`

React hook for authentication.

**Returns:**
- `isAuthenticated` (boolean): Whether user is authenticated
- `tokens` (AuthTokens | null): Current tokens
- `user` (any | null): Current user
- `login(email, password)`: Login function
- `logout()`: Logout function

## Customization

### Custom Auth Flow

```ts
class CustomAuthManager extends AuthManager {
  async loginWithOAuth(provider: string) {
    // Implement OAuth flow
  }
}
```

### Custom Error Handling

```ts
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // Custom error handling
});
```

## Environment Variables

Set these in your app's `.env`:

```
GRAPHQL_ENDPOINT=https://api.example.com/graphql
AUTH_ENDPOINT=https://api.example.com/auth/token
```
