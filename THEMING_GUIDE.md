# Theming Guide

This guide explains the theming system in our Expo monorepo, powered by Tamagui.

## Overview

The theming system consists of:

1. **Tokens** - Design primitives (colors, sizes, spacing, radii)
2. **Themes** - Collections of token values for different modes (light/dark)
3. **Fonts** - Typography configuration
4. **Component themes** - Component-specific theme overrides

All theming configuration is centralized in `packages/ui`.

## Tokens

Tokens are the foundation of our design system. They're defined in `packages/ui/src/tokens.ts`.

### Size Scale (0-20)

```ts
size: {
  0: 0,
  1: 8,
  2: 16,
  3: 24,
  // ... up to 20: 160
  true: 16, // default
}
```

### Space Scale

Matches the size scale but includes negative values for margins:

```ts
import { tamaguiConfig } from '@bdt/ui';
  0: 0,
  1: 8,
  2: 16,
  '-1': -8,
  '-2': -16,
  // ...
}
```

### Radius Scale (0-10)

```ts
radius: {
  0: 0,
  1: 2,
  2: 4,
  3: 6,
  4: 8,
  // ...
}
```

### Color Tokens

#### Brand Colors

- `primary`, `primaryLight`, `primaryDark` - Main brand color
- `secondary`, `secondaryLight`, `secondaryDark` - Secondary brand color
- `accent`, `accentLight`, `accentDark` - Accent color

#### Semantic Colors

- `success`, `error`, `warning`, `info` - With light/dark variants
- `gray1` through `gray12` - Grayscale palette

#### UI Colors

- `background`, `backgroundStrong`, `backgroundHover`, etc.
- `text`, `textStrong`, `textWeak`, `textDisabled`
- `border`, `borderStrong`, `borderHover`, `borderFocus`

## Themes

Themes map token names to actual color values. We have two base themes:

### Light Theme

Default theme with light colors, defined in `packages/ui/src/themes.ts`:

```ts
const lightTheme = {
  background: '#FFFFFF',
  color: '#212121',
  primary: '#007AFF',
  // ...
};
```

### Dark Theme

Optimized for dark mode with adjusted colors:

```ts
const darkTheme = {
  background: '#121212',
  color: '#E5E5E5',
  primary: '#5AC8FA',
  // ...
};
```

## Using Themes in Apps

### 1. Automatic Dark Mode

Apps are configured with `userInterfaceStyle: 'automatic'` in `app.config.ts`, which automatically switches between light and dark themes based on system preferences.

### 2. Theme Provider

Wrap your app with `TamaguiProvider`:

```tsx
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from '@bdt/ui';

export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      {/* Your app */}
    </TamaguiProvider>
  );
}
```

### 3. Using Theme Values in Components

Access theme values using the `$` prefix:

```tsx
import { styled, YStack } from 'tamagui';

const MyComponent = styled(YStack, {
  backgroundColor: '$background',
  color: '$color',
  padding: '$4',
  borderRadius: '$3',
  borderWidth: 1,
  borderColor: '$borderColor',
});
```

### 4. Theme-Aware Components

Components automatically respond to theme changes:

```tsx
import { PrimaryButton } from '@bdt/components';

// Automatically uses $primary color from current theme
<PrimaryButton>Click Me</PrimaryButton>
```

## Fonts

Three font families are configured in `packages/ui/src/fonts.ts`:

- **heading** - Inter font for headings (weights 300-900)
- **body** - Inter font for body text (weights 300-700)
- **mono** - Monospace font for code

### Using Fonts

```tsx
import { H1, Paragraph } from 'tamagui';

<H1 fontFamily="$heading" fontWeight="700">Heading</H1>
<Paragraph fontFamily="$body">Body text</Paragraph>
```

## Responsive Design

Media queries are configured in `tamagui.config.ts`:

