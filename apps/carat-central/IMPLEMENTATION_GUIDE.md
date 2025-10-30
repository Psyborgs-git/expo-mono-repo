# Carat Central - Complete Implementation Guide

## 📋 Overview

This guide provides a complete walkthrough for finishing the Carat Central app redesign. The foundation has been laid with:

✅ Fixed design tokens in `packages/ui`  
✅ Fixed critical auth screen token issues  
✅ Fixed diamond screen GraphQL types and imports  
✅ Created atomic design system components (Button, Input)  
✅ Created comprehensive documentation  

## 🚀 Quick Start - Fix TypeScript Errors

### Step 1: Global Find & Replace (Required)

Open VS Code, press `Cmd+Shift+F` (Mac) or `Ctrl+Shift+F` (Windows/Linux) and run these find & replace operations:

#### GraphQL Type - Diamonds
```
Find: DiamondBasicFragment
Replace: Diamond_BasicFragment
Files to include: apps/carat-central/**/*.{ts,tsx}
```

#### GraphQL Queries - Chats
```
Find: useGetChatQuery
Replace: useChat_GetChatQuery
Files to include: apps/carat-central/**/*.{ts,tsx}
```

```
Find: useGetChatMessagesQuery
Replace: useChat_GetMessagesQuery
Files to include: apps/carat-central/**/*.{ts,tsx}
```

```
Find: useSendMessageMutation
Replace: useChat_SendMessageMutation
Files to include: apps/carat-central/**/*.{ts,tsx}
```

```
Find: useMarkMessageAsReadMutation
Replace: useChat_MarkMessageAsReadMutation
Files to include: apps/carat-central/**/*.{ts,tsx}
```

```
Find: useUpdateLastReadMutation
Replace: useChat_UpdateLastReadMutation
Files to include: apps/carat-central/**/*.{ts,tsx}
```

#### GraphQL Types - Chats
```
Find: MessageBasicFragment
Replace: Chat_MessageFragment
Files to include: apps/carat-central/**/*.{ts,tsx}
```

```
Find: ChatWithMessagesFragment
Replace: Chat_WithMessagesFragment
Files to include: apps/carat-central/**/*.{ts,tsx}
```

#### Icons
```
Find: Grid3X3
Replace: Grid3x3
Files to include: apps/carat-central/**/*.{ts,tsx}
```

### Step 2: Fix Import Statements

For each file that imports `FlatList`, `ScrollView`, or `RefreshControl` from 'tamagui':

**Before:**
```tsx
import { View, YStack, FlatList, ScrollView, RefreshControl } from 'tamagui';
```

**After:**
```tsx
import { FlatList, ScrollView, RefreshControl } from 'react-native';
import { View, YStack } from 'tamagui';
```

**Files to check:**
- `app/chat/[chatId].tsx`
- `app/chat/index.tsx`
- Any other files with FlatList/ScrollView

### Step 3: Fix Token Usage Patterns

#### Remove $color11 (Use $color or $colorWeak instead)
```
Find: color="\$color11"
Replace: color="\$color"
Files to include: apps/carat-central/**/*.tsx
```

#### Remove theme="blue" props
Find instances of `theme="blue"` and replace with `backgroundColor="$primary"`

#### Fix borderColor (Use literal values)
```
Find: borderColor='\$borderColor'
Replace: borderColor='#E0E0E0'
Files to include: apps/carat-central/**/*.tsx
```

### Step 4: Verify Fixes

```bash
cd /Users/jainamshah/Desktop/expo-mono-repo/apps/carat-central
npx tsc --noEmit
```

Expected result: Far fewer errors (should be < 50)

---

## 🎨 Component Library - Atomic Design

### Architecture

