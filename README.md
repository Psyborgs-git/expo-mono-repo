# Expo Monorepo with Tamagui

A production-ready Expo monorepo featuring shared UI components, theming, GraphQL networking, and multiple apps.

> **Quick Start:** See [QUICK_START.md](./QUICK_START.md) to get running in 5 minutes!

## 🚀 Features

- ✅ **App Factory** - Automated app and package creation with `create-app` and `create-package`
- ✅ **Monorepo Structure** - pnpm workspaces with multiple apps and shared packages
- ✅ **Pre-Built Flows** - Login, Signup, OTP verification, Chat, and more out of the box
- ✅ **Tamagui UI Library** - Performant, themeable UI components for React Native and Web
- ✅ **Dark Mode** - Automatic light/dark theme switching
- ✅ **GraphQL Network Layer** - Apollo Client with auth, caching, and error handling
- ✅ **OAuth2/JWT Authentication** - Automatic token refresh and secure storage
- ✅ **Expo Router** - File-based routing with deep linking support
- ✅ **React Native Web** - Universal apps that run on iOS, Android, and Web
- ✅ **TypeScript** - Full type safety across all packages
- ✅ **Shared Components** - Reusable component library across all apps
- ✅ **Design System** - Comprehensive tokens, themes, and styling standards
- ✅ **Expo Modules** - Support for creating native modules with minimal configuration

## 📁 Project Structure

```
expo-mono-repo/
├── apps/                          # Expo applications
│   ├── carat-central/             # First app
│   ├── vloop/                     # Second app
│   └── parallax/                  # Third app
├── packages/                      # Shared packages
│   ├── ui/                        # Design system and theming
│   │   ├── src/
│   │   │   ├── tokens.ts          # Design tokens
│   │   │   ├── themes.ts          # Light/dark themes
│   │   │   └── fonts.ts           # Font configuration
│   │   └── tamagui.config.ts      # Tamagui configuration
│   ├── components/                # Reusable components
│   │   └── src/
│   │       ├── Button.tsx         # Button variants
│   │       ├── Input.tsx          # Input components
│   │       ├── Card.tsx           # Card components
│   │       ├── Layout.tsx         # Layout components
│   │       └── Alert.tsx          # Alert components
│   └── network/                   # GraphQL and authentication
│       └── src/
│           ├── apollo-client.ts   # Apollo Client setup
│           ├── auth/              # Authentication
│           ├── cache/             # Cache management
│           └── hooks/             # React hooks
├── graphql/                       # GraphQL schemas
│   ├── carat-central/
│   └── vloop/
├── THEMING_GUIDE.md              # Comprehensive theming guide
├── NETWORK_LAYER_API.md          # Network layer documentation
├── COMPONENT_LIBRARY.md          # Component reference
└── README.md                     # This file
```

## 🏃 Quick Start

### Prerequisites


### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd expo-mono-repo
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start an app:
   ```bash
   # Start carat-central
   pnpm start:carat-central

   # Or start vloop
   pnpm start:vloop

   # Or start parallax
   pnpm start:parallax
   ```

4. Run on a specific platform:
   ```bash
   # iOS
   pnpm --filter @bdt/carat-central ios

   # Android
   pnpm --filter @bdt/carat-central android

   # Web
   pnpm --filter @bdt/carat-central web
   ```

## 📦 Packages

### @bdt/ui

Design system package with tokens, themes, and fonts.

```tsx
 import { tamaguiConfig, tokens, lightTheme, darkTheme } from '@bdt/ui';
```

**Features:**

**Documentation:** [THEMING_GUIDE.md](./THEMING_GUIDE.md)

### @bdt/components

Reusable component library built on Tamagui.

```tsx
import {
  PrimaryButton,
  TextInput,
  Card,
  Container,
  Alert,
} from '@bdt/components';
```

**Components:**

**Documentation:** [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)

### @bdt/network

GraphQL client with authentication and caching.

```tsx
 import { createApolloClient, AuthManager, useAuth } from '@bdt/network';

const apolloClient = createApolloClient({
  graphqlEndpoint: 'https://api.example.com/graphql',
  authManager,
});
```

