import { useState, useEffect } from 'react'
import { YStack, Text, Button, XStack } from 'tamagui'
import { OTPInput } from '../../molecules/OTPInput'

export type OTPVerificationProps = {
  onVerify: (code: string) => void | Promise<void>
  onResend?: () => void | Promise<void>
  isLoading?: boolean
  error?: string
  otpLength?: 4 | 6
  phoneNumber?: string
  email?: string
  resendCooldown?: number // seconds
}

export const OTPVerification = ({
  onVerify,
  onResend,
  isLoading = false,
  error,
  otpLength = 6,
  phoneNumber,
  email,
  resendCooldown = 60,
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState('')
  const [resendTimer, setResendTimer] = useState(resendCooldown)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer])

  const handleOTPComplete = async (code: string) => {
    setOtp(code)
    await onVerify(code)
  }

  const handleResend = async () => {
    if (!canResend || !onResend) return
    setCanResend(false)
    setResendTimer(resendCooldown)
    setOtp('')
    await onResend()
  }

  const maskedContact = phoneNumber 
    ? `+${phoneNumber.slice(0, -4).replace(/./g, '*')}${phoneNumber.slice(-4)}`
    : email
    ? `${email.slice(0, 2)}${'*'.repeat(email.indexOf('@') - 4)}${email.slice(email.indexOf('@') - 2)}`
    : ''

  return (
    <YStack gap="$4" flex={1} maxWidth={400} alignItems="center">
      <YStack gap="$2" alignItems="center">
        <Text fontSize="$8" fontWeight="bold">Verify Your Account</Text>
        <Text fontSize="$4" color="$textWeak" textAlign="center">
          We sent a {otpLength}-digit code to
        </Text>
        {maskedContact && (
          <Text fontSize="$4" fontWeight="600">{maskedContact}</Text>
        )}
      </YStack>

      {error && (
        <YStack padding="$3" backgroundColor="$red5" borderRadius="$2" borderWidth={1} borderColor="$error" flex={1} maxWidth="100%">
          <Text color="$error" fontSize="$3" textAlign="center">{error}</Text>
        </YStack>
      )}

      <YStack gap="$4" alignItems="center" flex={1}>
        <OTPInput
          length={otpLength}
          value={otp}
          onChange={setOtp}
          onComplete={handleOTPComplete}
          disabled={isLoading}
        />

        <YStack gap="$2" alignItems="center">
          <Text fontSize="$3" color="$textWeak">Didn't receive the code?</Text>
          {canResend ? (
            <Button chromeless padding="$0" onPress={handleResend} disabled={!onResend}>
              <Text color="$primary" fontSize="$3" fontWeight="600">Resend Code</Text>
            </Button>
          ) : (
            <Text fontSize="$3" color="$textWeak">
              Resend in {resendTimer}s
            </Text>
          )}
        </YStack>
      </YStack>

      {otp.length === otpLength && (
        <Button
          size="$4"
          backgroundColor="$primary"
          color="white"
          onPress={() => handleOTPComplete(otp)}
          disabled={isLoading}
          flex={1}
          maxWidth="100%"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>
      )}
    </YStack>
  )
}
