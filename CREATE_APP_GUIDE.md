# 🚀 Create App Guide

Comprehensive guide for scaffolding new Expo apps in the monorepo using the `create-app` CLI tool.

## Quick Start

```bash
# From the monorepo root
pnpm create-app
```

The interactive CLI will guide you through:
1. App name (kebab-case)
2. Display name (shown in the app)
3. Description
4. Template selection
5. Feature options (auth, GraphQL, push notifications)
6. Package manager preference

## Available Templates

### 1. Basic Template 🏠
**Best for:** Simple apps, MVPs, learning

**Features:**
- Clean tabs navigation (Home, Settings)
- Minimal setup
- Ready to extend

**Generated Structure:**
```
my-app/
├── app/
│   ├── _layout.tsx          # Root with TamaguiProvider
│   ├── index.tsx            # Redirect to tabs
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigation
│       ├── index.tsx        # Home screen
│       └── settings.tsx     # Settings screen
├── components/              # App-specific components
├── contexts/                # React contexts
├── hooks/                   # Custom hooks
├── utils/                   # Utility functions
├── app.config.ts            # Expo configuration
├── package.json             # Dependencies
└── tamagui.config.ts        # Theme config
```

**Use Case:** Learning projects, prototypes, simple utilities

---

### 2. Auth Flow Template 🔐
**Best for:** Apps requiring user authentication

**Features:**
- Complete authentication flow
- Login screen with `LoginForm` component
- Signup screen with `SignupForm` component
- Protected routes
- Auth context with hooks
- Form validation
- Remember me functionality

**Generated Structure:**
```
my-app/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx        # LoginForm from @bdt/components
│   │   └── signup.tsx       # SignupForm from @bdt/components
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       └── settings.tsx
├── contexts/
│   ├── AuthContext.tsx      # User state management
│   └── ApolloProvider.tsx   # (if GraphQL enabled)
└── ...
```

**Components Used:**
- `LoginForm` - Email/password with validation
- `SignupForm` - Registration with password strength check
- `OTPVerification` - (if OTP flow added)

**Use Case:** Social apps, productivity tools, e-commerce, SaaS

---

### 3. Chat Template 💬
**Best for:** Messaging and communication apps

**Features:**
- Chat list screen
- Contacts screen
- Settings screen
- Tab navigation for messaging
- Ready for chat components integration

**Generated Structure:**
```
my-app/
├── app/
│   └── (tabs)/
│       ├── _layout.tsx      # Chats, Contacts, Settings tabs
│       ├── index.tsx        # Chat list
│       ├── contacts.tsx     # Contacts
│       └── settings.tsx     # Settings
├── app/chat/                # Chat detail screens (to be added)
└── ...
```

**Components to Integrate:**
- `ChatBubble` - Message display
- `ChatInput` - Message composition
- `TypingIndicator` - Typing status

**Use Case:** Messaging apps, customer support, team collaboration

---

### 4. Dashboard Template 📊
**Best for:** Analytics and data-heavy applications

**Features:**
- Dashboard overview screen
- Analytics screen
- Settings screen
- Card-based layout
- Data visualization ready

**Generated Structure:**
```
my-app/
├── app/
│   └── (tabs)/
│       ├── _layout.tsx      # Dashboard, Analytics, Settings tabs
│       ├── index.tsx        # Dashboard with metric cards
│       ├── analytics.tsx    # Detailed analytics
│       └── settings.tsx     # Settings
└── ...
```

**Metrics Example:**
```tsx
<Card flex={1} padding="$4" backgroundColor="$blue5">
  <Text fontSize="$2" color="$textWeak">Total Users</Text>
  <Text fontSize="$8" fontWeight="bold">1,234</Text>
</Card>
```

**Use Case:** Admin panels, business intelligence, monitoring tools

---

## Feature Options

### GraphQL with Apollo Client ⚡

**Includes:**
- `@apollo/client` setup
- HTTP link configuration
- Auth header integration
- In-memory cache
- `ApolloProvider` context

**Configuration:**
```typescript
// contexts/ApolloProvider.tsx
const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT,
});

const authLink = setContext((_, { headers }) => {
  // Add auth token to headers
  return { headers };
});
```

**Environment Setup:**
```bash
# .env
EXPO_PUBLIC_GRAPHQL_ENDPOINT=https://api.example.com/graphql
```

---

### Authentication 🔑

**Includes:**
- `AuthContext` with provider
- `useAuth` hook
- Login/logout/signup methods
- User state management
- Protected route support

**Usage:**
```tsx
const { user, isAuthenticated, login, logout } = useAuth();

await login(email, password);
```

