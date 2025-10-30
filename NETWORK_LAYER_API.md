# Network Layer API

Complete guide to using the shared network layer (`@bdt/network`) for GraphQL, authentication, and caching.

## Overview

The network layer provides:

- ✅ Apollo Client for GraphQL queries/mutations
- ✅ OAuth2/JWT authentication with automatic token refresh
- ✅ Secure token storage using AsyncStorage
- ✅ Request/response interceptors
- ✅ Error handling and retry logic
- ✅ Network caching and optimization
- ✅ React hooks for easy integration

## Quick Start

### 1. Setup Apollo Client

Create a client instance in your app:

```tsx
// apps/your-app/lib/apollo.ts
import { createApolloClient, AuthManager } from '@bdt/network';

export const authManager = new AuthManager({
  tokenEndpoint: 'https://api.example.com/auth/token',
  onAuthStateChange: (state) => {
    console.log('Auth state changed:', state.isAuthenticated);
  },
});

export const apolloClient = createApolloClient({
  graphqlEndpoint: 'https://api.example.com/graphql',
  authManager,
  enableCache: true,
  headers: {
    'X-App-Version': '1.0.0',
  },
});
```

### 2. Wrap Your App with ApolloProvider

```tsx
// apps/your-app/App.tsx
import { ApolloProvider } from '@apollo/client';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from '@bdt/ui';
import { apolloClient } from './lib/apollo';

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <ApolloProvider client={apolloClient}>
        {/* Your app */}
      </ApolloProvider>
    </TamaguiProvider>
  );
}
```

### 3. Use Authentication Hook

```tsx
import { useAuth } from '@bdt/network';
import { authManager } from '../lib/apollo';

function LoginScreen() {
  const { isAuthenticated, user, login, logout } = useAuth(authManager);

  const handleLogin = async () => {
    const success = await login('user@example.com', 'password');
    if (success) {
      console.log('Logged in as:', user);
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

### 4. Use GraphQL Queries

```tsx
import { useQuery, gql } from '@apollo/client';
import { FlatList, Text } from 'react-native';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      avatar
    }
  }
`;

function UsersScreen() {
  const { data, loading, error, refetch } = useQuery(GET_USERS);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={data.users}
      onRefresh={refetch}
      refreshing={loading}
      renderItem={({ item }) => (
        <Text>{item.name} - {item.email}</Text>
      )}
    />
  );
}
```

### 5. Use GraphQL Mutations

```tsx
import { useMutation, gql } from '@apollo/client';
import { TextInput } from '@bdt/components';
import { PrimaryButton } from '@bdt/components';

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

function CreateUserForm() {
  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    refetchQueries: ['GetUsers'], // Refetch users list after creation
  });

  const handleSubmit = async (name: string, email: string) => {
    try {
      const result = await createUser({
        variables: {
          input: { name, email },
        },
      });
      console.log('User created:', result.data.createUser);
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  return (
    <View>
      <TextInput placeholder="Name" />
      <TextInput placeholder="Email" />
      <PrimaryButton onPress={() => handleSubmit('John', 'john@example.com')} disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </PrimaryButton>
      {error && <Text>Error: {error.message}</Text>}
    </View>
  );
}
```

## Authentication

### AuthManager API

#### Constructor

```ts
const authManager = new AuthManager({
  tokenEndpoint: 'https://api.example.com/auth/token',
  onAuthStateChange: (state: AuthState) => {
    // Called whenever auth state changes
  },
});
```

#### Methods

##### `setAuth(tokens, user?)`

Set authentication tokens and user data:

```ts
await authManager.setAuth(
  {
    accessToken: 'eyJhbGciOiJIUzI1NiIs...',
    refreshToken: 'refresh_token_here',
    expiresAt: Date.now() + 3600000, // 1 hour from now
  },
  { id: 1, name: 'John Doe', email: 'john@example.com' }
);
```

##### `clearAuth()`

Clear all authentication data:

```ts
await authManager.clearAuth();
```

##### `getTokens()`

Get current authentication tokens:

```ts
const tokens = authManager.getTokens();
if (tokens) {
  console.log('Access token:', tokens.accessToken);
}
```

##### `getUser()`

Get current user data:

```ts
const user = authManager.getUser();
if (user) {
  console.log('User:', user.name);
}
```

##### `isAuthenticated()`

Check if user is authenticated:

```ts
if (authManager.isAuthenticated()) {
  // User is logged in
}
```

##### `refreshTokens()`

Manually refresh access token:

```ts
const success = await authManager.refreshTokens();
if (success) {
  console.log('Token refreshed');
}
```

##### `loginWithCredentials(email, password)`

Login with email and password:

```ts
const success = await authManager.loginWithCredentials(
  'user@example.com',
  'password123'
);
```

##### `logout()`

Logout user:

```ts
await authManager.logout();
```

### Custom Authentication Flow

Extend `AuthManager` for custom auth flows:

