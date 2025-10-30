# Carat Central App Redesign Summary

## Current Status

### ✅ Completed Fixes

1. **Design System Tokens** (`packages/ui/src/themes.ts`)
   - Added `color11` token for Tamagui v4 compatibility
   - Added `borderFocus` token
   - Fixed syntax errors in theme definitions
   - Ensured both light and dark themes have consistent token structure

2. **GraphQL Type Imports - Diamonds** (`app/(tabs)/explore.tsx`, `app/(tabs)/inventory.tsx`)
   - `DiamondBasicFragment` → `Diamond_BasicFragment`
   - All diamond-related screens updated

3. **Tamagui Component Imports** (`app/(tabs)/inventory.tsx`)
   - Moved `FlatList`, `RefreshControl` to `react-native` imports
   - Fixed `Grid3X3` → `Grid3x3` icon import
   - Fixed button variant props (removed `filled` and `ghost`)

4. **Token Usage Fixes**
   - Fixed `borderColor` token usage in auth screens (login, verify-otp, organization-select)
   - Fixed `$color`, `$colorStrong` token usage in account screen
   - Removed invalid transparent background uses
   - Fixed bulk action function signatures in inventory

### 🔧 Remaining Critical Fixes Needed

1. **Chat Screens** (`app/chat/[chatId].tsx`, `app/chat/index.tsx`, etc.)
   - Update GraphQL imports:
     - `useGetChatQuery` → `useChat_GetChatQuery`
     - `useGetChatMessagesQuery` → `useChat_GetMessagesQuery`
     - `useSendMessageMutation` → `useChat_SendMessageMutation`
     - `MessageBasicFragment` → `Chat_MessageFragment`
     - `ChatWithMessagesFragment` → `Chat_WithMessagesFragment`
   - Fix token usages (`$color11` → `$color` or `$colorWeak`)
   - Remove `theme="blue"` props
   - Fix `ScrollView` import

2. **Search Screen** (`app/(tabs)/search.tsx`)
   - Remove unused imports (Switch, X, Star, Bell)
   - Remove unused state variables (showSavedSearches, showSearchHistory, etc.)
   - Implement or remove incomplete features

3. **Diamond Components**
   - Update all diamond component imports in `components/diamond/`
   - Fix `DiamondBasicFragment` → `Diamond_BasicFragment` across all component files

4. **Organization Screens**
   - Fix token usages in organization screens
   - Update any GraphQL type imports
   - Fix button variants

### 📋 Systematic Fix Approach

#### Step 1: Run Global Find & Replace (VS Code)

**Find:** `DiamondBasicFragment`  
**Replace:** `Diamond_BasicFragment`  
**In:** `apps/carat-central/**/*.{ts,tsx}`

**Find:** `useGetChatQuery`  
**Replace:** `useChat_GetChatQuery`  
**In:** `apps/carat-central/**/*.{ts,tsx}`

**Find:** `useGetChatMessagesQuery`  
**Replace:** `useChat_GetMessagesQuery`  
**In:** `apps/carat-central/**/*.{ts,tsx}`

**Find:** `useSendMessageMutation`  
**Replace:** `useChat_SendMessageMutation`  
**In:** `apps/carat-central/**/*.{ts,tsx}`

**Find:** `useMarkMessageAsReadMutation`  
**Replace:** `useChat_MarkMessageAsReadMutation`  
**In:** `apps/carat-central/**/*.{ts,tsx}`

**Find:** `useUpdateLastReadMutation`  
**Replace:** `useChat_UpdateLastReadMutation`  
**In:** `apps/carat-central/**/*.{ts,tsx}`

**Find:** `MessageBasicFragment`  
**Replace:** `Chat_MessageFragment`  
**In:** `apps/carat-central/**/*.{ts,tsx}`

**Find:** `ChatWithMessagesFragment`  
**Replace:** `Chat_WithMessagesFragment`  
**In:** `apps/carat-central/**/*.{ts,tsx}`

**Find:** `Grid3X3`  
**Replace:** `Grid3x3`  
**In:** `apps/carat-central/**/*.{ts,tsx}`

#### Step 2: Fix Token Usages

**Find:** `color="\$color11"`  
**Replace:** `color="\$color"`  
**In:** `apps/carat-central/**/*.tsx`

**Find:** `color="\$colorStrong"`  
**Replace:** `color="\$color"`  
**In:** `apps/carat-central/**/*.tsx`

**Find:** `theme="blue"`  
**Replace:** (remove this prop or use `backgroundColor="\$primary"`)  
**In:** `apps/carat-central/**/*.tsx`

#### Step 3: Fix Import Statements

