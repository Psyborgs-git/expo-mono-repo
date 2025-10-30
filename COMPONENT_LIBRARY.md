# Component Library

Complete reference for all reusable components in `@bdt/components`.

## Overview

The component library provides ready-to-use, themeable components built on Tamagui. All components:

- ✅ Automatically support light/dark themes
- ✅ Use design tokens from `@bdt/ui`
- ✅ Fully typed with TypeScript
- ✅ Optimized for React Native and Web
- ✅ Support hover/press/focus states
- ✅ Accessible by default

## Installation

Already included in all apps via `@bdt/components` workspace package.

## Buttons

### PrimaryButton

Main call-to-action button with brand primary color.

```tsx
import { PrimaryButton } from '@bdt/components';

<PrimaryButton onPress={() => console.log('Clicked')}>
  Get Started
</PrimaryButton>
```

**Props**: Inherits all Tamagui `Button` props

**Styling**:
- Background: `$primary`
- Text: `$colorInverse`
- Press: `$primaryDark`
- Hover: `$primaryLight`

### SecondaryButton

Secondary actions with less visual weight.

```tsx
import { SecondaryButton } from '@bdt/components';

<SecondaryButton onPress={() => {}}>
  Learn More
</SecondaryButton>
```

Already included in all apps via `@bdt/components` workspace package.
**Styling**:
- Background: `$secondary`
- Text: `$colorInverse`

### OutlinedButton

Transparent button with colored border.
import { PrimaryButton } from '@bdt/components';
```tsx
import { OutlinedButton } from '@bdt/components';

<OutlinedButton onPress={() => {}}>
  {/* ... */}
</OutlinedButton>
```

**Styling**:
import { Container, Grid, GridItem, Card, CardBody, CardFooter, PrimaryButton, } from '@bdt/components';
- Border: `$primary`
- Text: `$primary`

### GhostButton
import {
  Container,
  Stack,
  TextInput,
  PasswordInput,
  PrimaryButton,
  GhostButton,
  Alert,
} from '@bdt/components';
```

**Styling**:
- Background: transparent
import {
  Container,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardFooter,
  PrimaryButton,
} from '@bdt/components';

<DangerButton onPress={() => deleteItem()}>
  Delete
import { ComponentProps } from 'tamagui';
import { PrimaryButton } from '@bdt/components';

**Styling**:
- Background: `$error`
- Text: `$colorInverse`

## Inputs

### TextInput

Standard text input field.

```tsx
import { TextInput } from '@bdt/components';
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');

  return (
    <TextInput
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />
  );
}
```

**Props**: Inherits all React Native `TextInput` props

**Styling**:
- Background: `$background`
- Border: `$borderColor`
- Focus Border: `$borderColorFocus`
- Text: `$color`
- Placeholder: `$placeholder`

### SearchInput

Text input with space for search icon (you add the icon).

```tsx
import { SearchInput } from '@bdt/components';
import { Search } from '@tamagui/lucide-icons'; // Example icon

<YStack position="relative">
  <Search position="absolute" left="$3" top="$2.5" color="$colorWeak" />
  <SearchInput placeholder="Search..." />
</YStack>
```

**Styling**: Same as TextInput but with left padding for icon

### PasswordInput

Text input with `secureTextEntry` enabled.

```tsx
import { PasswordInput } from '@bdt/components';

<PasswordInput
  placeholder="Password"
  value={password}
  onChangeText={setPassword}
/>
```

## Cards

### Card

Container with elevation and border.

```tsx
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from '@bdt/components';
import { Paragraph } from 'tamagui';
import { PrimaryButton } from '@bdt/components';

<Card>
  <CardHeader>
    <CardTitle>Feature Title</CardTitle>
  </CardHeader>
  <CardBody>
    <Paragraph>Description of the feature goes here.</Paragraph>
  </CardBody>
  <CardFooter>
    <PrimaryButton>Learn More</PrimaryButton>
  </CardFooter>
