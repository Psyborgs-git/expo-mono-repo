# Component Library Quick Reference 🎨

## Installation

```typescript
import {
  // Atoms
  Button,
  Input,
  Badge,
  Avatar,
  Card,
  Skeleton,
  // Molecules
  FormField,
  SearchBar,
  DiamondCard,
  MessageBubble,
  // Organisms
  DiamondList,
  ChatThread,
  FilterPanel,
} from '@bdt/components';
```

## Atoms

### Button
```typescript
<Button 
  variant="primary"    // primary | secondary | outlined | ghost | danger
  size="md"            // sm | md | lg
  onPress={() => {}}
  disabled={false}
  loading={false}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
>
  Click Me
</Button>
```

### Input
```typescript
<Input
  variant="outlined"   // outlined | filled | underlined
  size="md"            // sm | md | lg
  status="default"     // default | error | success | warning
  value={value}
  onChangeText={setValue}
  placeholder="Enter text"
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  disabled={false}
/>
```

### Badge
```typescript
<Badge 
  variant="primary"    // default | primary | success | warning | error | info
  size="md"            // sm | md | lg
>
  New
</Badge>
```

### Avatar
```typescript
<Avatar
  size="md"            // sm | md | lg | xl
  src="https://..."
  fallback="John Doe"
  alt="User"
/>
```

### Card
```typescript
<Card 
  variant="elevated"   // default | elevated | outlined
  padding="$4"
>
  <Text>Content</Text>
</Card>
```

### Skeleton
```typescript
<Skeleton 
  width={200} 
  height={20} 
  borderRadius={4}
/>
```

## Molecules

### FormField
```typescript
<FormField
  label="Email Address"
  value={email}
  onChangeText={setEmail}
  error={emailError}
  helperText="We'll never share your email"
  required={true}
  placeholder="you@example.com"
  keyboardType="email-address"
/>
```

### SearchBar
```typescript
<SearchBar
  value={searchQuery}
  onChangeText={setSearchQuery}
  onSearch={(query) => console.log('Searching:', query)}
  onClear={() => setSearchQuery('')}
  placeholder="Search diamonds..."
/>
```

### DiamondCard
```typescript
<DiamondCard
  id="diamond-123"
  certificateId="GIA123456"
  shape="Round"
  carat={1.5}
  color="D"
  clarity="VVS1"
  cut="Excellent"
  price={15000}
  location="New York"
  onPress={() => router.push(`/diamond/${id}`)}
  isLoading={false}
/>
```

### MessageBubble
```typescript
<MessageBubble
  message="Hello! How are you?"
  timestamp="2024-01-20T10:30:00Z"
  variant="sent"        // sent | received
  senderName="John Doe"
  senderAvatar="https://..."
  isRead={true}
/>
```

## Organisms

### DiamondList
```typescript
<DiamondList
  diamonds={diamondsArray}
  onDiamondPress={(diamond) => router.push(`/diamond/${diamond.id}`)}
  isLoading={loading}
  numColumns={2}
  contentContainerStyle={{ padding: 16 }}
/>
```

### ChatThread
```typescript
<ChatThread
  messages={messagesArray}
  currentUserId={userId}
  onLoadMore={loadMoreMessages}
  isLoading={loading}
/>

// Message shape:
interface ChatMessage {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  isRead?: boolean;
}
```

### FilterPanel
```typescript
<FilterPanel
  fields={[
    { key: 'shape', label: 'Shape', type: 'select', options: [...] },
    { key: 'carat', label: 'Carat', type: 'range', min: 0, max: 10 },
    { key: 'certId', label: 'Certificate ID', type: 'text' },
  ]}
  values={filterValues}
  onValueChange={(key, value) => setFilterValues(prev => ({ ...prev, [key]: value }))}
  onApply={handleApplyFilters}
  onReset={handleResetFilters}
/>
```

## Common Patterns

### Form with Validation
```typescript
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState({});

<YStack space="$4">
  <FormField
    label="Email"
    value={formData.email}
    onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
    error={errors.email}
    required
  />
  
  <FormField
    label="Password"
    value={formData.password}
    onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
    error={errors.password}
    secureTextEntry
    required
  />
  
  <Button 
    variant="primary" 
    onPress={handleSubmit}
    loading={isSubmitting}
  >
    Submit
  </Button>
</YStack>
```