**Features:**

**Documentation:** [NETWORK_LAYER_API.md](./NETWORK_LAYER_API.md)

## 🎨 Theming

All apps support automatic light/dark mode switching based on system preferences.

### Using Theme Values

```tsx
import { YStack, Text } from 'tamagui';

<YStack backgroundColor="$background" padding="$4" borderRadius="$3">
  <Text color="$color" fontSize="$4">
    Themed content
  </Text>
</YStack>
```

### Customizing Themes

1. Edit `packages/ui/src/tokens.ts` for design tokens
2. Edit `packages/ui/src/themes.ts` for theme values
3. Components automatically use the updated values

See [THEMING_GUIDE.md](./THEMING_GUIDE.md) for details.

## 🌐 GraphQL & Authentication

### Setup Apollo Client

```tsx
// apps/your-app/lib/apollo.ts
 import { createApolloClient, AuthManager } from '@bdt/network';

export const authManager = new AuthManager({
  tokenEndpoint: 'https://api.example.com/auth/token',
});

export const apolloClient = createApolloClient({
  graphqlEndpoint: 'https://api.example.com/graphql',
  authManager,
});
```

### Use in App

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

### Authentication

```tsx
 import { useAuth } from '@bdt/network';
import { authManager } from './lib/apollo';

function LoginScreen() {
  const { isAuthenticated, login, logout } = useAuth(authManager);

  const handleLogin = async () => {
    const success = await login('user@example.com', 'password');
  };

  return (
    <View>
      {isAuthenticated ? (
        <Button onPress={logout}>Logout</Button>
      ) : (
        <Button onPress={handleLogin}>Login</Button>
      )}
    </View>
  );
}
```

See [NETWORK_LAYER_API.md](./NETWORK_LAYER_API.md) for complete API reference.

## 🗂️ Apps

### carat-central

First application in the monorepo.

**Features:**

### vloop

Second application in the monorepo.

**Features:**

### parallax

Third application in the monorepo.

**Features:**

## 🧩 Creating a New App

Use the automated CLI tool:

```bash
pnpm create-app
```

Or directly:

```bash
tsx tools/src/create-app.ts
```

Choose from templates:
- **Basic** - Simple tabs navigation
- **Auth Flow** - Login, signup, OTP verification
- **Chat** - Real-time messaging interface
- **Dashboard** - Data-heavy analytics app

## 🔧 Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed development guidelines including:
- Creating components
- Using pre-built flows (Login, Signup, OTP, Chat)
- Theming and customization
- Testing and linting
- Pull request process

## 📚 Documentation

- **[Quick Start](./QUICK_START.md)** - Get up and running in 5 minutes
- **[Contributing Guide](./CONTRIBUTING.md)** - Development workflow and best practices
- **[Pre-Built Flows](./FLOWS.md)** - Ready-to-use auth, chat, and UI flows
- **[Theming Guide](./THEMING_GUIDE.md)** - Complete theming and design system documentation
- **[Network Layer API](./NETWORK_LAYER_API.md)** - GraphQL, authentication, and caching guide
- **[Component Library](./COMPONENT_LIBRARY.md)** - All available components and usage examples

## 🛠️ Tech Stack

- **Runtime:** Expo SDK 54
- **UI Framework:** Tamagui 1.135
- **Routing:** Expo Router 6
- **State Management:** Apollo Client 4
- **Package Manager:** pnpm 10
- **Language:** TypeScript 5
- **GraphQL:** Apollo Client + GraphQL Code Generator
- **Authentication:** JWT with automatic refresh
- **Storage:** AsyncStorage

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test across all platforms (iOS, Android, Web)
4. Update documentation if needed
5. Submit a pull request

## 📝 License

MIT

## 🙏 Acknowledgments

- [Tamagui](https://tamagui.dev/) - Universal UI system
- [Expo](https://expo.dev/) - React Native framework
- [Apollo Client](https://www.apollographql.com/) - GraphQL client