```tsx
import { YStack } from 'tamagui';

<YStack
  width="100%"
  $gtMd={{ width: '50%' }}
  $gtLg={{ width: '33%' }}
>
  {/* Responsive width */}
</YStack>
```

Available breakpoints:
- `$xs`, `$sm`, `$md`, `$lg`, `$xl`, `$xxl` (max-width)
- `$gtXs`, `$gtSm`, `$gtMd`, `$gtLg` (min-width)
- `$short`, `$tall` (height-based)

## Customizing Themes

### Adding a New Color

1. Add to tokens in `packages/ui/src/tokens.ts`:

```ts
color: {
  // ...
  tertiary: '#00D9B1', // Updated to use @bdt scope
}
```

2. Add to both themes in `packages/ui/src/themes.ts`:

```ts
export const lightTheme = {
  // ...
  tertiary: '#00D9B1', // Updated to use @bdt scope
};

export const darkTheme = {
  // ...
  tertiary: '#00E6C1', // Lighter for dark mode, updated to use @bdt scope
};
```

3. Use in components:

```tsx
<Button backgroundColor="$tertiary">Tertiary Action</Button>
```

### Creating a Custom Theme

Create a new theme variant:

```ts
// packages/ui/src/themes.ts
export const brandTheme = {
  ...lightTheme,
  primary: '#FF6B35', // Override primary color
  secondary: '#F7931E',
};

// In tamagui.config.ts
themes: {
  light: lightTheme,
  dark: darkTheme,
  brand: brandTheme,
}
```

Use it in your app:

```tsx
<TamaguiProvider config={tamaguiConfig} defaultTheme="brand">
  {/* Your app with brand theme */}
</TamaguiProvider>
```

## Component Themes

Component-specific themes are defined in `packages/ui/src/themes.ts`:

```ts
export const componentThemes = {
  button: {
    background: '$primary',
    color: '$colorInverse',
  },
  button_outlined: {
    background: 'transparent',
    borderColor: '$primary',
  },
};
```

These allow fine-grained control over component styling in different contexts.

## Best Practices

1. **Always use tokens** - Never hardcode colors, sizes, or spacing
2. **Semantic naming** - Use semantic color names (`$success`, `$error`) over specific colors
3. **Test both themes** - Always test your UI in both light and dark modes
4. **Responsive first** - Use media queries for different screen sizes
5. **Consistent spacing** - Use the space scale for padding and margins

## Examples

### Themed Card

```tsx
import { Card, CardHeader, CardTitle, CardBody } from '@bdt/components';
import { Paragraph } from 'tamagui';

<Card>
  <CardHeader>
    <CardTitle>Welcome</CardTitle>
  </CardHeader>
  <CardBody>
    <Paragraph>This card automatically adapts to light/dark mode</Paragraph>
  </CardBody>
</Card>
```

### Custom Styled Component

```tsx
import { styled, YStack } from 'tamagui';

const FeatureBox = styled(YStack, {
  backgroundColor: '$backgroundStrong',
  padding: '$4',
  borderRadius: '$4',
  borderLeftWidth: 4,
  borderLeftColor: '$primary',
  
  hoverStyle: {
    backgroundColor: '$backgroundHover',
    borderLeftColor: '$primaryLight',
  },
  
  pressStyle: {
    backgroundColor: '$backgroundPress',
  },
});
```

## TypeScript Support

The theming system is fully typed. Your IDE will autocomplete theme values:

```tsx
// TypeScript knows all available theme tokens
<YStack backgroundColor="$" /* Autocomplete shows all color tokens */ />
```

## Troubleshooting

### Theme not applying

Make sure `TamaguiProvider` wraps your entire app and you've imported the config from `@bdt/ui`.

### Colors look wrong in dark mode

Check that both `lightTheme` and `darkTheme` have the same token names with appropriate color values.

### Custom tokens not working

Ensure you've added them to both `tokens.ts` and both theme definitions, then restart your development server.
