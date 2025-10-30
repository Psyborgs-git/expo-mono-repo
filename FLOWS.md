# Pre-Built Flows Reference

This document describes the ready-to-use flows available in `@bdt/components`. These flows are fully themeable using Tamagui and can be customized per app.

## Authentication Flows

### Login Flow

Complete email/password login with remember me functionality.

```tsx
import { LoginForm } from '@bdt/components';

function LoginScreen() {
  const router = useRouter();

  const handleLogin = async (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      await authService.login(data.email, data.password);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <YStack flex={1} justifyContent="center" padding="$4">
      <LoginForm
        onSubmit={handleLogin}
        onSignUp={() => router.push('/signup')}
        onForgotPassword={() => router.push('/forgot-password')}
      />
    </YStack>
  );
}
```

**Props:**
- `onSubmit: (data: { email: string; password: string; rememberMe: boolean }) => void`
- `onSignUp?: () => void` - Navigate to signup
- `onForgotPassword?: () => void` - Navigate to forgot password
- `loading?: boolean` - Show loading state

### Signup Flow

User registration with validation.

```tsx
import { SignupForm } from '@bdt/components';

function SignupScreen() {
  const router = useRouter();

  const handleSignup = async (data: SignupFormData) => {
    try {
      await authService.signup(data);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <YStack flex={1} justifyContent="center" padding="$4">
      <SignupForm
        onSubmit={handleSignup}
        onSignIn={() => router.back()}
      />
    </YStack>
  );
}
```

**Props:**
- `onSubmit: (data: SignupFormData) => void`
  - `SignupFormData` includes: `name`, `email`, `password`, `confirmPassword`
- `onSignIn?: () => void` - Navigate back to login
- `loading?: boolean`

### OTP Verification Flow

Phone or email OTP verification with resend capability.

```tsx
import { OTPVerification } from '@bdt/components';

function VerifyOTPScreen() {
  const router = useRouter();
  const { phoneNumber } = useLocalSearchParams();

  const handleVerify = async (code: string) => {
    try {
      await authService.verifyOTP(phoneNumber, code);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const handleResend = async () => {
    await authService.resendOTP(phoneNumber);
  };

  return (
    <YStack flex={1} justifyContent="center" padding="$4">
      <OTPVerification
        length={6}
        onComplete={handleVerify}
        onResend={handleResend}
        phoneNumber={phoneNumber}
      />
    </YStack>
  );
}
```

**Props:**
- `length?: number` - OTP code length (default: 6)
- `onComplete: (code: string) => void`
- `onResend?: () => void`
- `phoneNumber?: string` - Display phone number
- `email?: string` - Display email address
- `autoFocus?: boolean`

## Chat Flows

### Chat Thread

Complete chat interface with messages, avatars, and scrolling.

```tsx
import { ChatThread } from '@bdt/components';

function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const currentUserId = 'user-1';

  return (
    <YStack flex={1}>
      <ChatThread
        messages={messages}
        currentUserId={currentUserId}
        onLoadMore={() => {
          // Load more messages
        }}
      />
      <ChatInput onSend={(text) => {
        // Send message
      }} />
    </YStack>
  );
}
```

**Props:**
- `messages: ChatMessage[]`
  - `ChatMessage`: `{ id, content, senderId, senderName?, senderAvatar?, createdAt }`
- `currentUserId: string`
- `onLoadMore?: () => void`
- `loading?: boolean`

### Chat Input

Message composer with send button and attachments.

```tsx
import { ChatInput } from '@bdt/components';

function ChatComposer() {
  const handleSend = (text: string, attachments?: File[]) => {
    // Send message with optional attachments
  };

  return (
    <ChatInput
      onSend={handleSend}
      placeholder="Type a message..."
      showAttachments
    />
  );
}
```

**Props:**
- `onSend: (text: string, attachments?: File[]) => void`
- `placeholder?: string`
- `showAttachments?: boolean`
- `maxLength?: number`

### Chat Bubble

Individual message component for custom layouts.