**Integration Points:**
- Token storage (to implement)
- API authentication
- Route protection

---

### Push Notifications 🔔

**Includes:**
- `expo-notifications` package
- `expo-device` for device info
- Configuration in `app.config.ts`

**Setup Required:**
```typescript
// Register for notifications
import * as Notifications from 'expo-notifications';

const token = await Notifications.getExpoPushTokenAsync();
```

---

## Generated Files

Every app includes these essential files:

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `app.config.ts` | Expo configuration (bundle ID, icons, etc.) |
| `tsconfig.json` | TypeScript config (extends base) |
| `tamagui.config.ts` | Theme configuration |
| `babel.config.js` | Babel with Tamagui plugin |
| `metro.config.js` | Metro bundler (monorepo setup) |
| `jest.config.js` | Jest testing configuration |
| `.gitignore` | Git ignore rules |

### Source Files

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout with providers |
| `app/index.tsx` | Entry redirect |
| `app/(tabs)/_layout.tsx` | Tab navigation setup |
| `README.md` | App-specific documentation |

---

## Package.json Scripts

All generated apps include these scripts:

```json
{
  "start": "expo start",
  "ios": "expo start --ios",
  "android": "expo start --android",
  "web": "expo start --web",
  "test": "jest",
  "type-check": "tsc --noEmit",
  "lint": "eslint .",
  "format": "prettier --write \"**/*.{ts,tsx,json,md}\""
}
```

## Usage Examples

### Create Basic App

```bash
pnpm create-app

? App name (kebab-case): my-simple-app
? Display name: My Simple App
? Description: A basic starter app
? Choose a template: Basic - Simple tabs navigation
? Include GraphQL? No
? Package manager: pnpm
```

### Create Auth Flow App

```bash
pnpm create-app

? App name: auth-demo
? Display name: Auth Demo
? Description: App with authentication
? Choose a template: Auth Flow - Login, signup, and protected routes
? Include GraphQL? Yes
? Include push notifications? No
? Package manager: pnpm
```

### Create Chat App

```bash
pnpm create-app

? App name: team-chat
? Display name: Team Chat
? Description: Real-time messaging
? Choose a template: Chat - Real-time messaging interface
? Include authentication? Yes
? Include GraphQL? Yes
? Include push notifications? Yes
? Package manager: pnpm
```

---

## Post-Creation Steps

After creating an app:

### 1. Navigate to Your App
```bash
cd apps/your-app-name
```

### 2. Start Development Server
```bash
pnpm start
```

### 3. Run on Platform
```bash
# iOS simulator
pnpm ios

# Android emulator
pnpm android

# Web browser
pnpm web
```

### 4. Configure Environment Variables

Create `.env` file:
```bash
# GraphQL endpoint (if enabled)
EXPO_PUBLIC_GRAPHQL_ENDPOINT=https://api.example.com/graphql

# API keys
EXPO_PUBLIC_API_KEY=your-api-key
```

### 5. Implement Auth Logic (if enabled)

Update `contexts/AuthContext.tsx`:
```typescript
const login = async (email: string, password: string) => {
  // Call your auth API
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  const { token, user } = await response.json();
  
  // Store token
  await SecureStore.setItemAsync('authToken', token);
  
  setUser(user);
};
```

### 6. Add Custom Components

Import from `@bdt/components`:
```tsx
import {
  Modal,
  AlertDialog,
  ActionSheet,
  Checkbox,
  Switch,
  Spinner,
  OTPInput,
  PhoneInput,
} from '@bdt/components';
```

---

## Monorepo Integration

All generated apps automatically integrate with the monorepo:

### Shared Packages

Apps have access to:
- `@bdt/ui` - Theme tokens and Tamagui config
- `@bdt/components` - 35+ reusable components
- `@bdt/network` - GraphQL client and auth (optional)

### Turbo Pipelines

Apps participate in Turbo tasks:
```bash
# Build all apps
pnpm turbo run build

# Run tests across workspace
pnpm turbo run test

# Lint everything
pnpm turbo run lint
```

### Start Scripts

Root package.json automatically updated:
```json
{
  "scripts": {
    "start:my-app": "pnpm --filter @bdt/my-app start"
  }
}
```

---

## Customization Guide

### Change Tab Icons

Edit `app/(tabs)/_layout.tsx`:
```tsx
import { Home, Settings, User } from '@tamagui/lucide-icons';

<Tabs.Screen
  name="profile"
  options={{
    title: 'Profile',
    tabBarIcon: ({ color }) => <User color={color} />,
  }}
/>
```

