# Expo Monorepo Factory - Implementation Plan

**Based on Analysis:** [MONOREPO_ANALYSIS.md](./MONOREPO_ANALYSIS.md)  
**Target:** Production-ready Expo app factory  
**Timeline:** 3-4 weeks  
**Current Completion:** 70%

---

## Overview

This plan transforms the existing well-structured monorepo into a **production-grade Expo App Factory** that enables rapid development of multiple mobile applications with:

✅ Shared UI component library (100+ components)  
✅ Automated app scaffolding (create new apps in minutes)  
✅ Consistent design system with per-app theming  
✅ Robust networking and authentication  
✅ Build caching and parallel execution  
✅ Comprehensive testing infrastructure  

---

## Phase 1: Infrastructure & Build Tools (Week 1)

**Goal:** Optimize build performance and establish solid foundations

### 1.1 Add Turborepo ⚡

**Why:** 10x faster builds with caching, parallel execution

**Implementation:**

```bash
# Install Turborepo
pnpm add -Dw turbo
```

**Create `turbo.json`:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts", "test/**/*.tsx"]
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "start": {
      "cache": false,
      "persistent": true
    },
    "clean": {
      "cache": false
    }
  }
}
```

**Update root `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules",
    "reset": "pnpm clean && pnpm install"
  }
}
```

**Expected Outcome:** 
- First build: ~2min (same as before)
- Subsequent builds: ~10s (95% faster with cache)

---

### 1.2 Create Shared Config Package

**Create:** `packages/config/`

**Structure:**
```
packages/config/
├── eslint/
│   └── base.js
├── typescript/
│   ├── base.json
│   └── expo.json
├── metro/
│   └── base.config.js
├── tamagui/
│   └── base.config.ts
└── package.json
```

**Files to Create:**

**`packages/config/package.json`:**
```json
{
  "name": "@bdt/config",
  "version": "0.1.0",
  "private": true,
  "files": ["eslint", "typescript", "metro", "tamagui"]
}
```

**`packages/config/typescript/base.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ESNext"],
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**`packages/config/typescript/expo.json`:**
```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "jsx": "react-native",
    "lib": ["ESNext", "DOM"]
  }
}
```

**Apps can now extend:**
```json
{
  "extends": "@bdt/config/typescript/expo.json"
}
```

---

### 1.3 Add CI/CD Pipeline

**Create:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm type-check

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    name: Build All Packages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
```

---

### 1.4 Add Dependency Management

**Install syncpack:**
```bash
pnpm add -Dw syncpack
```

**Create `.syncpackrc.json`:**
```json
{
  "versionGroups": [
    {
      "label": "Core React packages must be the same",
      "packages": ["**"],
      "dependencies": ["react", "react-dom", "react-native"],
      "pinVersion": "19.1.0"
    },
    {
      "label": "Expo packages must be the same",
      "packages": ["**"],
      "dependencies": ["expo", "expo-*"],
      "dependencyTypes": ["prod", "dev"]
    },
    {
      "label": "Tamagui packages must be the same",
      "packages": ["**"],
      "dependencies": ["tamagui", "@tamagui/*"]
    }
  ]
}
```

**Add scripts:**
```json
{
  "scripts": {
    "check-deps": "syncpack list-mismatches",
    "fix-deps": "syncpack fix-mismatches",
    "update-deps": "pnpm -r update"
  }
}
```

---

## Phase 2: UI Component Library Expansion (Week 2)

**Goal:** Complete comprehensive component library

### 2.1 Add Missing Form Components

**Components to Build:**

#### 2.1.1 TextArea

**File:** `packages/components/src/molecules/TextArea/TextArea.tsx`

```typescript
import { ComponentProps } from 'react'
import { TextArea as TamaguiTextArea, YStack, Text } from 'tamagui'

export type TextAreaProps = ComponentProps<typeof TamaguiTextArea> & {
  label?: string
  error?: string
  maxLength?: number
  showCount?: boolean
}