```ts
import { AuthManager } from '@bdt/network';

class CustomAuthManager extends AuthManager {
  async loginWithGoogle(idToken: string) {
    const response = await fetch(this.config.tokenEndpoint!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'google', idToken }),
    });

    const data = await response.json();
    await this.setAuth(data.tokens, data.user);
    return true;
  }

  async loginWithApple(authorizationCode: string) {
    // Similar implementation for Apple Sign In
  }
}

// Use custom manager
export const authManager = new CustomAuthManager({
  tokenEndpoint: 'https://api.example.com/auth/token',
});
```

## GraphQL Queries & Mutations

### Query with Variables

```tsx
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      posts {
        id
        title
      }
    }
  }
`;

function UserProfile({ userId }) {
  const { data, loading } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  // ...
}
```

### Pagination

```tsx
const GET_POSTS = gql`
  query GetPosts($offset: Int!, $limit: Int!) {
    posts(offset: $offset, limit: $limit) {
      id
      title
      author {
        name
      }
    }
  }
`;

function PostsList() {
  const { data, loading, fetchMore } = useQuery(GET_POSTS, {
    variables: { offset: 0, limit: 20 },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: data.posts.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          posts: [...prev.posts, ...fetchMoreResult.posts],
        };
      },
    });
  };

  // ...
}
```

### Optimistic Updates

```tsx
const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String!) {
    updatePost(id: $id, title: $title) {
      id
      title
    }
  }
`;

function EditPost({ postId }) {
  const [updatePost] = useMutation(UPDATE_POST, {
    optimisticResponse: {
      updatePost: {
        __typename: 'Post',
        id: postId,
        title: 'Updating...', // Shown immediately
      },
    },
  });

  // ...
}
```

## Caching

### Cache Policies

Configure cache behavior per query:

```tsx
useQuery(GET_USERS, {
  fetchPolicy: 'cache-first', // Use cache if available
  // Other options: 'cache-and-network', 'network-only', 'cache-only', 'no-cache'
});
```

### Cache Management

```tsx
import { CacheManager } from '@bdt/network';
import { apolloClient } from '../lib/apollo';

const cacheManager = new CacheManager(apolloClient);

// Clear entire cache
await cacheManager.clearCache();

// Reset cache and refetch all active queries
await cacheManager.resetCache();

// Evict specific item from cache
cacheManager.evict('User:1');

// Evict specific field
cacheManager.evict('User:1', 'posts');

// Run garbage collection
cacheManager.gc();
```

### Manual Cache Updates

```tsx
const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $text: String!) {
    addComment(postId: $postId, text: $text) {
      id
      text
      author {
        name
      }
    }
  }
`;

const [addComment] = useMutation(ADD_COMMENT, {
  update(cache, { data: { addComment } }) {
    // Read existing comments from cache
    const existingData = cache.readQuery({
      query: GET_POST_COMMENTS,
      variables: { postId },
    });

    // Write updated comments to cache
    cache.writeQuery({
      query: GET_POST_COMMENTS,
      variables: { postId },
      data: {
        comments: [...existingData.comments, addComment],
      },
    });
  },
});
```

## Error Handling

### Global Error Handling

Errors are handled automatically by the error link in `createApolloClient`. The error link:

1. Catches authentication errors (401/UNAUTHENTICATED)
2. Automatically attempts token refresh
3. Retries the failed request with new token
4. Clears auth if refresh fails

### Per-Query Error Handling

```tsx
const { data, error } = useQuery(GET_USERS, {
  onError: (error) => {
    console.error('Query failed:', error);
    // Show toast, log to error service, etc.
  },
});

if (error) {
  if (error.networkError) {
    return <Text>Network error. Check your connection.</Text>;
  }
  
  if (error.graphQLErrors) {
    return <Text>GraphQL error: {error.graphQLErrors[0].message}</Text>;
  }
}
```

## Environment Configuration

Use environment variables for different environments:

```tsx
// apps/your-app/lib/apollo.ts
const GRAPHQL_ENDPOINT = __DEV__
  ? 'http://localhost:4000/graphql'
  : 'https://api.production.com/graphql';

export const apolloClient = createApolloClient({
  graphqlEndpoint: GRAPHQL_ENDPOINT,
  // ...
});
```

Or use Expo's environment variables:

```ts
import Constants from 'expo-constants';

const GRAPHQL_ENDPOINT = Constants.expoConfig?.extra?.graphqlEndpoint || 'https://api.example.com/graphql';
```

## Best Practices

1. **Type your queries** - Use GraphQL Code Generator for TypeScript types
2. **Normalize cache** - Use consistent `id` fields for better caching
3. **Handle loading states** - Always show loading indicators
4. **Error boundaries** - Wrap queries in error boundaries
5. **Pagination** - Use cursor-based pagination for large lists
6. **Optimistic updates** - Improve perceived performance
7. **Token refresh** - Let the error link handle it automatically
8. **Logout on 403** - Clear auth when user doesn't have permission

## Troubleshooting

### Queries not updating

Make sure you're using the same Apollo Client instance and the cache is enabled.

### Authentication not persisting

Check that AsyncStorage permissions are granted and data is being saved correctly.

### Token refresh loop

Ensure your token endpoint returns valid tokens and doesn't return 401 for refresh requests.