```tsx
import { ChatBubble } from '@bdt/components';

function CustomChatMessage({ message }) {
  return (
    <ChatBubble
      content={message.text}
      timestamp={message.createdAt}
      isOwn={message.senderId === currentUserId}
      senderName={message.senderName}
      avatar={message.avatar}
    />
  );
}
```

**Props:**
- `content: string`
- `timestamp: string`
- `isOwn: boolean`
- `senderName?: string`
- `avatar?: string`

## UI Flows

### Modal

Overlay modal with customizable content.

```tsx
import { Modal } from '@bdt/components';

function ConfirmationModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setOpen(true)}>Open Modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Action"
      >
        <YStack padding="$4" gap="$4">
          <Text>Are you sure you want to continue?</Text>
          <XStack gap="$2" justifyContent="flex-end">
            <Button variant="ghost" onPress={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onPress={handleConfirm}>Confirm</Button>
          </XStack>
        </YStack>
      </Modal>
    </>
  );
}
```

**Props:**
- `open: boolean`
- `onClose: () => void`
- `title?: string`
- `children: React.ReactNode`

### Alert Dialog

Confirmation dialogs with actions.

```tsx
import { AlertDialog } from '@bdt/components';

function DeleteConfirmation() {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Delete Item"
      description="This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={handleDelete}
      variant="danger"
    />
  );
}
```

**Props:**
- `open: boolean`
- `onClose: () => void`
- `title: string`
- `description?: string`
- `confirmText?: string`
- `cancelText?: string`
- `onConfirm: () => void`
- `variant?: 'default' | 'danger'`

### Action Sheet

Bottom sheet with action options.

```tsx
import { ActionSheet } from '@bdt/components';

function ShareSheet() {
  const [open, setOpen] = useState(false);

  const options = [
    { label: 'Share via Email', value: 'email', icon: <Mail /> },
    { label: 'Share via SMS', value: 'sms', icon: <MessageSquare /> },
    { label: 'Copy Link', value: 'copy', icon: <Copy /> },
  ];

  return (
    <ActionSheet
      open={open}
      onClose={() => setOpen(false)}
      title="Share"
      options={options}
      onSelect={(option) => {
        handleShare(option.value);
        setOpen(false);
      }}
    />
  );
}
```

**Props:**
- `open: boolean`
- `onClose: () => void`
- `title?: string`
- `options: ActionSheetOption[]`
  - `ActionSheetOption`: `{ label, value, icon?, destructive? }`
- `onSelect: (option: ActionSheetOption) => void`

### Filter Panel

Dynamic filter interface with multiple field types.

```tsx
import { FilterPanel } from '@bdt/components';

function ProductFilters() {
  const [filters, setFilters] = useState({});

  const filterFields = [
    {
      key: 'category',
      label: 'Category',
      type: 'select' as const,
      options: [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Clothing', value: 'clothing' },
      ],
    },
    {
      key: 'price',
      label: 'Price Range',
      type: 'range' as const,
      min: 0,
      max: 1000,
    },
    {
      key: 'search',
      label: 'Search',
      type: 'text' as const,
    },
  ];

  return (
    <FilterPanel
      fields={filterFields}
      values={filters}
      onChange={setFilters}
      onApply={() => {
        // Apply filters
      }}
      onClear={() => setFilters({})}
    />
  );
}
```

**Props:**
- `fields: FilterField[]`
  - `FilterField`: `{ key, label, type: 'text' | 'range' | 'select', options?, min?, max? }`
- `values: Record<string, any>`
- `onChange: (values: Record<string, any>) => void`
- `onApply?: () => void`
- `onClear?: () => void`

## Input Components

### OTP Input

Specialized input for OTP codes.

```tsx
import { OTPInput } from '@bdt/components';

function OTPField() {
  const [code, setCode] = useState('');

  return (
    <OTPInput
      length={6}
      value={code}
      onChange={setCode}
      onComplete={(value) => {
        // Auto-submit when complete
        verifyOTP(value);
      }}
    />
  );
}
```

### Phone Input

Phone number input with country code.

