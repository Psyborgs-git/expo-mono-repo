# Parallax Dating App

A modern dating app built with Expo featuring AI-powered profile generation, video calls, and intelligent matching.

## Features

- 🎯 **Smart Matching** - AI-powered compatibility scoring
- 💬 **Real-time Chat** - Message your matches instantly
- 📸 **Profile Customization** - Photos, bio, and traits
- 🤖 **AI Bio Generation** - Generate witty, sincere, or short bios
- 📹 **Video Calls** - Connect face-to-face with matches
- 🌍 **Location-based** - Find matches nearby
- 🎨 **Beautiful UI** - Built with Tamagui design system

## Tech Stack

- **Framework**: Expo SDK 54 + React Native
- **Navigation**: Expo Router (file-based routing)
- **UI**: Tamagui + shared components from `@bdt/components`
- **State**: Mock API (GraphQL-ready architecture)
- **Animations**: @shopify/react-native-skia
- **Camera**: react-native-vision-camera
- **Permissions**: expo-location, expo-contacts, expo-haptics, expo-media-library

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8.15+
- Expo CLI
- iOS Simulator or Android Emulator (for native features)

### Installation

From the monorepo root:

```bash
# Install dependencies
pnpm install

# Start the app
pnpm start:parallax
```

### Running on Platforms

```bash
# iOS
pnpm --filter @bdt/parallax ios

# Android
pnpm --filter @bdt/parallax android

# Web
pnpm --filter @bdt/parallax web
```

### Custom Dev Client (Required for Camera & Skia)

Since this app uses `react-native-vision-camera` and `@shopify/react-native-skia`, you need to build a custom dev client:

#### Local Development Build

```bash
# iOS
pnpm --filter @bdt/parallax ios

# Android
pnpm --filter @bdt/parallax android
```

#### EAS Build (Recommended for Team Development)

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
cd apps/parallax
eas build:configure
```

3. Build development client:
```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

4. Install the build on your device and run:
```bash
pnpm start:parallax
```

## Project Structure

```
apps/parallax/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation
│   │   ├── _layout.tsx           # Tabs layout
│   │   ├── index.tsx             # Chats tab
│   │   ├── explore.tsx           # Explore tab
│   │   └── profile.tsx           # Profile tab
│   ├── chats/
│   │   └── [chatId].tsx          # Chat details (dynamic route)
│   ├── profile/
│   │   └── edit.tsx              # Edit profile with AI
│   ├── videocall/
│   │   └── index.tsx             # Video call modal
│   └── _layout.tsx               # Root layout
├── src/
│   ├── lib/
│   │   ├── types.ts              # TypeScript types
│   │   ├── mocks.ts              # Mock data
│   │   ├── mockApi.ts            # Mock API implementation
│   │   ├── api.ts                # API switch (mock/GraphQL)
│   │   ├── ai.ts                 # AI bio generation
│   │   └── videoProvider.ts      # Video call provider
│   ├── hooks/
│   │   ├── usePermissions.ts     # Permission management
│   │   └── useMockAuth.ts        # Mock authentication
│   └── components/               # App-specific components
├── app.config.ts                 # Expo configuration
├── package.json
└── README.md
```

## Mock API

The app currently uses a mock API layer for rapid development. All API calls go through `src/lib/api.ts`, which exports a single `api` object.

### Available API Methods

```typescript
// Get current user
const user = await api.getCurrentUser();

// Get chats
const chats = await api.getChats();

// Get chat messages
const { items, nextCursor } = await api.getChatMessages(chatId, cursor);

// Search explore cards
const { items, nextCursor } = await api.searchExplore({ cursor, filters });

// Update profile
const updatedUser = await api.updateProfile(userId, { name, bio });

// Generate AI bio
const { suggestions } = await api.generateBio(traits, 'witty');

// Send message
const message = await api.sendMessage(chatId, content);
```

## AI Features

### Bio Generation

The app includes an AI stub for generating profile bios:

```typescript
import { generateBio } from './src/lib/ai';

const suggestions = await generateBio(['adventurous', 'foodie'], 'witty');
// Returns: ["Professional over-thinker and amateur chef...", ...]
```

**Tones**: `witty`, `sincere`, `short`