### Add New Screen

1. Create file in `app/(tabs)/`:
```tsx
// app/(tabs)/profile.tsx
import { YStack, Text, H2 } from 'tamagui';

export default function ProfileScreen() {
  return (
    <YStack flex={1} padding="$4">
      <H2>Profile</H2>
    </YStack>
  );
}
```

2. Add to tab layout:
```tsx
<Tabs.Screen name="profile" options={{ title: 'Profile' }} />
```

### Add Protected Routes

Wrap with auth check:
```tsx
// app/_layout.tsx
import { useAuth } from '../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function RootLayout() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }
  
  return <Stack>...</Stack>;
}
```

### Customize Theme

Edit `tamagui.config.ts`:
```typescript
import { config as baseConfig } from '@bdt/ui';
import { createTamagui } from 'tamagui';

const customConfig = createTamagui({
  ...baseConfig,
  themes: {
    ...baseConfig.themes,
    light: {
      ...baseConfig.themes.light,
      primary: '#FF6B6B', // Custom primary color
    },
  },
});

export default customConfig;
```

---

## Troubleshooting

### Metro Cache Issues

```bash
pnpm start --clear
```

### TypeScript Errors

```bash
pnpm type-check
```

### Dependency Issues

```bash
# From app directory
pnpm install

# From monorepo root
pnpm install
```

### Build Errors

```bash
# Clean and rebuild
pnpm clean
pnpm build
```

---

## Advanced Usage

### Create App Programmatically

```typescript
import { execSync } from 'child_process';

const createApp = (name: string, template: string) => {
  execSync(`pnpm create-app`, {
    input: `${name}\n${name}\nDescription\n${template}\n\n\n\npnpm\n`,
    stdio: 'inherit',
  });
};

createApp('my-app', 'basic');
```

### Customize Templates

Templates are generated in `tools/src/create-app.ts`. You can:
1. Add new templates
2. Modify existing layouts
3. Include custom dependencies
4. Generate additional files

---

## Component Library Reference

### Available Components

**Atoms:**
- `Button` - Primary actions
- `Input` - Text input with validation
- `Checkbox` - Selection control
- `Radio` - Single selection
- `Switch` - Toggle control
- `Spinner` - Loading indicator
- `ProgressBar` - Progress visualization

**Molecules:**
- `OTPInput` - OTP verification
- `TextArea` - Multi-line input
- `RadioGroup` - Radio button group
- `PhoneInput` - Phone number input
- `SearchBar` - Search interface
- `TypingIndicator` - Chat typing status

**Organisms:**
- `Modal` - Dialog modal
- `AlertDialog` - Confirmation dialog
- `ActionSheet` - Bottom sheet actions
- `LoginForm` - Complete login form
- `SignupForm` - Registration form
- `OTPVerification` - OTP screen
- `ChatBubble` - Message display
- `ChatInput` - Message composition

See `COMPONENT_LIBRARY.md` for full API documentation.

---

## Best Practices

### 1. Use Semantic Tokens

```tsx
// ✅ Good - uses theme tokens
<YStack backgroundColor="$background" padding="$4">
  <Text color="$textWeak">Description</Text>
</YStack>

// ❌ Bad - hard-coded values
<YStack backgroundColor="#FFFFFF" padding={16}>
  <Text color="#666666">Description</Text>
</YStack>
```

### 2. Organize Components

```
components/
├── atoms/          # Small, reusable pieces
├── molecules/      # Combinations of atoms
└── organisms/      # Complex, feature-specific
```

### 3. Shared Logic in Hooks

```tsx
// hooks/useAuth.ts
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
```

### 4. Type Everything

```tsx
interface ProfileScreenProps {
  userId: string;
}

export default function ProfileScreen({ userId }: ProfileScreenProps) {
  // ...
}
```

### 5. Test Your Features

```tsx
// __tests__/LoginScreen.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../app/(auth)/login';

test('login form submission', () => {
  const { getByPlaceholderText, getByText } = render(<LoginScreen />);
  // Test logic
});
```

---

## Next Steps

- **Phase 4.1:** Create `packages/utils` with validation and formatters
- **Phase 4.2:** Extract `packages/auth` from network layer
- **Phase 4.3:** Complete documentation (Component Catalog)
- **Phase 4.4:** Final testing and demo app

---

## Support

For issues or questions:
1. Check `README.md` in monorepo root
2. Review `DEVELOPMENT.md` in `apps/carat-central`
3. Inspect generated app's `README.md`
4. See component examples in existing apps

**Happy building! 🚀**