For files using `FlatList`, `RefreshControl`, or `ScrollView`:

```tsx
// BEFORE
import { View, YStack, FlatList, ScrollView, RefreshControl } from 'tamagui';

// AFTER
import { FlatList, ScrollView, RefreshControl } from 'react-native';
import { View, YStack } from 'tamagui';
```

#### Step 4: Run Type Check

```bash
cd /Users/jainamshah/Desktop/expo-mono-repo/apps/carat-central
npx tsc --noEmit 2>&1 | tee type-errors.log
```

Review `type-errors.log` and fix remaining errors.

---

## App Redesign Plan

### Design Principles

1. **Single Responsibility**: Each component does ONE thing well
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Responsive by Default**: Works beautifully on all screen sizes
4. **Accessible**: Proper labels, contrast, and keyboard navigation
5. **Performant**: Lazy loading, pagination, optimistic updates

### Component Architecture

```
packages/components/src/
├── atoms/                    # Basic building blocks
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.types.ts
│   │   └── Button.test.tsx
│   ├── Input/
│   ├── Badge/
│   ├── Avatar/
│   └── Card/
├── molecules/                # Combinations of atoms
│   ├── FormField/           # Label + Input + Error
│   ├── SearchBar/           # Input + Filter button
│   ├── DiamondCard/         # Image + Specs + Price
│   └── MessageBubble/       # Avatar + Text + Timestamp
├── organisms/               # Complex feature components
│   ├── DiamondList/        # Grid/List of diamonds with pagination
│   ├── ChatThread/         # Full chat conversation
│   ├── FilterPanel/        # Advanced filter sheet
│   └── OrderSummary/       # Order details and actions
└── templates/              # Page-level layouts
    ├── AuthLayout/
    ├── DashboardLayout/
    └── DetailLayout/
```

### Screen Redesigns

#### 1. Authentication Flow (`app/(auth)/`)

**Login Screen** - Modern, minimal design
- Large app logo/name at top
- Segmented control for Email/Mobile/WhatsApp
- Single input field with proper keyboard type
- Large CTA button
- Subtle link to terms/privacy

**OTP Verification** - Focus on input
- 6-digit code input with auto-focus between digits
- Resend timer (60 seconds)
- Clear error messages
- Auto-submit when complete

**Organization Select** - Card-based selection
- Search bar at top
- Cards showing org name, logo, member count
- Active indicator
- Create new organization option

#### 2. Diamond Screens

**Explore/Browse** (`app/(tabs)/explore.tsx`)
- Sticky search bar with filter icon
- 2-column grid on mobile, 3-4 on tablet/web
- Smooth scroll with pull-to-refresh
- Shimmer loading placeholders
- Empty state with "Explore diamonds" illustration

**Diamond Card** (Component)
- High-quality image with lazy loading
- 4Cs prominently displayed
- Price with currency formatting
- Badge for certification (GIA, etc.)
- Quick action buttons (favorite, share, contact)
- Skeleton loader variant

**Diamond Detail** (`app/diamond/[id]`)
- Image carousel (Skia animations)
- Tabbed interface: Overview, Specs, Certification
- Similar diamonds section (horizontal scroll)
- Floating action button for "Add to cart" / "Contact seller"

**Inventory** (`app/(tabs)/inventory.tsx`)
- Grid/List toggle
- Bulk selection mode
- Quick filters (status, published, etc.)
- Search within inventory
- Floating action button for "Add Diamond"

#### 3. Chat Interface (`app/chat/`)

**Chat List** (`app/chat/index.tsx`)
- Unread count badges
- Last message preview
- Timestamp (smart formatting)
- Pull-to-refresh
- Search chats
- Empty state: "No conversations yet"

**Chat Thread** (`app/chat/[chatId].tsx`)
- WhatsApp-style bubbles
- Send message input sticky to bottom
- Typing indicator
- Read receipts (checkmarks)
- Timestamp groups (Today, Yesterday, etc.)
- Media attachment preview
- Scroll-to-bottom button when not at bottom

#### 4. Orders & Requests

**Order List**
- Status-based filtering
- Order cards with summary
- Swipe actions (cancel, view details)

**Request/Response**
- Request card showing diamond specs needed
- Response submission form
- Match percentage indicator

### Animation Strategy (React Native Skia)

1. **List Animations**
   - Fade-in on scroll
   - Stagger children animations
   - Pull-to-refresh indicator

2. **Card Interactions**
   - Scale on press
   - Swipe gestures
   - Shimmer loading effect

3. **Page Transitions**
   - Shared element transitions (images)
   - Slide-in modals
   - Fade overlays

