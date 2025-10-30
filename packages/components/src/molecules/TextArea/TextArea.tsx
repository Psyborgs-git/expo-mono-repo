import { ComponentProps } from 'react'
import { TextArea as TamaguiTextArea, YStack, XStack, Text } from 'tamagui'

export type TextAreaProps = ComponentProps<typeof TamaguiTextArea> & {
  label?: string
  error?: string
  maxLength?: number
  showCount?: boolean
  helperText?: string
}

export const TextArea = ({
  label,
  error,
  maxLength,
  showCount,
  helperText,
  value,
  ...props
}: TextAreaProps) => {
  const count = value?.toString().length || 0

  return (
    <YStack gap="$2">
      {label && (
        <Text fontSize="$3" fontWeight="600" color="$text">
          {label}
        </Text>
      )}
      <TamaguiTextArea
        borderColor={error ? '$error' : '$border'}
        borderWidth={1}
        borderRadius="$3"
        padding="$3"
        fontSize="$3"
        backgroundColor="$background"
        maxLength={maxLength}
        value={value}
        placeholderTextColor="$placeholder"
        {...props}
      />
      {(error || helperText || (showCount && maxLength)) && (
        <XStack justifyContent="space-between" alignItems="center">
          {(error || helperText) && (
            <Text color={error ? '$error' : '$textWeak'} fontSize="$2" flex={1}>
              {error || helperText}
            </Text>
          )}
          {showCount && maxLength && (
            <Text color={count > maxLength ? '$error' : '$textWeak'} fontSize="$2">
              {count}/{maxLength}
            </Text>
          )}
        </XStack>
      )}
    </YStack>
  )
}
