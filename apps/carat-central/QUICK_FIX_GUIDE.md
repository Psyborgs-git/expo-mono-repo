# Quick Fix Guide for Carat Central TypeScript Errors

## Phase 1: Critical Fixes (Run These First)

### 1. Install React Native Skia
```bash
cd /Users/jainamshah/Desktop/expo-mono-repo/apps/carat-central
pnpm add @shopify/react-native-skia
cd ios && pod install && cd ..  # iOS only
```

### 2. Global Find & Replace (Use VS Code Find in Files)

#### GraphQL Type Imports - Diamonds
- Find: `DiamondBasicFragment`
- Replace: `Diamond_BasicFragment`
- Files: `app/**/*.tsx`, `components/**/*.tsx`, `hooks/**/*.tsx`

#### GraphQL Type Imports - Chats
- Find: `useGetChatQuery`
- Replace: `useChat_GetChatQuery`

- Find: `useGetChatMessagesQuery`
- Replace: `useChat_GetMessagesQuery`

- Find: `useSendMessageMutation`
- Replace: `useChat_SendMessageMutation`

- Find: `useMarkMessageAsReadMutation`
- Replace: `useChat_MarkMessageAsReadMutation`

- Find: `useUpdateLastReadMutation`
- Replace: `useChat_UpdateLastReadMutation`

- Find: `MessageBasicFragment`
- Replace: `Chat_MessageFragment`

- Find: `ChatWithMessagesFragment`
- Replace: `Chat_WithMessagesFragment`

#### Icon Imports
- Find: `Grid3X3`
- Replace: `Grid3x3`
- Files: All `.tsx` files

#### React Native Imports (Manual per file)
In files importing from 'tamagui':
- Move `FlatList` to `import { FlatList } from 'react-native'`
- Move `RefreshControl` to `import { RefreshControl } from 'react-native'`
- Move `ScrollView` to `import { ScrollView } from 'react-native'`

### 3. Fix Token Usage Patterns

#### Color Tokens
Find and replace these patterns:

- `color="$color11"` → `color="$color"`
- `color="$colorStrong"` → `color="$color"`
- `color="$colorWeak"` → `color="$colorWeak"` (keep as is, this is valid)

#### Border Tokens
- `borderColor="$borderColor"` → Remove the quotes, use: `borderColor={theme.borderColor}` or `borderColor="#E0E0E0"`
  OR better: `borderColor="$borderColor"` is actually valid, the issue is TypeScript definitions

#### Background Tokens  
- `backgroundColor="transparent"` → `backgroundColor="$backgroundTransparent"` or use lowercase `"transparent"` (without $)

### 4. Fix Button Variants
Find: `variant="filled"` or `variant="ghost"`
Replace with one of: `variant="outlined"` or remove the variant prop entirely

### 5. Fix Theme Props
Find: `theme="blue"`
Replace: Remove the theme prop and use `backgroundColor="$primary"` instead

## Phase 2: Component Redesign (After Fixes)

### Create New Component Library Structure

```
packages/components/src/
├── atoms/
│   ├── Button.tsx          # Enhanced button with loading states
│   ├── Input.tsx           # Form input with validation
│   ├── Badge.tsx           # Status badges
│   ├── Avatar.tsx          # User avatars
│   └── Card.tsx            # Base card component
├── molecules/
│   ├── FormField.tsx       # Label + Input + Error
│   ├── SearchBar.tsx       # Search with filters
│   ├── DiamondCard.tsx     # Diamond display card
│   └── MessageBubble.tsx   # Chat message bubble
├── organisms/
│   ├── DiamondList.tsx     # Diamond grid/list
│   ├── ChatThread.tsx      # Chat conversation
│   ├── FilterPanel.tsx     # Advanced filters
│   └── OrderSummary.tsx    # Order details
└── index.ts                # Export all components
```

### Screen Redesign Priority

1. **Auth Screens** (`app/(auth)/`)
   - Modern OTP input with auto-focus
   - Smooth transitions between steps
   - Clear error states

2. **Diamond Screens** (`app/diamond/`, `app/(tabs)/explore.tsx`)
   - Beautiful card layouts
   - Smooth list animations with Skia
   - Advanced filters with bottom sheet
   - Responsive grid (2-3 columns based on screen size)

3. **Chat Interface** (`app/chat/`)
   - WhatsApp-like message bubbles
   - Typing indicators
   - Smooth scroll-to-bottom
   - Media previews

4. **Inventory** (`app/(tabs)/inventory.tsx`)
   - Bulk selection with animations
   - Quick actions menu
   - Status indicators
   - Drag-to-reorder (future)

## Phase 3: Testing & Polish

### Run Type Check
```bash
cd /Users/jainamshah/Desktop/expo-mono-repo/apps/carat-central
npx tsc --noEmit
```

### Common Remaining Errors

**Error**: `Type 'string' is not assignable to type 'GetThemeValueForKey'`
**Fix**: This usually means you're using a token that doesn't exist. Check `packages/ui/src/themes.ts`

**Error**: `Module has no exported member 'X'`
**Fix**: Check the generated GraphQL file for the correct export name

**Error**: `Property 'X' does not exist on type 'Y'`
**Fix**: Usually a prop that was removed in Tamagui v4. Check Tamagui docs for the correct prop name

## Phase 4: Performance & UX

### Responsive Design
Use Tamagui's media queries:
```tsx
<YStack
  $xs={{ flexDirection: 'column' }}
  $gtMd={{ flexDirection: 'row' }}
>
```

### Animations with Skia
```tsx
import { Canvas, Circle, Group } from '@shopify/react-native-skia';

<Canvas style={{ flex: 1 }}>
  <Circle cx={128} cy={128} r={64} color="lightblue" />
</Canvas>
```

### Loading States
```tsx
import { Skeleton } from '@tamagui/lucide-icons';

{loading && <Skeleton width="100%" height={200} />}
```

## Helpful Commands

```bash
# Type check only
pnpm --filter @bdt/carat-central run type-check

# Start dev server
pnpm --filter @bdt/carat-central start

# Run on specific platform
pnpm --filter @bdt/carat-central ios
pnpm --filter @bdt/carat-central android
pnpm --filter @bdt/carat-central web

# Lint & Format
pnpm --filter @bdt/carat-central lint
pnpm --filter @bdt/carat-central format

# Clear cache and restart
pnpm --filter @bdt/carat-central start --clear
```

## Resources

- [Tamagui v4 Docs](https://tamagui.dev)
- [React Native Skia Docs](https://shopify.github.io/react-native-skia/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [GraphQL Codegen](https://the-guild.dev/graphql/codegen)
