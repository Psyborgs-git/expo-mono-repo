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
  const spinnerColor = color || theme.primary?.val || '$primary'

  return (
    <YStack gap="$2" alignItems="center" justifyContent="center">
      <ActivityIndicator
        size={sizeMap[size]}
        color={spinnerColor as string}
      />
      {label && (
        <Text fontSize="$3" color="$textWeak">
          {label}
        </Text>
      )}
    </YStack>
  )
}
