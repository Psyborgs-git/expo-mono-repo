import { useState } from 'react'
import { XStack, YStack, Text, Button } from 'tamagui'
import { Input } from '../../atoms/Input/Input'
import { ChevronDown } from '@tamagui/lucide-icons'

const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
]

export type PhoneInputProps = {
  value?: string
  onChange?: (phone: string) => void
  defaultCountryCode?: string
  label?: string
  error?: string
  placeholder?: string
}

export const PhoneInput = ({
  value = '',
  onChange,
  defaultCountryCode = '+1',
  label,
  error,
  placeholder = 'Phone number',
}: PhoneInputProps) => {
  const [countryCode, setCountryCode] = useState(defaultCountryCode)
  const [phoneNumber, setPhoneNumber] = useState(value)

  const handlePhoneChange = (phone: string) => {
    // Only allow numbers
    const cleaned = phone.replace(/[^\d]/g, '')
    setPhoneNumber(cleaned)
    onChange?.(`${countryCode}${cleaned}`)
  }

  const currentCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0]

  return (
    <YStack gap="$2">
      {label && <Text fontSize="$3" fontWeight="600">{label}</Text>}
      <XStack gap="$2" alignItems="center">
        <Button
          size="$4"
          width={100}
          backgroundColor="$backgroundStrong"
          borderWidth={1}
          borderColor="$border"
          onPress={() => {
            // Cycle through country codes (simple implementation)
            const currentIndex = countryCodes.findIndex(c => c.code === countryCode)
            const nextIndex = (currentIndex + 1) % countryCodes.length
            const nextCode = countryCodes[nextIndex].code
            setCountryCode(nextCode)
            onChange?.(`${nextCode}${phoneNumber}`)
          }}
        >
          <XStack gap="$1" alignItems="center">
            <Text>{currentCountry.flag} {currentCountry.code}</Text>
            <ChevronDown size={14} />
          </XStack>
        </Button>
        <Input
          flex={1}
          inputSize="md"
          placeholder={placeholder}
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          error={error}
          fullWidth
        />
      </XStack>
    </YStack>
  )
}