```tsx
import { PhoneInput } from '@bdt/components';

function PhoneField() {
  const [phone, setPhone] = useState('');

  return (
    <PhoneInput
      value={phone}
      onChange={setPhone}
      placeholder="Enter phone number"
      defaultCountry="US"
    />
  );
}
```

### Text Area

Multi-line text input.

```tsx
import { TextArea } from '@bdt/components';

function CommentField() {
  const [comment, setComment] = useState('');

  return (
    <TextArea
      value={comment}
      onChangeText={setComment}
      placeholder="Enter your comment..."
      rows={4}
      maxLength={500}
    />
  );
}
```

## Theming and Customization

All flows use Tamagui tokens and can be customized per app:

### Global Theme Customization

Edit `packages/ui/src/themes.ts` to change colors globally:

```ts
export const lightTheme = {
  background: '#ffffff',
  color: '#000000',
  primary: '#007AFF',  // Change primary color here
  // ...
};
```

### App-Specific Customization

Override in your app's `tamagui.config.ts`:

```ts
import { config as baseConfig } from '@bdt/ui';

export default {
  ...baseConfig,
  themes: {
    ...baseConfig.themes,
    light: {
      ...baseConfig.themes.light,
      primary: '#FF3B30',  // App-specific primary color
    },
  },
};
```

### Component-Level Customization

Wrap components with Tamagui themes:

```tsx
import { Theme } from 'tamagui';
import { LoginForm } from '@bdt/components';

function CustomLoginScreen() {
  return (
    <Theme name="blue">
      <LoginForm onSubmit={handleLogin} />
    </Theme>
  );
}
```

## Complete Flow Examples

### Complete Auth Flow

```tsx
// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="verify-otp" />
    </Stack>
  );
}

// app/(auth)/login.tsx
import { LoginForm } from '@bdt/components';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <YStack flex={1} justifyContent="center" padding="$4">
      <LoginForm
        onSubmit={async (data) => {
          await authService.login(data.email, data.password);
          router.replace('/(tabs)');
        }}
        onSignUp={() => router.push('/(auth)/signup')}
        onForgotPassword={() => router.push('/(auth)/forgot-password')}
      />
    </YStack>
  );
}

// app/(auth)/signup.tsx
import { SignupForm } from '@bdt/components';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <YStack flex={1} justifyContent="center" padding="$4">
      <SignupForm
        onSubmit={async (data) => {
          await authService.signup(data);
          router.push({
            pathname: '/(auth)/verify-otp',
            params: { email: data.email },
          });
        }}
        onSignIn={() => router.back()}
      />
    </YStack>
  );
}
```

### Complete Chat Flow

```tsx
// app/chat/[id].tsx
import { ChatThread, ChatInput } from '@bdt/components';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Subscribe to messages
    const subscription = chatService.subscribeToMessages(id, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => subscription.unsubscribe();
  }, [id]);

  const handleSend = async (text: string) => {
    await chatService.sendMessage(id, text);
  };

  return (
    <YStack flex={1}>
      <ChatThread
        messages={messages}
        currentUserId={authService.currentUserId}
      />
      <ChatInput onSend={handleSend} />
    </YStack>
  );
}
```

## Best Practices

1. **Use semantic tokens**: Always use `$background`, `$color`, `$primary` instead of hardcoded colors
2. **Handle loading states**: All flows support `loading` prop for async operations
3. **Error handling**: Wrap flow submissions in try-catch blocks
4. **Accessibility**: All components support screen readers and keyboard navigation
5. **Responsive**: Flows adapt to screen sizes automatically
6. **Type safety**: Import and use TypeScript types for all props

## Troubleshooting

### Components not rendering correctly

Ensure Tamagui is properly configured in your app:

```tsx
// app/_layout.tsx
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      {/* Your app */}
    </TamaguiProvider>
  );
}
```

### Styles not updating

Clear metro bundler cache:

```bash
pnpm start --clear
```

### Import errors

Ensure the components package is built:

```bash
pnpm --filter @bdt/components build
```