**Future Integration**: Replace `EXPO_PUBLIC_AI_PROVIDER` with `openai`, `anthropic`, etc.

## Video Calls

### Mock Video Provider

The app uses a pluggable video provider pattern:

```typescript
import { getVideoProvider } from './src/lib/videoProvider';

const provider = getVideoProvider(); // Returns MockVideoProvider by default
await provider.init({ userId: 'user-123' });
await provider.join('room-123');
```

**Events**: `joined`, `left`, `error`, `stream`

**Future Integration**: Set `EXPO_PUBLIC_VIDEO_PROVIDER` to `agora`, `twilio`, etc.

## Permissions

The app requests permissions on-demand:

- **Camera**: For profile photos and video calls
- **Microphone**: For video calls
- **Location**: For finding nearby matches
- **Contacts**: For friend suggestions (optional)
- **Media Library**: For uploading profile photos

Use the `usePermissions` hook:

```typescript
import { usePermissions } from './src/hooks/usePermissions';

const { permissions, requestCameraPermission } = usePermissions();

if (permissions.camera !== 'granted') {
  await requestCameraPermission();
}
```

## Environment Variables

Create a `.env` file in the app root:

```bash
# API Configuration
EXPO_PUBLIC_USE_MOCK_API=true           # Set to 'false' to use GraphQL
EXPO_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8002/graphql

# AI Provider (future)
EXPO_PUBLIC_AI_PROVIDER=mock            # openai, anthropic, etc.
EXPO_PUBLIC_AI_API_KEY=your-key-here

# Video Provider (future)
EXPO_PUBLIC_VIDEO_PROVIDER=mock         # agora, twilio, etc.
EXPO_PUBLIC_VIDEO_API_KEY=your-key-here
```

## Migrating to GraphQL

When ready to switch from mock API to real GraphQL:

### Step 1: Update Environment

```bash
# .env
EXPO_PUBLIC_USE_MOCK_API=false
EXPO_PUBLIC_GRAPHQL_ENDPOINT=https://api.parallax.love/graphql
```

### Step 2: Implement GraphQL Adapter

Create `src/lib/graphqlAdapter.ts`:

```typescript
import { ApolloClient } from '@apollo/client';
import { MockApi } from './mockApi';

export const graphqlAdapter: MockApi = {
  async getCurrentUser() {
    const { data } = await client.query({ query: ME_QUERY });
    return mapUserFromGraphQL(data.me);
  },
  // ... implement other methods
};
```

### Step 3: Update API Switch

```typescript
// src/lib/api.ts
import { mockApi } from './mockApi';
import { graphqlAdapter } from './graphqlAdapter';

const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';
export const api = USE_MOCK ? mockApi : graphqlAdapter;
```

### Step 4: Test & Deploy

```bash
# Test locally
pnpm start:parallax

# Run tests
pnpm --filter @bdt/parallax test

# Deploy
eas update --branch production
```

## Development Scripts

```bash
# Start development server
pnpm start

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type check
pnpm type-check

# Format code
pnpm format
```

## Testing

Unit tests are located in `__tests__/`:

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test mockApi.test.ts

# Coverage report
pnpm test:coverage
```

## Security & Privacy

- ✅ **Permission Prompts**: Explicit consent for all device access
- ✅ **No PII Logging**: User data not logged in development
- ✅ **Secure Storage**: Tokens stored securely (when implemented)
- ✅ **HTTPS Only**: Production GraphQL endpoint must use HTTPS

## Troubleshooting

### Camera not working

Ensure you've built a custom dev client:
```bash
pnpm --filter @bdt/parallax ios
```

### Permissions denied

Reset permissions in iOS Settings > Parallax or Android Settings > Apps > Parallax.

### Build errors with Skia

Clear cache and rebuild:
```bash
pnpm start -- --clear
rm -rf node_modules
pnpm install
```

## Contributing

1. Create a feature branch
2. Make changes
3. Run `pnpm lint && pnpm test && pnpm type-check`
4. Submit a pull request

## License

MIT

## Support

- **Issues**: https://github.com/Psyborgs-git/expo-mono-repo/issues
- **Docs**: See monorepo README.md
- **API Spec**: See `API_DOC.md`

---

**Built with ❤️ using Expo, Tamagui, and React Native**

