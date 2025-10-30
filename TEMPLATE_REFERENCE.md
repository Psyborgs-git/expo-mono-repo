# 🏗️ App Templates Reference

Complete reference for all available templates in the Expo Monorepo Factory.

## Quick Comparison

| Template | Use Case | Screens | Auth | Complexity | Best For |
|----------|----------|---------|------|------------|----------|
| **Basic** | Simple apps, MVPs | 2 | Optional | ⭐ Low | Learning, prototypes |
| **Auth Flow** | User accounts | 4+ | Required | ⭐⭐ Medium | Social, SaaS, e-commerce |
| **Chat** | Messaging | 3+ | Optional | ⭐⭐⭐ High | Messaging, support |
| **Dashboard** | Analytics | 3+ | Optional | ⭐⭐ Medium | Admin, BI, monitoring |

---

## 1. Basic Template

### Overview
Minimal starter with tab navigation. Perfect for learning Expo Router and building simple apps.

### Generated Structure
```
my-app/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx      # Home screen
│       └── settings.tsx   # Settings screen
```

### Tab Configuration
```tsx
// app/(tabs)/_layout.tsx
<Tabs>
  <Tabs.Screen name="index" options={{ title: 'Home' }} />
  <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
</Tabs>
```

### Home Screen Example
```tsx
// app/(tabs)/index.tsx
export default function HomeScreen() {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center">
      <H1>Welcome! 👋</H1>
      <Text>Your new Expo app is ready to go!</Text>
      <Button>Get Started</Button>
    </YStack>
  );
}
```

### When to Use
- ✅ Learning Expo and React Native
- ✅ Building simple utilities
- ✅ Quick prototypes
- ✅ Apps without authentication
- ✅ Starting point for any app type

### When NOT to Use
- ❌ Apps requiring user accounts
- ❌ Complex navigation requirements
- ❌ Real-time features (use Chat template)
- ❌ Data-heavy apps (use Dashboard template)

### Customization Ideas
- Add more tabs (Profile, About, etc.)
- Integrate with `@bdt/components` for rich UI
- Add GraphQL for data fetching
- Implement dark mode toggle

---

## 2. Auth Flow Template

### Overview
Complete authentication system with login, signup, and protected routes. Uses production-ready components from `@bdt/components`.

### Generated Structure
```
my-app/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx      # LoginForm component
│   │   └── signup.tsx     # SignupForm component
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       └── settings.tsx
├── contexts/
│   └── AuthContext.tsx    # User state management
```

### Auth Flow Diagram
```
Start → Login Screen
         ↓ (if no account)
      Signup Screen
         ↓ (after auth)
      Protected Tabs
         ↓ (logout)
      Back to Login
```

### Login Screen
```tsx
// app/(auth)/login.tsx
import { LoginForm } from '@bdt/components';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  
  const handleLogin = async (data) => {
    // Your auth logic here
    router.replace('/(tabs)');
  };
  
  return (
    <YStack flex={1} padding="$4">
      <LoginForm
        onSubmit={handleLogin}
        onSignUp={() => router.push('/(auth)/signup')}
        onForgotPassword={() => console.log('Forgot password')}
      />
    </YStack>
  );
}
```

### Signup Screen
```tsx
// app/(auth)/signup.tsx
import { SignupForm } from '@bdt/components';

export default function SignupScreen() {
  const router = useRouter();
  
  const handleSignup = async (data) => {
    // Registration logic
    router.replace('/(tabs)');
  };
  
  return (
    <YStack flex={1} padding="$4">
      <SignupForm
        onSubmit={handleSignup}
        onSignIn={() => router.back()}
      />
    </YStack>
  );
}
```

### Auth Context
```tsx
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
}
```

### Components Used
- `LoginForm` - Email/password with validation
- `SignupForm` - Registration with password strength
- `OTPVerification` - (can be added for 2FA)

### When to Use
- ✅ Social networking apps
- ✅ E-commerce platforms
- ✅ SaaS applications
- ✅ Productivity tools with accounts
- ✅ Community platforms
- ✅ Any app requiring user authentication

