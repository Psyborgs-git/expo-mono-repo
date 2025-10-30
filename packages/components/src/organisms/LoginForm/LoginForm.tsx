import { useState } from 'react'
import { YStack, XStack, Text, Button } from 'tamagui'
import { Input } from '../../atoms/Input/Input'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'

export type LoginFormProps = {
  onSubmit: (data: { email: string; password: string; rememberMe: boolean }) => void | Promise<void>
  onForgotPassword?: () => void
  onSignUp?: () => void
  isLoading?: boolean
  error?: string
}

export const LoginForm = ({
  onSubmit,
  onForgotPassword,
  onSignUp,
  isLoading = false,
  error,
}: LoginFormProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async () => {
    // Reset errors
    setEmailError('')
    setPasswordError('')

    // Validate
    let hasError = false
    if (!email) {
      setEmailError('Email is required')
      hasError = true
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email')
      hasError = true
    }

    if (!password) {
      setPasswordError('Password is required')
      hasError = true
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      hasError = true
    }

    if (hasError) return

    await onSubmit({ email, password, rememberMe })
  }

  return (
    <YStack gap="$4" flex={1} maxWidth={400}>
      <YStack gap="$2">
        <Text fontSize="$8" fontWeight="bold">Welcome Back</Text>
        <Text fontSize="$4" color="$textWeak">Sign in to continue</Text>
      </YStack>

      {error && (
        <YStack padding="$3" backgroundColor="$red5" borderRadius="$2" borderWidth={1} borderColor="$error">
          <Text color="$error" fontSize="$3">{error}</Text>
        </YStack>
      )}

      <YStack gap="$3">
        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="500">Email</Text>
          <Input
            value={email}
            onChangeText={(text) => {
              setEmail(text)
              setEmailError('')
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
          />
          {emailError && <Text color="$error" fontSize="$2">{emailError}</Text>}
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="500">Password</Text>
          <Input
            value={password}
            onChangeText={(text) => {
              setPassword(text)
              setPasswordError('')
            }}
            placeholder="Enter your password"
            secureTextEntry
            error={!!passwordError}
          />
          {passwordError && <Text color="$error" fontSize="$2">{passwordError}</Text>}
        </YStack>

        <XStack justifyContent="space-between" alignItems="center">
          <Checkbox
            checked={rememberMe}
            onChange={setRememberMe}
            label="Remember me"
          />
          {onForgotPassword && (
            <Button chromeless onPress={onForgotPassword} padding="$0">
              <Text color="$primary" fontSize="$3">Forgot password?</Text>
            </Button>
          )}
        </XStack>
      </YStack>

      <YStack gap="$3">
        <Button
          size="$4"
          backgroundColor="$primary"
          color="white"
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>

        {onSignUp && (
          <XStack justifyContent="center" gap="$2">
            <Text fontSize="$3" color="$textWeak">Don't have an account?</Text>
            <Button chromeless padding="$0" onPress={onSignUp}>
              <Text color="$primary" fontSize="$3" fontWeight="600">Sign Up</Text>
            </Button>
          </XStack>
        )}
      </YStack>
    </YStack>
  )
}
