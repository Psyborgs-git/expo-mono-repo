import { useState, useRef, useEffect } from 'react'
import { TextInput } from 'react-native'
import { XStack, Input, YStack, Text } from 'tamagui'

export type OTPInputProps = {
  length?: 4 | 6
  value?: string
  onChange?: (otp: string) => void
  onComplete?: (otp: string) => void
  error?: string
  disabled?: boolean
  autoFocus?: boolean
}

export const OTPInput = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  error,
  disabled = false,
  autoFocus = true,
}: OTPInputProps) => {
  const inputs = useRef<Array<TextInput | null>>([])
  const [otp, setOtp] = useState(value.split('').slice(0, length))

  useEffect(() => {
    if (value !== otp.join('')) {
      setOtp(value.split('').slice(0, length))
    }
  }, [value])

  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return

    const newOtp = [...otp]
    newOtp[index] = text.slice(-1) // Only take the last character

    setOtp(newOtp)
    const otpString = newOtp.join('')
    onChange?.(otpString)
    
    // Call onComplete if all digits are filled
    if (newOtp.every(digit => digit !== '') && newOtp.length === length) {
      onComplete?.(otpString)
    }

    // Auto-focus next input
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    const key = e.nativeEvent.key

    if (key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous
        inputs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        onChange?.(newOtp.join(''))
      }
    }
  }

  return (
    <YStack gap="$2">
      <XStack gap="$2" justifyContent="center">
        {Array.from({ length }).map((_, index) => (
          <Input
            key={index}
            ref={ref => { inputs.current[index] = ref }}
            width={48}
            height={56}
            textAlign="center"
            fontSize="$6"
            fontWeight="bold"
            maxLength={1}
            keyboardType="number-pad"
            value={otp[index] || ''}
            onChangeText={text => handleChange(text, index)}
            onKeyPress={e => handleKeyPress(e, index)}
            borderColor={error ? '$error' : '$border'}
            backgroundColor="$background"
            disabled={disabled}
            opacity={disabled ? 0.5 : 1}
            autoFocus={autoFocus && index === 0}
            selectTextOnFocus
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