export const TextArea = ({
  label,
  error,
  maxLength,
  showCount,
  value,
  ...props
}: TextAreaProps) => {
  const count = value?.toString().length || 0

  return (
    <YStack gap="$2">
      {label && <Text fontSize="$3" fontWeight="600">{label}</Text>}
      <TamaguiTextArea
        borderColor={error ? '$error' : '$border'}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      {(error || (showCount && maxLength)) && (
        <YStack flexDirection="row" justifyContent="space-between">
          {error && <Text color="$error" fontSize="$2">{error}</Text>}
          {showCount && maxLength && (
            <Text color="$textWeak" fontSize="$2">
              {count}/{maxLength}
            </Text>
          )}
        </YStack>
      )}
    </YStack>
  )
}
```

#### 2.1.2 Checkbox

**File:** `packages/components/src/atoms/Checkbox/Checkbox.tsx`

```typescript
import { ComponentProps, useState } from 'react'
import { XStack, Text, styled } from 'tamagui'
import { Check } from '@tamagui/lucide-icons'

const CheckboxFrame = styled(XStack, {
  width: 24,
  height: 24,
  borderRadius: '$2',
  borderWidth: 2,
  borderColor: '$border',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  
  variants: {
    checked: {
      true: {
        backgroundColor: '$primary',
        borderColor: '$primary',
      },
    },
    indeterminate: {
      true: {
        backgroundColor: '$primary',
        borderColor: '$primary',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  } as const,
})

export type CheckboxProps = {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  label?: string
  onChange?: (checked: boolean) => void
}

export const Checkbox = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  onChange,
}: CheckboxProps) => {
  return (
    <XStack
      gap="$2"
      alignItems="center"
      onPress={() => !disabled && onChange?.(!checked)}
      cursor={disabled ? 'not-allowed' : 'pointer'}
    >
      <CheckboxFrame
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
      >
        {(checked || indeterminate) && (
          <Check size={16} color="white" />
        )}
      </CheckboxFrame>
      {label && (
        <Text
          fontSize="$3"
          color={disabled ? '$textDisabled' : '$text'}
        >
          {label}
        </Text>
      )}
    </XStack>
  )
}
```

#### 2.1.3 Radio & RadioGroup

**File:** `packages/components/src/atoms/Radio/Radio.tsx`

```typescript
import { Circle, XStack, Text } from 'tamagui'

export type RadioProps = {
  selected?: boolean
  label?: string
  disabled?: boolean
  onSelect?: () => void
}

export const Radio = ({
  selected = false,
  label,
  disabled = false,
  onSelect,
}: RadioProps) => {
  return (
    <XStack
      gap="$2"
      alignItems="center"
      onPress={() => !disabled && onSelect?.()}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.5 : 1}
    >
      <Circle
        size={24}
        borderWidth={2}
        borderColor={selected ? '$primary' : '$border'}
        backgroundColor={selected ? '$primary' : 'transparent'}
        alignItems="center"
        justifyContent="center"
      >
        {selected && (
          <Circle size={8} backgroundColor="white" />
        )}
      </Circle>
      {label && <Text fontSize="$3">{label}</Text>}
    </XStack>
  )
}
```

**File:** `packages/components/src/molecules/RadioGroup/RadioGroup.tsx`

```typescript
import { YStack } from 'tamagui'
import { Radio } from '../../atoms/Radio'