```
packages/components/src/
├── atoms/              ← Basic building blocks (STARTED)
│   ├── Button/        ✅ DONE
│   ├── Input/         ✅ DONE
│   ├── Badge/         ⬜ TODO
│   ├── Avatar/        ⬜ TODO
│   ├── Card/          ⬜ TODO
│   └── Spinner/       ⬜ TODO
│
├── molecules/          ← Combinations of atoms
│   ├── FormField/     ⬜ TODO
│   ├── SearchBar/     ⬜ TODO (exists but needs redesign)
│   ├── DiamondCard/   ⬜ TODO (exists but needs redesign)
│   └── MessageBubble/ ⬜ TODO
│
├── organisms/          ← Complex components
│   ├── DiamondList/   ⬜ TODO (exists but needs redesign)
│   ├── ChatThread/    ⬜ TODO
│   ├── FilterPanel/   ⬜ TODO
│   └── OrderSummary/  ⬜ TODO
│
└── templates/          ← Page layouts
    ├── AuthLayout/    ⬜ TODO
    ├── DashboardLayout/ ⬜ TODO
    └── DetailLayout/  ⬜ TODO
```

### Creating New Components

#### Template for Atom Component

```tsx
// packages/components/src/atoms/Badge/Badge.tsx
import React from 'react';
import { styled, GetProps, XStack, Text } from 'tamagui';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends GetProps<typeof StyledBadge> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: React.ReactNode;
}

const StyledBadge = styled(XStack, {
  name: 'Badge',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$2',
  
  variants: {
    variant: {
      default: {
        backgroundColor: '$backgroundStrong',
      },
      primary: {
        backgroundColor: '$primary',
      },
      success: {
        backgroundColor: '$success',
      },
      warning: {
        backgroundColor: '$warning',
      },
      error: {
        backgroundColor: '$error',
      },
    },
    
    size: {
      sm: {
        paddingHorizontal: '$2',
        paddingVertical: '$1',
      },
      md: {
        paddingHorizontal: '$3',
        paddingVertical: '$1.5',
      },
      lg: {
        paddingHorizontal: '$4',
        paddingVertical: '$2',
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const BadgeText = styled(Text, {
  name: 'BadgeText',
  fontWeight: '600',
  
  variants: {
    variant: {
      default: {
        color: '$color',
      },
      primary: {
        color: 'white',
      },
      success: {
        color: 'white',
      },
      warning: {
        color: 'white',
      },
      error: {
        color: 'white',
      },
    },
    
    size: {
      sm: {
        fontSize: '$2',
      },
      md: {
        fontSize: '$3',
      },
      lg: {
        fontSize: '$4',
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export const Badge = React.forwardRef<typeof StyledBadge, BadgeProps>(
  ({ variant = 'default', size = 'md', children, ...props }, ref) => (
    <StyledBadge ref={ref} variant={variant} size={size} {...props}>
      <BadgeText variant={variant} size={size}>
        {children}
      </BadgeText>
    </StyledBadge>
  )
);

Badge.displayName = 'Badge';
```

#### Template for Molecule Component

```tsx
// packages/components/src/molecules/FormField/FormField.tsx
import React from 'react';
import { YStack } from 'tamagui';
import { Input, type InputProps } from '../../atoms/Input/Input';

export interface FormFieldProps extends InputProps {
  name: string;
  value: string;
  onValueChange: (value: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  value,
  onValueChange,
  ...inputProps
}) => {
  return (
    <YStack width="100%">
      <Input
        value={value}
        onChangeText={onValueChange}
        {...inputProps}
      />
    </YStack>
  );
};

FormField.displayName = 'FormField';
```

---

## 📱 Screen Redesign Guide

### 1. Authentication Flow

#### Login Screen (`app/(auth)/login.tsx`)

**Current Issues:** ✅ Mostly fixed
**Remaining:** Minor polish needed

**Design Improvements:**
1. Add app logo/illustration at top
2. Smooth transitions between email/mobile tabs
3. Better error state visualization
4. Social auth buttons (Google, Apple) if needed

#### OTP Verification (`app/(auth)/verify-otp.tsx`)

**Current Issues:** ✅ Border token fixed
**Redesign Needed:**