### Implementation Checklist
1. ✅ Login/signup screens auto-generated
2. ⚠️  Implement actual auth API calls
3. ⚠️  Add token storage with `expo-secure-store`
4. ⚠️  Connect to backend (GraphQL or REST)
5. ⚠️  Add password reset flow
6. ⚠️  Implement session management
7. ⚠️  Add biometric auth (optional)

### Extending the Template

**Add OTP Verification:**
```tsx
// app/(auth)/verify.tsx
import { OTPVerification } from '@bdt/components';

export default function VerifyScreen() {
  return (
    <OTPVerification
      phoneNumber="+1234567890"
      onVerify={handleVerify}
      onResend={handleResend}
    />
  );
}
```

**Add Protected Route:**
```tsx
// app/_layout.tsx
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  return <Redirect href="/(auth)/login" />;
}
```

---

## 3. Chat Template

### Overview
Messaging app structure with chat list, contacts, and settings. Ready for real-time chat integration.

### Generated Structure
```
my-app/
├── app/
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx      # Chat list
│       ├── contacts.tsx   # Contacts list
│       └── settings.tsx   # Settings
```

### Tab Configuration
```tsx
// app/(tabs)/_layout.tsx
<Tabs>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Chats',
      tabBarIcon: ({ color }) => <MessageSquare color={color} />,
    }}
  />
  <Tabs.Screen
    name="contacts"
    options={{
      title: 'Contacts',
      tabBarIcon: ({ color }) => <Users color={color} />,
    }}
  />
  <Tabs.Screen
    name="settings"
    options={{
      title: 'Settings',
      tabBarIcon: ({ color }) => <Settings color={color} />,
    }}
  />
</Tabs>
```

### Components to Add

**Chat List Screen:**
```tsx
// app/(tabs)/index.tsx - extend this
import { ChatBubble } from '@bdt/components';

const conversations = [
  { id: 1, name: 'John Doe', lastMessage: 'Hey there!', timestamp: new Date() },
  // ...
];

export default function ChatsScreen() {
  return (
    <ScrollView>
      {conversations.map(convo => (
        <Pressable key={convo.id} onPress={() => router.push(`/chat/${convo.id}`)}>
          <XStack padding="$3" gap="$3">
            <Avatar size="$4" />
            <YStack flex={1}>
              <Text fontWeight="bold">{convo.name}</Text>
              <Text color="$textWeak">{convo.lastMessage}</Text>
            </YStack>
          </XStack>
        </Pressable>
      ))}
    </ScrollView>
  );
}
```

**Chat Detail Screen (add this):**
```tsx
// app/chat/[id].tsx - create this file
import { ChatBubble, ChatInput, TypingIndicator } from '@bdt/components';

export default function ChatDetailScreen() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  return (
    <YStack flex={1}>
      <ScrollView flex={1}>
        {messages.map(msg => (
          <ChatBubble
            key={msg.id}
            message={msg.text}
            timestamp={msg.timestamp}
            isOwn={msg.senderId === currentUserId}
          />
        ))}
        {isTyping && <TypingIndicator />}
      </ScrollView>
      
      <ChatInput
        onSend={handleSend}
        placeholder="Type a message..."
      />
    </YStack>
  );
}
```

### Components Provided by @bdt/components
- `ChatBubble` - Message display with timestamp
- `ChatInput` - Message composition with send
- `TypingIndicator` - Three-dot animation

### When to Use
- ✅ Messaging applications
- ✅ Team collaboration tools
- ✅ Customer support chat
- ✅ Social networking with DMs
- ✅ Community forums with chat

### Real-time Integration Ideas
- WebSocket connection for live messages
- GraphQL subscriptions
- Firebase Realtime Database
- Socket.io integration
- Push notifications for new messages

### Features to Add
1. Chat detail screens (`app/chat/[id].tsx`)
2. Contact selection and search
3. Message read receipts
4. Typing indicators
5. Media attachments (images, files)
6. Voice messages
7. Group chats
8. Message reactions