export type RadioGroupProps = {
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export const RadioGroup = ({
  options,
  value,
  onChange,
  disabled,
}: RadioGroupProps) => {
  return (
    <YStack gap="$3">
      {options.map((option) => (
        <Radio
          key={option.value}
          label={option.label}
          selected={value === option.value}
          disabled={disabled}
          onSelect={() => onChange?.(option.value)}
        />
      ))}
    </YStack>
  )
}
```

#### 2.1.4 Switch

**File:** `packages/components/src/atoms/Switch/Switch.tsx`

```typescript
import { ComponentProps } from 'react'
import { Switch as TamaguiSwitch, XStack, Text } from 'tamagui'

export type SwitchProps = ComponentProps<typeof TamaguiSwitch> & {
  label?: string
}

export const Switch = ({ label, ...props }: SwitchProps) => {
  return (
    <XStack gap="$2" alignItems="center">
      <TamaguiSwitch {...props} />
      {label && <Text fontSize="$3">{label}</Text>}
    </XStack>
  )
}
```

#### 2.1.5 OTPInput (Critical for Auth)

**File:** `packages/components/src/molecules/OTPInput/OTPInput.tsx`

```typescript
import { useState, useRef } from 'react'
import { TextInput } from 'react-native'
import { XStack, Input, YStack, Text } from 'tamagui'

export type OTPInputProps = {
  length?: 4 | 6
  value?: string
  onChange?: (otp: string) => void
  error?: string
}

export const OTPInput = ({
  length = 6,
  value = '',
  onChange,
  error,
}: OTPInputProps) => {
  const inputs = useRef<Array<TextInput | null>>([])
  const [otp, setOtp] = useState(value.split(''))

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp]
    newOtp[index] = text

    setOtp(newOtp)
    onChange?.(newOtp.join(''))

    // Auto-focus next input
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  return (
    <YStack gap="$2">
      <XStack gap="$2" justifyContent="center">
        {Array.from({ length }).map((_, index) => (
          <Input
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            width={48}
            height={56}
            textAlign="center"
            fontSize="$6"
            fontWeight="bold"
            maxLength={1}
            keyboardType="number-pad"
            value={otp[index] || ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) =>
              handleKeyPress(nativeEvent.key, index)
            }
            borderColor={error ? '$error' : '$border'}
            backgroundColor="$background"
          />
        ))}
      </XStack>
      {error && (
        <Text color="$error" fontSize="$2" textAlign="center">
          {error}
        </Text>
      )}
    </YStack>
  )
}
```

#### 2.1.6 PhoneInput

**File:** `packages/components/src/molecules/PhoneInput/PhoneInput.tsx`

```typescript
import { useState } from 'react'
import { XStack, YStack, Text } from 'tamagui'
import { Input } from '../../atoms/Input'
import { Select } from '../Select'

const countryCodes = [
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IN' },
  // Add more country codes
]

export type PhoneInputProps = {
  value?: string
  onChange?: (phone: string) => void
  defaultCountryCode?: string
  label?: string
  error?: string
}

export const PhoneInput = ({
  value = '',
  onChange,
  defaultCountryCode = '+1',
  label,
  error,
}: PhoneInputProps) => {
  const [countryCode, setCountryCode] = useState(defaultCountryCode)
  const [phoneNumber, setPhoneNumber] = useState(value)

  const handlePhoneChange = (phone: string) => {
    setPhoneNumber(phone)
    onChange?.(`${countryCode}${phone}`)
  }

  return (
    <YStack gap="$2">
      {label && <Text fontSize="$3" fontWeight="600">{label}</Text>}
      <XStack gap="$2">
        <Select
          value={countryCode}
          onValueChange={setCountryCode}
          options={countryCodes.map((c) => ({
            label: `${c.country} ${c.code}`,
            value: c.code,
          }))}
          width={120}
        />
        <Input
          flex={1}
          keyboardType="phone-pad"
          placeholder="Phone number"
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          error={error}
        />
      </XStack>
    </YStack>
  )
}
```

---

### 2.2 Add Feedback Components

#### 2.2.1 ProgressBar

**File:** `packages/components/src/atoms/ProgressBar/ProgressBar.tsx`

```typescript
import { YStack, XStack, Text } from 'tamagui'

export type ProgressBarProps = {
  value: number // 0-100
  showLabel?: boolean
  color?: string
  height?: number
}

export const ProgressBar = ({
  value,
  showLabel = false,
  color = '$primary',
  height = 8,
}: ProgressBarProps) => {
  const clampedValue = Math.min(Math.max(value, 0), 100)

  return (
    <YStack gap="$2">
      <XStack
        width="100%"
        height={height}
        backgroundColor="$backgroundStrong"
        borderRadius="$10"
        overflow="hidden"
      >
        <XStack
          width={`${clampedValue}%`}
          height="100%"
          backgroundColor={color}
          borderRadius="$10"
        />
      </XStack>
      {showLabel && (
        <Text fontSize="$2" color="$textWeak">
          {Math.round(clampedValue)}%
        </Text>
      )}
    </YStack>
  )
}
```

#### 2.2.2 Spinner

**File:** `packages/components/src/atoms/Spinner/Spinner.tsx`

```typescript
import { ActivityIndicator } from 'react-native'
import { YStack, Text, useTheme } from 'tamagui'