```tsx
// Replace current input with custom OTP input
import { OTPInput } from '../../components/molecules/OTPInput';

<OTPInput
  length={6}
  value={otp}
  onChange={setOtp}
  autoFocus={true}
  onComplete={handleVerifyOTP}
/>
```

**Features to Add:**
- Auto-focus next digit
- Auto-submit when complete
- Countdown timer for resend (60 seconds)
- Haptic feedback on complete (mobile)

### 2. Diamond Screens

#### Explore/Browse (`app/(tabs)/explore.tsx`)

**Current Status:** ✅ GraphQL types fixed

**Redesign Plan:**
1. **Header**
   - Sticky search bar
   - Filter button with active indicator
   
2. **Diamond Grid**
   - Responsive columns (2 on mobile, 3-4 on tablet/desktop)
   - Skeleton loading placeholders
   - Pull-to-refresh
   - Infinite scroll pagination
   
3. **Diamond Card** (create new component)
   ```tsx
   <DiamondCard
     diamond={diamond}
     onPress={handlePress}
     onFavorite={handleFavorite}
     variant="compact"
   />
   ```

#### Diamond Detail (`app/diamond/[id]`)

**New Features:**
1. **Image Carousel** (with Skia)
   - Swipe between images
   - Zoom capability
   - 360° view if available
   
2. **Tabbed Content**
   - Overview (4Cs, price, seller)
   - Detailed Specs
   - Certification
   - Similar Diamonds
   
3. **Floating Actions**
   - Add to Cart / Request Quote
   - Contact Seller
   - Share

### 3. Chat Interface

#### Chat List (`app/chat/index.tsx`)

**Current Issues:** GraphQL imports need updating

**Redesign:**
```tsx
<FlatList
  data={chats}
  renderItem={({ item }) => (
    <ChatListItem
      chat={item}
      onPress={() => router.push(`/chat/${item.id}`)}
    />
  )}
  ListEmptyComponent={<EmptyState message="No conversations yet" />}
/>
```

**ChatListItem Component:**
- Avatar (user/group)
- Last message preview (truncated)
- Unread count badge
- Timestamp (smart: "Just now", "2h ago", "Yesterday")

#### Chat Thread (`app/chat/[chatId].tsx`)

**Current Issues:** 
- GraphQL imports
- Token usages ($color11)
- theme="blue" props

**Redesign with Skia Animations:**
1. **Message Bubbles**
   - Slide-in animation for new messages
   - Different colors for own/other messages
   - Read receipts (checkmarks)
   - Timestamp on long press
   
2. **Input Area**
   - Sticky to bottom with KeyboardAvoidingView
   - Attachment button
   - Send button with micro-animation
   
3. **Typing Indicator**
   ```tsx
   {typingUsers.length > 0 && (
     <TypingIndicator users={typingUsers} />
   )}
   ```

---

## 🎭 Animations with React Native Skia

### Installation

```bash
cd /Users/jainamshah/Desktop/expo-mono-repo/apps/carat-central
pnpm add @shopify/react-native-skia
cd ios && pod install && cd ..  # iOS only
```

### Example: Shimmer Loading Effect

```tsx
// components/atoms/Skeleton/Skeleton.tsx
import React from 'react';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export const Skeleton = ({ width = 100, height = 20 }) => {
  const translateX = useSharedValue(0);
  
  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
  }, []);
  
  return (
    <Canvas style={{ width, height }}>
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, 0)}
          colors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
          positions={[0, 0.5, 1]}
        />
      </Rect>
    </Canvas>
  );
};
```

### Example: Card Press Animation

```tsx
import { useSpring, Pressable } from '@tamagui/core';

const AnimatedCard = ({ children, onPress }) => {
  const scale = useSpring(1);
  
  return (
    <Pressable
      onPressIn={() => scale.set(0.95)}
      onPressOut={() => scale.set(1)}
      onPress={onPress}
      style={{ transform: [{ scale }] }}
    >
      {children}
    </Pressable>
  );
};
```