---

## 4. Dashboard Template

### Overview
Analytics and data visualization app with metric cards and charts. Perfect for admin panels and business intelligence.

### Generated Structure
```
my-app/
├── app/
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx      # Dashboard overview
│       ├── analytics.tsx  # Detailed analytics
│       └── settings.tsx   # Settings
```

### Dashboard Screen Example
```tsx
// app/(tabs)/index.tsx
export default function DashboardScreen() {
  return (
    <YStack flex={1} padding="$4" gap="$4">
      <H1>Dashboard</H1>
      
      {/* Metric Cards */}
      <XStack gap="$3">
        <Card flex={1} padding="$4" backgroundColor="$blue5">
          <Text fontSize="$2" color="$textWeak">Total Users</Text>
          <Text fontSize="$8" fontWeight="bold">1,234</Text>
          <Text fontSize="$1" color="$green10">+12% from last month</Text>
        </Card>
        
        <Card flex={1} padding="$4" backgroundColor="$green5">
          <Text fontSize="$2" color="$textWeak">Revenue</Text>
          <Text fontSize="$8" fontWeight="bold">$12.5K</Text>
          <Text fontSize="$1" color="$green10">+8% from last month</Text>
        </Card>
      </XStack>
      
      {/* More sections */}
    </YStack>
  );
}
```

### Tab Icons
```tsx
import { BarChart3, TrendingUp, Settings } from '@tamagui/lucide-icons';
```

### Metric Card Pattern
```tsx
<Card flex={1} padding="$4" backgroundColor="$blue5">
  <YStack gap="$2">
    <Text fontSize="$2" color="$textWeak">
      Metric Name
    </Text>
    <Text fontSize="$8" fontWeight="bold">
      Value
    </Text>
    <XStack alignItems="center" gap="$1">
      <TrendingUp size={12} color="$green10" />
      <Text fontSize="$1" color="$green10">
        +X% change
      </Text>
    </XStack>
  </YStack>
</Card>
```

### When to Use
- ✅ Admin panels
- ✅ Business intelligence tools
- ✅ Analytics dashboards
- ✅ Monitoring applications
- ✅ Reporting tools
- ✅ Data visualization apps

### Features to Add
1. Chart components (line, bar, pie)
2. Real-time data updates
3. Date range filters
4. Export to PDF/CSV
5. Customizable widgets
6. Data drill-down
7. Comparison views

### Library Recommendations
- **Victory Native** - Charts for React Native
- **React Native Charts** - Various chart types
- **Recharts** - For web platform
- **D3** - Advanced visualizations

---

## Template Selection Guide

### Decision Tree

```
Do you need user accounts?
├─ Yes → Auth Flow Template
└─ No ↓

Is it a messaging app?
├─ Yes → Chat Template
└─ No ↓

Is it data/analytics heavy?
├─ Yes → Dashboard Template
└─ No → Basic Template
```

### By App Type

| App Type | Recommended Template | Why |
|----------|---------------------|-----|
| Learning project | Basic | Minimal complexity |
| Social network | Auth Flow | User accounts required |
| E-commerce | Auth Flow | Login + protected checkout |
| Team messenger | Chat | Messaging-focused UI |
| Customer support | Chat | Chat interface needed |
| Admin panel | Dashboard | Data visualization |
| Analytics tool | Dashboard | Metrics and charts |
| Productivity tool | Auth Flow or Basic | Depends on accounts |
| Game | Basic | Custom UI needed |
| Utility app | Basic | Simple functionality |

---

## Feature Matrix

