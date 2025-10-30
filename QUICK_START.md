# Quick Start Guide

Get up and running with the Expo monorepo in 5 minutes.

## Prerequisites

Make sure you have installed:
- Node.js 18 or later
- pnpm 8 or later (`npm install -g pnpm`)

## 1. Install Dependencies

```bash
pnpm install
```

This will install ~140 packages and link all workspace packages.

## 2. Start an App

```bash
# Start carat-central app
pnpm start:carat-central

# Or start vloop
pnpm start:vloop

# Or start parallax
pnpm start:parallax
```

## 3. Choose a Platform

Once the Metro bundler starts, press:
- `i` for iOS Simulator
- `a` for Android Emulator  
- `w` for Web browser

## What's Included

### Three Apps Ready to Run

Each app includes:
- ✅ Tamagui UI components
- ✅ Dark mode support
- ✅ Shared component library
- ✅ GraphQL/Auth setup ready
- ✅ TypeScript configured

### Example: Add Components

```tsx
import {
  Container,
  Stack,
  PrimaryButton,
  Card,
  CardBody,
  TextInput,
} from '@bdt/components';
import { H1, Paragraph } from 'tamagui';

export default function App() {
  return (
    <Container>
      <Stack gap="$4" paddingTop="$10">
        <H1>Welcome!</H1>
        <Card>
          <CardBody>
            <TextInput placeholder="Enter your name" />
            <PrimaryButton>Submit</PrimaryButton>
          </CardBody>
        </Card>
      </Stack>
    </Container>
  );
}
```

### Example: Add GraphQL

1. Create Apollo client:

```tsx
// lib/apollo.ts
import { createApolloClient, AuthManager } from '@bdt/network';

export const authManager = new AuthManager({
  tokenEndpoint: 'https://your-api.com/auth/token',
});

export const apolloClient = createApolloClient({
  graphqlEndpoint: 'https://your-api.com/graphql',
  authManager,
});
```

2. Wrap your app:

```tsx
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './lib/apollo';

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      {/* Your app */}
    </ApolloProvider>
  );
}
```

3. Use queries:

```tsx
import { useQuery, gql } from '@apollo/client';

const GET_DATA = gql`
  query GetData {
    items {
      id
      name
    }
  }
`;

function MyComponent() {
  const { data, loading } = useQuery(GET_DATA);
  
  if (loading) return <Text>Loading...</Text>;
  return <Text>{data.items.length} items</Text>;
}
```

## Customize Theme

Edit `packages/ui/src/tokens.ts`:

```ts
color: {
  primary: '#FF6B35', // Change brand color
  secondary: '#F7931E',
  // ... all apps update automatically
}
```

## Add a New Component

1. Create file in `packages/components/src/`:

```tsx
// MyComponent.tsx
import { styled } from 'tamagui';
import { YStack } from 'tamagui';

export const MyComponent = styled(YStack, {
  backgroundColor: '$background',
  padding: '$4',
  borderRadius: '$3',
});
```

2. Export in `packages/components/src/index.ts`:

```ts
export { MyComponent } from './MyComponent';
```

3. Use in any app:

```tsx
import { MyComponent } from '@bdt/components';
```

## Build for Production

```bash
# iOS
 pnpm --filter @bdt/carat-central ios --configuration Release

# Android
 pnpm --filter @bdt/carat-central android --variant release

# Web
 pnpm --filter @bdt/carat-central build:web
```

## Common Commands

```bash
# Install a package to an app
 pnpm --filter @bdt/carat-central add package-name

# Install a package to all apps
pnpm add -w package-name

# Run TypeScript check
 pnpm --filter @bdt/ui tsc

# Clear Metro cache
 pnpm --filter @bdt/carat-central start --clear
```

## Troubleshooting

### Metro bundler won't start

```bash
# Clear cache and reinstall
rm -rf node_modules
pnpm install
 pnpm --filter @bdt/carat-central start --clear
```

### TypeScript errors

The monorepo uses workspace packages which may show IDE warnings. These don't affect runtime. Run `pnpm install` to link packages.

### Dark mode not working

Make sure `app.config.ts` has:

```ts
userInterfaceStyle: 'automatic'
```

## Next Steps

- 📖 Read [THEMING_GUIDE.md](./THEMING_GUIDE.md) to customize colors and tokens
- 📖 Read [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) to see all components
- 📖 Read [NETWORK_LAYER_API.md](./NETWORK_LAYER_API.md) to setup GraphQL
- 📖 Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for complete project overview

## Get Help

- Tamagui Docs: https://tamagui.dev/
- Expo Docs: https://docs.expo.dev/
- Apollo Client Docs: https://www.apollographql.com/docs/react/

Happy coding! 🚀