</Card>
```

**Components**:

- **Card** - Main container with shadow and border
- **CardHeader** - Header section with bottom border
- **CardTitle** - H3 heading for card title
- **CardBody** - Main content area
- **CardFooter** - Footer with actions, right-aligned

**Styling**:
- Background: `$background`
- Border: `$borderColor`
- Shadow: `$shadowColor`
- Hover: `$backgroundHover`

## Layout

### Container

Centered container with max-width for consistent page layouts.

```tsx
import { Container } from '@bdt/components';

<Container>
  {/* Your content */}
</Container>
```

**Styling**:
- Max Width: 1200px
- Centered with auto margins
- Horizontal padding: `$4`

### Stack

Vertical stack with consistent spacing.

```tsx
import { Stack } from '@bdt/components';
import { Paragraph } from 'tamagui';

<Stack>
  <Paragraph>Item 1</Paragraph>
  <Paragraph>Item 2</Paragraph>
  <Paragraph>Item 3</Paragraph>
</Stack>
```

**Props**:
- `gap`: Spacing between children (default: `$2`)

### Row

Horizontal row with aligned children.

```tsx
import { Row } from '@bdt/components';
import { PrimaryButton, OutlinedButton } from '@bdt/components';

<Row>
  <PrimaryButton>Save</PrimaryButton>
  <OutlinedButton>Cancel</OutlinedButton>
</Row>
```

**Props**:
- `gap`: Spacing between children (default: `$2`)
- `alignItems`: Vertical alignment (default: `center`)

### Spacer

Flexible spacer to push elements apart.

```tsx
import { Row, Spacer } from '@bdt/components';

<Row>
  <Text>Left</Text>
  <Spacer />
  <Text>Right</Text>
</Row>
```

### Grid

Responsive grid layout.

```tsx
import { Grid, GridItem } from '@bdt/components';
import { Card } from '@bdt/components';

<Grid>
  <GridItem cols={2}>
    <Card>{/* Content */}</Card>
  </GridItem>
  <GridItem cols={2}>
    <Card>{/* Content */}</Card>
  </GridItem>
  <GridItem cols={3}>
    <Card>{/* Content */}</Card>
  </GridItem>
  <GridItem cols={3}>
    <Card>{/* Content */}</Card>
  </GridItem>
  <GridItem cols={3}>
    <Card>{/* Content */}</Card>
  </GridItem>
</Grid>
```

**GridItem Props**:
- `cols`: Number of columns (2, 3, or 4)

## Alerts

### Alert

Feedback messages with semantic colors.

```tsx
import { Alert, AlertTitle, AlertDescription } from '@bdt/components';

<Alert variant="success">
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Your changes have been saved.</AlertDescription>
</Alert>

<Alert variant="error">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong. Please try again.</AlertDescription>
</Alert>

<Alert variant="warning">
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>This action cannot be undone.</AlertDescription>
</Alert>

<Alert variant="info">
  <AlertTitle>Info</AlertTitle>
  <AlertDescription>New update available.</AlertDescription>