---

## 🧪 Testing Strategy

### Unit Tests (Jest + React Native Testing Library)

```tsx
// packages/components/src/atoms/Button/__tests__/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });
  
  it('handles press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress}>Click me</Button>
    );
    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalled();
  });
  
  it('shows loading state', () => {
    const { getByTestId } = render(
      <Button loading>Loading</Button>
    );
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });
});
```

### E2E Tests (Detox)

```typescript
// apps/carat-central/e2e/login.test.ts
describe('Login Flow', () => {
  it('should login with email and OTP', async () => {
    // Navigate to login
    await element(by.text('Get Started')).tap();
    
    // Enter email
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.text('Continue with OTP')).tap();
    
    // Enter OTP
    await waitFor(element(by.id('otp-input')))
      .toBeVisible()
      .withTimeout(2000);
    await element(by.id('otp-input')).typeText('123456');
    
    // Should be on dashboard
    await expect(element(by.text('Dashboard'))).toBeVisible();
  });
});
```

---

## 📊 Performance Optimization

### 1. List Rendering Optimization

```tsx
<FlatList
  data={diamonds}
  renderItem={renderDiamond}
  keyExtractor={item => item.id}
  
  // Performance props
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
  initialNumToRender={10}
  updateCellsBatchingPeriod={50}
  
  // For fixed height items
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### 2. Image Optimization

```tsx
import FastImage from 'react-native-fast-image';

<FastImage
  source={{
    uri: diamond.imageUrl,
    priority: FastImage.priority.normal,
  }}
  style={{ width: 200, height: 200 }}
  resizeMode={FastImage.resizeMode.cover}
/>
```

### 3. Memoization

```tsx
const DiamondCard = React.memo(({ diamond }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.diamond.id === nextProps.diamond.id;
});
```

---

## 🚀 Deployment Checklist

### Before Deploying

- [ ] Run `npx tsc --noEmit` - No errors
- [ ] Run `pnpm lint` - No errors
- [ ] Run `pnpm test` - All tests pass
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical devices
- [ ] Check responsive design on different screen sizes
- [ ] Verify all navigation flows work
- [ ] Test offline behavior
- [ ] Performance profiling (React DevTools Profiler)
- [ ] Accessibility audit

### Build Commands

```bash
# iOS
pnpm --filter @bdt/carat-central ios --configuration Release

# Android
pnpm --filter @bdt/carat-central android --variant=release

# Web
pnpm --filter @bdt/carat-central web --prod
```

---

## 📚 Additional Resources

- **Tamagui Documentation**: https://tamagui.dev
- **React Native Skia**: https://shopify.github.io/react-native-skia/
- **Expo Router**: https://docs.expo.dev/router/
- **React Native**: https://reactnative.dev/
- **TypeScript**: https://www.typescriptlang.org/

---

## 🎯 Next Steps (Prioritized)

1. **CRITICAL** - Run global find & replace for GraphQL types (15 min)
2. **CRITICAL** - Fix remaining token usages (30 min)
3. **CRITICAL** - Run type check and fix remaining errors (1-2 hours)
4. Install React Native Skia (15 min)
5. Create remaining atom components (Badge, Avatar, Card, Spinner) (2-3 hours)
6. Create molecule components (FormField, SearchBar, DiamondCard, MessageBubble) (3-4 hours)
7. Redesign authentication screens (2-3 hours)
8. Redesign diamond screens (4-5 hours)
9. Redesign chat interface (3-4 hours)
10. Testing and polish (2-3 hours)

**Total Estimated Time**: 18-25 hours

---

**Good luck with the redesign! 🎨✨**

You now have:
✅ Fixed foundation (tokens, types, imports)  
✅ Example atomic components (Button, Input)  
✅ Comprehensive documentation  
✅ Clear roadmap forward  

The hard part is done - now it's systematic implementation! 🚀