### Diamond Grid with Search
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [diamonds, setDiamonds] = useState([]);

<YStack flex={1} space="$4" padding="$4">
  <SearchBar
    value={searchQuery}
    onChangeText={setSearchQuery}
    placeholder="Search diamonds..."
  />
  
  <DiamondList
    diamonds={diamonds.filter(d => 
      d.certificateId?.includes(searchQuery) ||
      d.shape?.includes(searchQuery)
    )}
    onDiamondPress={(diamond) => router.push(`/diamond/${diamond.id}`)}
    numColumns={2}
  />
</YStack>
```

### Chat Interface
```typescript
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [inputText, setInputText] = useState('');

<YStack flex={1}>
  <ChatThread
    messages={messages}
    currentUserId={currentUser.id}
    onLoadMore={loadMoreMessages}
  />
  
  <XStack padding="$4" space="$2" borderTopWidth={1} borderColor="$gray5">
    <Input
      flex={1}
      value={inputText}
      onChangeText={setInputText}
      placeholder="Type a message..."
    />
    <Button onPress={handleSend}>
      Send
    </Button>
  </XStack>
</YStack>
```

### Loading States
```typescript
{loading ? (
  <YStack space="$4">
    <Skeleton width="100%" height={60} />
    <Skeleton width="80%" height={20} />
    <Skeleton width="60%" height={20} />
  </YStack>
) : (
  <DiamondList diamonds={diamonds} />
)}
```

### Status Badges
```typescript
<XStack space="$2">
  <Badge variant="success">Available</Badge>
  <Badge variant="warning">Reserved</Badge>
  <Badge variant="error">Sold</Badge>
  <Badge variant="info">New</Badge>
</XStack>
```

### User Avatars
```typescript
<XStack space="$3" alignItems="center">
  <Avatar size="lg" src={user.avatar} fallback={user.name} />
  <YStack>
    <Text fontWeight="600">{user.name}</Text>
    <Text color="$colorPress">{user.role}</Text>
  </YStack>
</XStack>
```

## Theming

All components respect Tamagui themes. Use theme tokens for colors:

```typescript
// ✅ Good - uses theme tokens
<Button backgroundColor="$primary" color="$color" />

// ❌ Bad - hardcoded colors
<Button backgroundColor="#007AFF" color="black" />
```

### Available Theme Tokens
- `$primary`, `$secondary` - Brand colors
- `$success`, `$warning`, `$error`, `$info` - Status colors
- `$background`, `$backgroundStrong`, `$backgroundPress` - Backgrounds
- `$color`, `$colorPress` - Text colors
- `$gray1` through `$gray12` - Gray scale
- `$borderColor` - Borders

## Accessibility

All components support accessibility props:

```typescript
<Button 
  accessibilityLabel="Submit form"
  accessibilityHint="Submits your diamond listing"
  accessibilityRole="button"
/>

<Input
  accessibilityLabel="Email address"
  accessibilityHint="Enter your email to sign in"
/>
```

## Performance Tips

1. **Memoize callbacks**:
```typescript
const handlePress = useCallback(() => {
  router.push('/diamond');
}, [router]);
```

2. **Use FlatList for long lists**:
```typescript
<DiamondList diamonds={largeArray} /> // Already uses FlatList internally
```

3. **Lazy load images**:
```typescript
<Avatar src={lazyImageUrl} fallback="Loading..." />
```

4. **Show loading states**:
```typescript
<Button loading={isSubmitting}>Submit</Button>
```

## Dark Mode

Components automatically support dark mode via Tamagui themes:

```typescript
import { Theme } from 'tamagui';

<Theme name="dark">
  <YStack>
    <Button>Dark Mode Button</Button>
  </YStack>
</Theme>
```

## Responsive Design

Use Tamagui's responsive props:

```typescript
<Button
  size="$3"
  $gtSm={{ size: '$4' }}    // Tablet
  $gtMd={{ size: '$5' }}    // Desktop
>
  Responsive Button
</Button>
```

---

**Need Help?** Check component source files in `packages/components/src/` for full prop interfaces and examples.