export type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  label?: string
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
}

export const Spinner = ({
  size = 'md',
  color,
  label,
}: SpinnerProps) => {
  const theme = useTheme()
  const spinnerColor = color || theme.primary.val

  return (
    <YStack gap="$2" alignItems="center" justifyContent="center">
      <ActivityIndicator
        size={sizeMap[size]}
        color={spinnerColor}
      />
      {label && (
        <Text fontSize="$3" color="$textWeak">
          {label}
        </Text>
      )}
    </YStack>
  )
}
```

#### 2.2.3 AlertDialog

**File:** `packages/components/src/organisms/AlertDialog/AlertDialog.tsx`

```typescript
import { AlertDialog as TamaguiAlertDialog, YStack, XStack, Button, Text } from 'tamagui'

export type AlertDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  variant?: 'default' | 'destructive'
}

export const AlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}: AlertDialogProps) => {
  return (
    <TamaguiAlertDialog open={open} onOpenChange={onOpenChange}>
      <TamaguiAlertDialog.Portal>
        <TamaguiAlertDialog.Overlay
          opacity={0.5}
          backgroundColor="$overlay"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <TamaguiAlertDialog.Content
          padding="$4"
          gap="$4"
          borderRadius="$4"
          backgroundColor="$background"
          maxWidth={400}
        >
          <YStack gap="$2">
            <TamaguiAlertDialog.Title fontSize="$6" fontWeight="bold">
              {title}
            </TamaguiAlertDialog.Title>
            {description && (
              <TamaguiAlertDialog.Description fontSize="$3" color="$textWeak">
                {description}
              </TamaguiAlertDialog.Description>
            )}
          </YStack>

          <XStack gap="$3" justifyContent="flex-end">
            <TamaguiAlertDialog.Cancel asChild>
              <Button
                variant="outline"
                onPress={() => {
                  onCancel?.()
                  onOpenChange(false)
                }}
              >
                {cancelText}
              </Button>
            </TamaguiAlertDialog.Cancel>
            <TamaguiAlertDialog.Action asChild>
              <Button
                backgroundColor={variant === 'destructive' ? '$error' : '$primary'}
                onPress={() => {
                  onConfirm?.()
                  onOpenChange(false)
                }}
              >
                {confirmText}
              </Button>
            </TamaguiAlertDialog.Action>
          </XStack>
        </TamaguiAlertDialog.Content>
      </TamaguiAlertDialog.Portal>
    </TamaguiAlertDialog>
  )
}
```

---

### 2.3 Add Modal & Overlay Components

#### 2.3.1 Modal

**File:** `packages/components/src/organisms/Modal/Modal.tsx`

```typescript
import { Dialog, YStack, XStack, Text, Button } from 'tamagui'
import { X } from '@tamagui/lucide-icons'

export type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: React.ReactNode
  showCloseButton?: boolean
  footer?: React.ReactNode
}

