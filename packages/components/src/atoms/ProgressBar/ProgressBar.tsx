import { XStack, YStack, Text } from 'tamagui'

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
