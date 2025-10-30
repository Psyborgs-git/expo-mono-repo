import { useState } from 'react'
import { YStack, XStack, Text, Button } from 'tamagui'
import { Input } from '../../atoms/Input/Input'
import { Checkbox } from '../../atoms/Checkbox/Checkbox'

export type SignupFormData = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export type SignupFormProps = {
  onSubmit: (data: SignupFormData) => void | Promise<void>
  onSignIn?: () => void
  isLoading?: boolean
  error?: string
}

export const SignupForm = ({
  onSubmit,
  onSignIn,
  isLoading = false,
  error,
}: SignupFormProps) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({})

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async () => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {}

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    await onSubmit({ fullName, email, password, confirmPassword, acceptTerms })
  }

  return (
    <YStack gap="$4" flex={1} maxWidth={400}>
      <YStack gap="$2">
        <Text fontSize="$8" fontWeight="bold">Create Account</Text>
        <Text fontSize="$4" color="$textWeak">Sign up to get started</Text>
      </YStack>

      {error && (
        <YStack padding="$3" backgroundColor="$red5" borderRadius="$2" borderWidth={1} borderColor="$error">
          <Text color="$error" fontSize="$3">{error}</Text>
        </YStack>
      )}

      <YStack gap="$3">
        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="500">Full Name</Text>
          <Input
            value={fullName}
            onChangeText={(text) => {
              setFullName(text)
              setErrors(prev => ({ ...prev, fullName: '' }))
            }}
            placeholder="Enter your full name"
            autoCapitalize="words"
            error={!!errors.fullName}
          />
          {errors.fullName && <Text color="$error" fontSize="$2">{errors.fullName}</Text>}
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="500">Email</Text>
          <Input
            value={email}
            onChangeText={(text) => {
              setEmail(text)
              setErrors(prev => ({ ...prev, email: '' }))
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
          />
          {errors.email && <Text color="$error" fontSize="$2">{errors.email}</Text>}
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="500">Password</Text>
          <Input
            value={password}
            onChangeText={(text) => {
              setPassword(text)
              setErrors(prev => ({ ...prev, password: '' }))
            }}
            placeholder="Create a password"
            secureTextEntry
            error={!!errors.password}
          />
          {errors.password && <Text color="$error" fontSize="$2">{errors.password}</Text>}
        </YStack>

        <YStack gap="$2">
          <Text fontSize="$3" fontWeight="500">Confirm Password</Text>
          <Input
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text)
              setErrors(prev => ({ ...prev, confirmPassword: '' }))
            }}
            placeholder="Confirm your password"
            secureTextEntry
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword && <Text color="$error" fontSize="$2">{errors.confirmPassword}</Text>}
        </YStack>

        <YStack gap="$2">
          <Checkbox
            checked={acceptTerms}
            onChange={(checked) => {
              setAcceptTerms(checked)
              setErrors(prev => ({ ...prev, acceptTerms: '' }))
            }}
            label={
              <XStack gap="$1" flexWrap="wrap">
                <Text fontSize="$3">I accept the</Text>
                <Text fontSize="$3" color="$primary" textDecorationLine="underline">Terms and Conditions</Text>
              </XStack>
            }
          />
          {errors.acceptTerms && <Text color="$error" fontSize="$2">{errors.acceptTerms}</Text>}
        </YStack>
      </YStack>

      <YStack gap="$3">
        <Button
          size="$4"
          backgroundColor="$primary"
          color="white"
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>

        {onSignIn && (
          <XStack justifyContent="center" gap="$2">
            <Text fontSize="$3" color="$textWeak">Already have an account?</Text>
            <Button chromeless padding="$0" onPress={onSignIn}>
              <Text color="$primary" fontSize="$3" fontWeight="600">Sign In</Text>
            </Button>
          </XStack>
        )}
      </YStack>
    </YStack>
  )
}