export const Modal = ({
  open,
  onOpenChange,
  title,
  children,
  showCloseButton = true,
  footer,
}: ModalProps) => {
  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          opacity={0.5}
          backgroundColor="$overlay"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          padding="$0"
          gap="$0"
          borderRadius="$4"
          backgroundColor="$background"
          maxWidth={600}
          width="90%"
        >
          {(title || showCloseButton) && (
            <XStack
              padding="$4"
              borderBottomWidth={1}
              borderBottomColor="$border"
              justifyContent="space-between"
              alignItems="center"
            >
              {title && <Dialog.Title fontSize="$5" fontWeight="bold">{title}</Dialog.Title>}
              {showCloseButton && (
                <Dialog.Close asChild>
                  <Button
                    size="$2"
                    circular
                    icon={X}
                    variant="ghost"
                  />
                </Dialog.Close>
              )}
            </XStack>
          )}

          <YStack padding="$4">
            {children}
          </YStack>

          {footer && (
            <XStack
              padding="$4"
              borderTopWidth={1}
              borderTopColor="$border"
              gap="$2"
              justifyContent="flex-end"
            >
              {footer}
            </XStack>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
```

#### 2.3.2 ActionSheet

**File:** `packages/components/src/organisms/ActionSheet/ActionSheet.tsx`

```typescript
import { Sheet, YStack, Button, Text } from 'tamagui'

export type ActionSheetOption = {
  label: string
  onPress: () => void
  variant?: 'default' | 'destructive'
  disabled?: boolean
}

export type ActionSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  options: ActionSheetOption[]
  cancelText?: string
}

export const ActionSheet = ({
  open,
  onOpenChange,
  title,
  options,
  cancelText = 'Cancel',
}: ActionSheetProps) => {
  return (
    <Sheet modal open={open} onOpenChange={onOpenChange} snapPoints={[60]}>
      <Sheet.Overlay opacity={0.5} backgroundColor="$overlay" />
      <Sheet.Frame padding="$4" gap="$2" backgroundColor="$background">
        {title && (
          <Text fontSize="$4" fontWeight="600" textAlign="center" paddingBottom="$2">
            {title}
          </Text>
        )}
        
        <YStack gap="$2">
          {options.map((option, index) => (
            <Button
              key={index}
              size="$4"
              backgroundColor={option.variant === 'destructive' ? '$error' : '$backgroundHover'}
              color={option.variant === 'destructive' ? 'white' : '$text'}
              disabled={option.disabled}
              onPress={() => {
                option.onPress()
                onOpenChange(false)
              }}
            >
              {option.label}
            </Button>
          ))}
          
          <Button
            size="$4"
            variant="outline"
            onPress={() => onOpenChange(false)}
            marginTop="$2"
          >
            {cancelText}
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}
```

---

### 2.4 Add Chat Components

#### 2.4.1 ChatBubble

**File:** `packages/components/src/organisms/ChatBubble/ChatBubble.tsx`

```typescript
import { YStack, XStack, Text } from 'tamagui'
import { Avatar } from '../../atoms/Avatar'

export type ChatBubbleProps = {
  message: string
  timestamp: string
  isSent: boolean
  avatar?: string
  senderName?: string
}

export const ChatBubble = ({
  message,
  timestamp,
  isSent,
  avatar,
  senderName,
}: ChatBubbleProps) => {
  return (
    <XStack
      gap="$2"
      alignSelf={isSent ? 'flex-end' : 'flex-start'}
      maxWidth="80%"
      flexDirection={isSent ? 'row-reverse' : 'row'}
    >
      {!isSent && avatar && (
        <Avatar source={{ uri: avatar }} size={32} />
      )}
      
      <YStack gap="$1">
        {!isSent && senderName && (
          <Text fontSize="$2" color="$textWeak" paddingHorizontal="$3">
            {senderName}
          </Text>
        )}
        
        <YStack
          backgroundColor={isSent ? '$primary' : '$backgroundStrong'}
          padding="$3"
          borderRadius="$4"
          borderTopRightRadius={isSent ? 0 : '$4'}
          borderTopLeftRadius={isSent ? '$4' : 0}
        >
          <Text color={isSent ? 'white' : '$text'} fontSize="$3">
            {message}
          </Text>
        </YStack>
        
        <Text
          fontSize="$1"
          color="$textWeak"
          paddingHorizontal="$3"
          alignSelf={isSent ? 'flex-end' : 'flex-start'}
        >
          {timestamp}
        </Text>
      </YStack>
    </XStack>
  )
}
```

---

### 2.5 Add Auth Components

#### 2.5.1 LoginForm

**File:** `packages/components/src/organisms/LoginForm/LoginForm.tsx`

```typescript
import { useState } from 'react'
import { YStack, Text } from 'tamagui'
import { Input } from '../../atoms/Input'
import { Button } from '../../atoms/Button'

export type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>
  loading?: boolean
  error?: string
}

export const LoginForm = ({
  onSubmit,
  loading = false,
  error,
}: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    await onSubmit(email, password)
  }

  return (
    <YStack gap="$4" padding="$4">
      <Text fontSize="$6" fontWeight="bold" textAlign="center">
        Welcome Back
      </Text>
      
      {error && (
        <Text color="$error" fontSize="$3" textAlign="center">
          {error}
        </Text>
      )}
      
      <Input
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <Button
        onPress={handleSubmit}
        loading={loading}
        disabled={!email || !password || loading}
      >
        Sign In
      </Button>
    </YStack>
  )
}
```

#### 2.5.2 OTPVerification

**File:** `packages/components/src/organisms/OTPVerification/OTPVerification.tsx`

```typescript
import { useState } from 'react'
import { YStack, Text, Button } from 'tamagui'
import { OTPInput } from '../../molecules/OTPInput'

export type OTPVerificationProps = {
  length?: 4 | 6
  onVerify: (otp: string) => Promise<void>
  onResend?: () => Promise<void>
  loading?: boolean
  error?: string
  phoneNumber?: string
}

export const OTPVerification = ({
  length = 6,
  onVerify,
  onResend,
  loading = false,
  error,
  phoneNumber,
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState('')

  const handleVerify = async () => {
    if (otp.length === length) {
      await onVerify(otp)
    }
  }

  return (
    <YStack gap="$4" padding="$4" alignItems="center">
      <Text fontSize="$6" fontWeight="bold">
        Enter Verification Code
      </Text>
      
      {phoneNumber && (
        <Text fontSize="$3" color="$textWeak" textAlign="center">
          We sent a code to {phoneNumber}
        </Text>
      )}
      
      <OTPInput
        length={length}
        value={otp}
        onChange={setOtp}
        error={error}
      />
      
      <Button
        width="100%"
        onPress={handleVerify}
        loading={loading}
        disabled={otp.length !== length || loading}
      >
        Verify
      </Button>
      
      {onResend && (
        <Button variant="ghost" onPress={onResend}>
          Resend Code
        </Button>
      )}
    </YStack>
  )
}
```

---

### 2.6 Update Component Exports

**File:** `packages/components/src/index.ts`

```typescript
// Atoms
export * from './atoms/Avatar'
export * from './atoms/Badge'
export * from './atoms/Button'
export * from './atoms/Card'
export * from './atoms/Input'
export * from './atoms/Skeleton'
export * from './atoms/Checkbox'
export * from './atoms/Radio'
export * from './atoms/Switch'
export * from './atoms/Spinner'
export * from './atoms/ProgressBar'

// Molecules
export * from './molecules/TextArea'
export * from './molecules/RadioGroup'
export * from './molecules/OTPInput'
export * from './molecules/PhoneInput'

// Organisms
export * from './organisms/Modal'
export * from './organisms/AlertDialog'
export * from './organisms/ActionSheet'
export * from './organisms/ChatBubble'
export * from './organisms/LoginForm'
export * from './organisms/OTPVerification'

// Legacy (keep for backwards compatibility)
export * from './Alert'
export * from './Toast'
export * from './Loading'
export * from './Select'
export * from './DatePicker'
export * from './TabBar'
export * from './Header'
export * from './BottomSheet'
export * from './SearchBar'
```

---

## Phase 3: App Scaffolding Automation (Week 3)

**Goal:** Create apps in under 5 minutes

### 3.1 Create App Scaffolding Script

**File:** `tools/src/create-app.ts`

```typescript
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import fs from 'fs-extra'
import path from 'path'
import { execaCommand } from 'execa'

type AppConfig = {
  name: string
  displayName: string
  bundleId: string
  primaryColor: string
  template: 'basic' | 'tabs' | 'auth-flow' | 'full-featured'
}

export async function createApp() {
  console.log(chalk.blue.bold('\n🚀 Create New Expo App\n'))

  // Prompt for app details
  const answers = await inquirer.prompt<AppConfig>([
    {
      type: 'input',
      name: 'name',
      message: 'App name (kebab-case):',
      validate: (input) =>
        /^[a-z][a-z0-9-]*$/.test(input) || 'Must be kebab-case',
    },
    {
      type: 'input',
      name: 'displayName',
      message: 'Display name:',
      default: (answers: AppConfig) =>
        answers.name
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
    },
    {
      type: 'input',
      name: 'bundleId',
      message: 'Bundle identifier:',
      default: (answers: AppConfig) => `com.bdt.${answers.name.replace(/-/g, '')}`,
      validate: (input) =>
        /^[a-z][a-z0-9.]*$/.test(input) || 'Must be reverse domain notation',
    },
    {
      type: 'input',
      name: 'primaryColor',
      message: 'Primary brand color (hex):',
      default: '#007AFF',
      validate: (input) =>
        /^#[0-9A-Fa-f]{6}$/.test(input) || 'Must be a valid hex color',
    },
    {
      type: 'list',
      name: 'template',
      message: 'Choose template:',
      choices: [
        { name: 'Basic (minimal setup)', value: 'basic' },
        { name: 'Tabs (with tab navigation)', value: 'tabs' },
        { name: 'Auth Flow (login + OTP + tabs)', value: 'auth-flow' },
        { name: 'Full Featured (everything)', value: 'full-featured' },
      ],
    },
  ])

  const spinner = ora('Creating app structure...').start()

  try {
    const workspaceRoot = process.cwd()
    const appDir = path.join(workspaceRoot, 'apps', answers.name)

    // Check if app already exists
    if (await fs.pathExists(appDir)) {
      spinner.fail(chalk.red(`App "${answers.name}" already exists!`))
      return
    }

    // Create app directory
    await fs.ensureDir(appDir)

    // Copy template
    const templateDir = path.join(__dirname, '../templates/app', answers.template)
    await fs.copy(templateDir, appDir)

    // Replace template variables
    await replaceTemplateVariables(appDir, answers)

    spinner.succeed(chalk.green('App structure created'))

    // Install dependencies
    spinner.start('Installing dependencies...')
    await execaCommand('pnpm install', { cwd: workspaceRoot })
    spinner.succeed(chalk.green('Dependencies installed'))

    // Success message
    console.log(chalk.green.bold('\n✅ App created successfully!\n'))
    console.log(chalk.cyan('To start your app:\n'))
    console.log(chalk.white(`  cd apps/${answers.name}`))
    console.log(chalk.white(`  pnpm start\n`))
    console.log(chalk.white('Or from the workspace root:\n'))
    console.log(chalk.white(`  pnpm --filter @bdt/${answers.name} start\n`))
  } catch (error) {
    spinner.fail(chalk.red('Failed to create app'))
    console.error(error)
    process.exit(1)
  }
}

async function replaceTemplateVariables(
  dir: string,
  config: AppConfig
) {
  const files = await fs.readdir(dir, { recursive: true })

  for (const file of files) {
    const filePath = path.join(dir, file as string)
    const stat = await fs.stat(filePath)

    if (stat.isFile()) {
      let content = await fs.readFile(filePath, 'utf-8')

      content = content
        .replace(/{{APP_NAME}}/g, config.name)
        .replace(/{{DISPLAY_NAME}}/g, config.displayName)
        .replace(/{{BUNDLE_ID}}/g, config.bundleId)
        .replace(/{{PRIMARY_COLOR}}/g, config.primaryColor)

      await fs.writeFile(filePath, content)
    }
  }
}
```

---

### 3.2 Create App Templates

**Create:** `tools/templates/app/auth-flow/`

**Structure:**
```
tools/templates/app/auth-flow/
├── app.json
├── package.json
├── tsconfig.json
├── tamagui.config.ts
├── metro.config.js
├── babel.config.js
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login.tsx
│   │   │   ├── verify-otp.tsx
│   │   │   └── _layout.tsx
│   │   ├── (tabs)/
│   │   │   ├── index.tsx
│   │   │   ├── profile.tsx
│   │   │   └── _layout.tsx
│   │   ├── +not-found.tsx
│   │   └── _layout.tsx
│   └── providers/
│       └── AppProviders.tsx
└── assets/
```

**File:** `tools/templates/app/auth-flow/package.json`

```json
{
  "name": "@bdt/{{APP_NAME}}",
  "version": "0.1.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@bdt/components": "workspace:*",
    "@bdt/network": "workspace:*",
    "@bdt/ui": "workspace:*",
    "expo": "^54.0.20",
    "expo-router": "^6.0.13",
    "react": "19.1.0",
    "react-native": "^0.81.5",
    "tamagui": "^1.135.4"
  }
}
```

**File:** `tools/templates/app/auth-flow/tamagui.config.ts`

```typescript
import { config as baseConfig } from '@bdt/ui'
import { createTamagui } from '@tamagui/core'

export default createTamagui({
  ...baseConfig,
  themes: {
    ...baseConfig.themes,
    light: {
      ...baseConfig.themes.light,
      primary: '{{PRIMARY_COLOR}}',
    },
  },
})
```

**File:** `tools/templates/app/auth-flow/src/app/(auth)/login.tsx`

```typescript
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { YStack } from 'tamagui'
import { LoginForm } from '@bdt/components'
import { useAuth } from '@bdt/network'

export default function LoginScreen() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (email: string, password: string) => {
    setLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (success) {
        router.replace('/(tabs)')
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <YStack flex={1} justifyContent="center" backgroundColor="$background">
      <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
    </YStack>
  )
}
```

---

### 3.3 Add Root Script

**Update:** `package.json` (root)

```json
{
  "scripts": {
    "create-app": "tsx tools/src/create-app.ts",
    "create-package": "tsx tools/src/create-package.ts"
  }
}
```

---

## Phase 4: Additional Packages (Week 3-4)

### 4.1 Create Utils Package

**Create:** `packages/utils/`

**Structure:**
```
packages/utils/
├── src/
│   ├── validation/
│   │   ├── schemas.ts      # Zod schemas
│   │   └── validators.ts
│   ├── formatters/
│   │   ├── date.ts
│   │   ├── currency.ts
│   │   └── phone.ts
│   ├── constants/
│   │   └── index.ts
│   ├── helpers/
│   │   └── index.ts
│   └── index.ts
└── package.json
```

**File:** `packages/utils/src/validation/schemas.ts`

```typescript
import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password required'),
})

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})
```

---

### 4.2 Split Auth Package

**Create:** `packages/auth/` (extract from network)

**Structure:**
```
packages/auth/
├── src/
│   ├── providers/
│   │   └── AuthProvider.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBiometric.ts
│   │   └── useSession.ts
│   ├── storage/
│   │   └── token-storage.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
└── package.json
```

---

## Timeline Summary

| Week | Phase | Deliverables |
|------|-------|-------------|
| 1 | Infrastructure | Turborepo, CI/CD, Config package, Dependency management |
| 2 | UI Components | 30+ new components, Hooks, Providers |
| 3 | Automation | App scaffolding, Templates, Utils package |
| 4 | Polish | Auth package, Testing, Documentation, Optimization |

---

## Success Metrics

After implementation:

✅ **Create new app:** `pnpm create-app` → 2 minutes  
✅ **First build:** < 2 minutes  
✅ **Cached build:** < 15 seconds  
✅ **Component count:** 50+ production-ready components  
✅ **Test coverage:** > 80%  
✅ **TypeScript errors:** 0  
✅ **CI/CD:** All checks pass  

---

## Next Steps

**Choose your path:**

1. **Full Implementation** - Execute all phases sequentially
2. **Priority-Based** - Start with high-priority items
3. **Iterative** - One phase at a time with validation

**Ready to begin? I can start with:**
- ✅ Phase 1.1: Add Turborepo
- ✅ Phase 2.1: Create missing form components
- ✅ Phase 3.1: Build app scaffolding script

**Which would you like to tackle first?**