| Feature | Basic | Auth Flow | Chat | Dashboard |
|---------|-------|-----------|------|-----------|
| Tab Navigation | ✅ | ✅ | ✅ | ✅ |
| Auth Screens | ➖ Optional | ✅ Built-in | ➖ Optional | ➖ Optional |
| Form Components | ➖ | ✅ Login/Signup | ➖ | ➖ |
| Chat UI | ➖ | ➖ | 🔧 Structure | ➖ |
| Metric Cards | ➖ | ➖ | ➖ | ✅ Built-in |
| Settings Screen | ✅ | ✅ | ✅ | ✅ |
| GraphQL Support | ➖ Optional | ➖ Optional | ➖ Optional | ➖ Optional |
| Push Notifications | ➖ Optional | ➖ Optional | ➖ Optional | ➖ Optional |
| Complexity | ⭐ Low | ⭐⭐ Medium | ⭐⭐⭐ High | ⭐⭐ Medium |

Legend:
- ✅ Included by default
- 🔧 Structure provided, implementation needed
- ➖ Available as option
- ⭐ Complexity rating

---

## Common Customizations

### Adding a New Tab
```tsx
// app/(tabs)/_layout.tsx
<Tabs.Screen
  name="profile"
  options={{
    title: 'Profile',
    tabBarIcon: ({ color }) => <User color={color} />,
  }}
/>
```

### Adding Modal Routes
```tsx
// app/_layout.tsx
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
</Stack>
```

### Dark Mode Support
All templates support dark mode via Tamagui themes:
```tsx
// Already configured in _layout.tsx
<TamaguiProvider config={config} defaultTheme="light">
```

### Changing Theme Colors
```tsx
// tamagui.config.ts
export default {
  ...config,
  themes: {
    light: {
      ...config.themes.light,
      primary: '#FF6B6B', // Your brand color
    },
  },
};
```

---

## Migration Between Templates

### Basic → Auth Flow
1. Add `(auth)/` directory
2. Create login/signup screens
3. Add `AuthContext.tsx`
4. Add route protection

### Basic → Chat
1. Rename tab screens (index → chats)
2. Add contacts screen
3. Create chat detail route
4. Integrate chat components

### Basic → Dashboard
1. Update tab icons
2. Add metric cards to index
3. Create analytics screen
4. Add chart components

---

## Best Practices

### 1. Start Simple
Choose Basic template for prototyping, then migrate to more complex templates as needed.

### 2. Use Components
Leverage `@bdt/components` for consistent UI:
```tsx
import { Modal, Button, Input } from '@bdt/components';
```

### 3. Type Everything
All templates include TypeScript with strict mode:
```tsx
interface UserProfile {
  id: string;
  name: string;
  email: string;
}
```

### 4. Test Early
Templates include Jest configuration:
```bash
pnpm test
```

### 5. Follow Folder Structure
```
app/           # Routes
components/    # App-specific components
contexts/      # State management
hooks/         # Custom hooks
utils/         # Helper functions
```

---

## Performance Tips

### 1. Lazy Load Screens
```tsx
import { lazy } from 'react';
const ProfileScreen = lazy(() => import('./profile'));
```

### 2. Memoize Components
```tsx
import { memo } from 'react';
const ChatBubble = memo(ChatBubbleComponent);
```

### 3. Optimize Images
Use Expo Image for better performance:
```tsx
import { Image } from 'expo-image';
```

### 4. Use List Virtualization
For long lists (chats, contacts):
```tsx
import { FlashList } from '@shopify/flash-list';
```

---

## Next Steps After Creating App

1. **Implement Auth** (if Auth Flow template)
   - Connect to your auth API
   - Add token storage
   - Implement session management

2. **Add Features**
   - Create additional screens
   - Integrate APIs
   - Add app-specific logic

3. **Customize UI**
   - Update colors in `tamagui.config.ts`
   - Add app icons and splash screen
   - Customize navigation

4. **Test Everything**
   - Write unit tests
   - Add E2E tests with Detox
   - Test on real devices

5. **Deploy**
   - Build for iOS/Android
   - Submit to app stores
   - Set up CI/CD

---

## Support & Resources

- **Component Docs:** See `COMPONENT_LIBRARY.md`
- **Quick Start:** See `CREATE_APP_GUIDE.md`
- **Development:** See `apps/carat-central/DEVELOPMENT.md`
- **Monorepo Guide:** See `README.md`

---

**Ready to build amazing apps! 🚀**
