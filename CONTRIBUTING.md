# Contributing to Expo Monorepo

Thank you for contributing! This guide will help you get started.

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start an app:**
   ```bash
   pnpm start:carat-central  # or start:vloop, start:parallax
   ```

3. **Run tests:**
   ```bash
   pnpm test
   pnpm type-check
   pnpm lint
   ```

## Creating a New App

Use the CLI tool to scaffold a new app:

```bash
pnpm create-app
```

This will guide you through creating a new app with the following options:
- **Templates**: Basic, Auth Flow, Chat, or Dashboard
- **Features**: Authentication, GraphQL, Push Notifications
- **Package Manager**: pnpm, npm, or yarn

Or run it directly:

```bash
tsx tools/src/create-app.ts
```

## Creating a New Package

For expo-modules or shared packages:

```bash
pnpm create-package
```

This will create a new package with the appropriate structure for:
- Component libraries
- Utility packages
- Native expo-modules

## Project Structure

```
expo-mono-repo/
├── apps/                 # Applications
│   ├── carat-central/
│   ├── vloop/
│   └── parallax/
├── packages/             # Shared packages
│   ├── components/       # UI components (atoms, molecules, organisms)
│   ├── ui/              # Design tokens and Tamagui config
│   ├── network/         # GraphQL & auth
│   └── config/          # Shared configs
└── tools/               # CLI and build tools
```

## Component Development

### Using Shared Components

All apps should use components from `@bdt/components`:

```tsx
import { LoginForm, SignupForm, ChatThread } from '@bdt/components';
```

### Creating a New Component

1. Add component to `packages/components/src/` in the appropriate folder:
   - `atoms/` - Basic UI elements (Button, Input, Card)
   - `molecules/` - Composed components (FormField, SearchBar)
   - `organisms/` - Complex flows (LoginForm, ChatThread)

2. Export from the index file:
   ```tsx
   // packages/components/src/organisms/index.ts
   export * from './MyNewComponent';
   ```

3. Use Tamagui tokens for theming:
   ```tsx
   import { YStack, Text } from 'tamagui';
   
   export const MyComponent = () => (
     <YStack backgroundColor="$background" padding="$4">
       <Text color="$color" fontSize="$5">Themed content</Text>
     </YStack>
   );
   ```

### App-Specific Components

Only create components in `apps/*/components/` when they:
- Contain business logic specific to that app
- Are not reusable across other apps
- Use app-specific data models or APIs

## Theming

All components use Tamagui for theming. Customize themes in `packages/ui/`:

1. **Tokens** - Design primitives (colors, spacing, radii)
   - Edit `packages/ui/src/tokens.ts`

2. **Themes** - Light and dark mode mappings
   - Edit `packages/ui/src/themes.ts`

3. **App-Level Customization** - Override in app's `tamagui.config.ts`

See [THEMING_GUIDE.md](./THEMING_GUIDE.md) for details.

## Pre-Built Flows

The component library includes ready-to-use flows:

### Authentication
- `LoginForm` - Email/password login with remember me
- `SignupForm` - User registration
- `OTPVerification` - Phone/email OTP verification

### Chat
- `ChatThread` - Message list with avatars
- `ChatInput` - Message composer
- `MessageBubble` - Individual message

### UI
- `AlertDialog` - Confirmation dialogs
- `Modal` - Overlay modals
- `ActionSheet` - Bottom sheet actions

Usage:
```tsx
import { LoginForm } from '@bdt/components';

<LoginForm
  onSubmit={handleLogin}
  onSignUp={() => router.push('/signup')}
  onForgotPassword={() => router.push('/forgot')}
/>
```

## GraphQL & Networking

Use the `@bdt/network` package for API calls:

```tsx
import { createApolloClient, AuthManager } from '@bdt/network';

const authManager = new AuthManager({
  tokenEndpoint: 'https://api.example.com/auth/token',
});

const client = createApolloClient({
  graphqlEndpoint: 'https://api.example.com/graphql',
  authManager,
});
```

See [NETWORK_LAYER_API.md](./NETWORK_LAYER_API.md) for details.

## Testing

### Unit Tests
```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @bdt/components test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
pnpm lint
pnpm lint:fix
```

## Code Style

- Use TypeScript for all new code
- Use Tamagui components instead of React Native primitives
- Use semantic color tokens (`$background`, `$color`) not hardcoded values
- Follow existing file structure and naming conventions
- Add JSDoc comments for public APIs

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm type-check`, `pnpm lint`, and `pnpm test`
4. Update documentation if needed
5. Submit a pull request

## Common Issues

### Metro bundler cache
```bash
pnpm start:carat-central -- --clear
```

### Type errors after adding dependencies
```bash
pnpm type-check
```

### Shared component not updating
```bash
# Rebuild the package
pnpm --filter @bdt/components build
```

## Need Help?

- Check existing documentation in the root directory
- Review component examples in `packages/components/src/`
- Look at app implementations in `apps/*/`

## License

MIT