</Alert>
```

**Variants**:
- `info` (default) - Blue
- `success` - Green
- `warning` - Yellow/Orange
- `error` - Red

**Components**:
- **Alert** - Container with colored background and border
- **AlertTitle** - Bold title text
- **AlertDescription** - Description text

## Complete Examples

### Login Form

```tsx
import {
  Container,
  Stack,
  TextInput,
  PasswordInput,
  PrimaryButton,
  GhostButton,
  Alert,
  AlertDescription,
} from '@bdt/components';
import { H1, Paragraph } from 'tamagui';
import { useState } from 'react';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Login logic
  };

  return (
    <Container>
      <Stack gap="$4" paddingTop="$10">
        <H1>Welcome Back</H1>
        <Paragraph color="$colorWeak">Sign in to your account</Paragraph>

        {error && (
          <Alert variant="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <PasswordInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />

        <PrimaryButton onPress={handleLogin}>Sign In</PrimaryButton>
        <GhostButton>Forgot Password?</GhostButton>
      </Stack>
    </Container>
  );
}
```

### Product Grid

```tsx
import {
  Container,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardFooter,
  PrimaryButton,
} from '@bdt/components';
import { H3, Paragraph } from 'tamagui';

function ProductGrid({ products }) {
  return (
    <Container>
      <Grid>
        {products.map((product) => (
          <GridItem key={product.id} cols={3}>
            <Card>
              <CardBody>
                <H3>{product.name}</H3>
                <Paragraph color="$colorWeak">{product.description}</Paragraph>
                <Paragraph fontWeight="600" fontSize="$6">
                  ${product.price}
                </Paragraph>
              </CardBody>
              <CardFooter>
                <PrimaryButton>Add to Cart</PrimaryButton>
              </CardFooter>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
}
```

### Settings Screen

```tsx
import {
  Container,
  Stack,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Spacer,
  OutlinedButton,
} from '@bdt/components';
import { Switch, Paragraph } from 'tamagui';
import { useState } from 'react';

function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Container>
      <Stack gap="$4" paddingTop="$6">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardBody gap="$3">
            <Row>
              <Paragraph>Enable Notifications</Paragraph>
              <Spacer />
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </Row>
            <Row>
              <Paragraph>Dark Mode</Paragraph>
              <Spacer />
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </Row>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardBody>
            <OutlinedButton>Change Password</OutlinedButton>
            <OutlinedButton>Privacy Settings</OutlinedButton>
          </CardBody>
        </Card>
      </Stack>
    </Container>
  );
}
```

## Customization

All components are built with Tamagui's `styled()` API, making them easy to customize:

```tsx
import { styled } from 'tamagui';
import { PrimaryButton } from '@bdt/components';

// Extend existing component
const LargeButton = styled(PrimaryButton, {
  paddingHorizontal: '$6',
  paddingVertical: '$4',
  fontSize: '$6',
});

// Override specific props
<PrimaryButton backgroundColor="$accent" size="$5">
  Custom Button
</PrimaryButton>
```

## Creating New Components

Follow the established pattern:

```tsx
// packages/components/src/Badge.tsx
import { styled } from 'tamagui';
import { XStack, Paragraph } from 'tamagui';

export const Badge = styled(XStack, {
  name: 'Badge',
  backgroundColor: '$primary',
  paddingHorizontal: '$2',
  paddingVertical: '$1',
  borderRadius: '$2',
  alignItems: 'center',
  justifyContent: 'center',
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
      },
      success: {
        backgroundColor: '$success',
      },
      error: {
        backgroundColor: '$error',
      },
    },
  },
  
  defaultVariants: {
    variant: 'primary',
  },
});

export const BadgeText = styled(Paragraph, {
  name: 'BadgeText',
  color: '$colorInverse',
  fontSize: '$2',
  fontWeight: '600',
});

// Export in src/index.ts
export { Badge, BadgeText } from './Badge';
```

## TypeScript Support

All components are fully typed:

```tsx
import { ComponentProps } from 'tamagui';
import { PrimaryButton } from '@bdt/components';

type ButtonProps = ComponentProps<typeof PrimaryButton>;

// Your component gets full type safety
function MyComponent({ onPress }: { onPress: ButtonProps['onPress'] }) {
  return <PrimaryButton onPress={onPress}>Click Me</PrimaryButton>;
}
```

## Best Practices

1. **Use components** - Don't recreate common patterns, use the library
2. **Extend, don't modify** - Create new variants instead of modifying existing components
3. **Consistent spacing** - Use the Stack and Row components for consistent gaps
4. **Semantic variants** - Use Alert variants and Button types appropriately
5. **Responsive layouts** - Use Grid and Container for responsive designs
