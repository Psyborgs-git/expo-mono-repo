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