4. **Microinteractions**
   - Button press feedback
   - Icon transitions
   - Success/error toasts

### Responsive Breakpoints

```tsx
// From packages/ui/tamagui.config.ts
xs: { maxWidth: 660 }       // Mobile portrait
sm: { maxWidth: 800 }       // Mobile landscape  
md: { maxWidth: 1020 }      // Small tablet
lg: { maxWidth: 1280 }      // Desktop
xl: { maxWidth: 1420 }      // Large desktop
```

**Component Adaptations:**
- `$xs`: 1-2 columns, full-width cards
- `$sm`: 2-3 columns, compact navigation
- `$md`: 3-4 columns, expanded filters
- `$lg+`: 4+ columns, side navigation, advanced features

### Performance Optimizations

1. **List Rendering**
   ```tsx
   <FlatList
     data={diamonds}
     renderItem={renderDiamond}
     keyExtractor={item => item.id}
     removeClippedSubviews={true}
     maxToRenderPerBatch={10}
     windowSize={10}
     getItemLayout={getItemLayout} // for fixed height items
   />
   ```

2. **Image Loading**
   ```tsx
   <Image
     source={{ uri: diamond.image }}
     resizeMode="cover"
     placeholder={{ blurhash }}
     transition={200}
   />
   ```

3. **Code Splitting**
   - Lazy load screens not in initial view
   - Dynamic imports for heavy components
   - Suspense boundaries

---

## Implementation Timeline

### Week 1: Foundation
- ✅ Fix all TypeScript errors
- Install and configure React Native Skia
- Create base atom components (Button, Input, Card, Badge, Avatar)
- Set up Storybook (optional) for component development

### Week 2: Core Components
- Build molecule components (FormField, SearchBar, DiamondCard, MessageBubble)
- Build organism components (DiamondList, ChatThread, FilterPanel)
- Implement responsive behavior with media queries
- Add Skia animations to key interactions

### Week 3: Screen Redesigns
- Redesign auth flow (Login → OTP → Org Select)
- Redesign diamond screens (Explore, Detail, Inventory)
- Redesign chat interface (List, Thread)
- Implement smooth page transitions

### Week 4: Polish & Testing
- E2E testing with Detox
- Accessibility audit
- Performance profiling
- User testing & iteration
- Documentation

---

## Key Files Modified

✅ `packages/ui/src/themes.ts` - Fixed tokens  
✅ `apps/carat-central/app/(auth)/login.tsx` - Fixed tokens  
✅ `apps/carat-central/app/(auth)/verify-otp.tsx` - Fixed tokens  
✅ `apps/carat-central/app/(auth)/organization-select.tsx` - Fixed tokens  
✅ `apps/carat-central/app/(tabs)/account.tsx` - Fixed $color tokens  
✅ `apps/carat-central/app/(tabs)/explore.tsx` - Fixed GraphQL types  
✅ `apps/carat-central/app/(tabs)/inventory.tsx` - Fixed imports & tokens  

🔄 Needs Fix:
- `app/chat/[chatId].tsx` - GraphQL imports, tokens
- `app/chat/index.tsx` - GraphQL imports, tokens  
- `app/chat/contacts.tsx` - GraphQL imports, tokens
- `app/chat/profile/[userId].tsx` - GraphQL imports, tokens
- `app/(tabs)/search.tsx` - Remove unused code
- `components/diamond/*` - Update GraphQL types
- `components/chat/*` - Update GraphQL types
- `components/orders/*` - Update GraphQL types
- `components/requests/*` - Update GraphQL types
- `hooks/*` - Update GraphQL types

---

## Next Steps

1. **Run the global find & replace operations** listed in Step 1 above
2. **Fix remaining import statements** for React Native components
3. **Run type check** and fix any remaining errors
4. **Install React Native Skia**:
   ```bash
   cd /Users/jainamshah/Desktop/expo-mono-repo/apps/carat-central
   pnpm add @shopify/react-native-skia
   cd ios && pod install && cd ..
   ```
5. **Start creating the new component library** in `packages/components/src/atoms/`
6. **Gradually replace old screens** with redesigned versions

---

## Resources

- [Quick Fix Guide](./QUICK_FIX_GUIDE.md) - Immediate fixes to get app compiling
- [Frontend Developer Guide](./FRONTEND_DEVELOPER_GUIDE.md) - Architecture and patterns
- [Tamagui Documentation](https://tamagui.dev) - UI component library
- [React Native Skia](https://shopify.github.io/react-native-skia/) - Graphics and animations
- [Expo Router](https://docs.expo.dev/router/) - File-based routing

---

**Status**: Foundation fixes completed. Ready for systematic GraphQL type updates and component library development.
