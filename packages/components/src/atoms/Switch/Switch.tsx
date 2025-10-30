import { ComponentProps } from 'react'
import { Switch as TamaguiSwitch, XStack, Text } from 'tamagui'

export type SwitchProps = ComponentProps<typeof TamaguiSwitch> & {
  label?: string
}

export const Switch = ({ label, ...props }: SwitchProps) => {
  return (
    <XStack gap="$3" alignItems="center">
      <TamaguiSwitch size="$3" {...props}>
        <TamaguiSwitch.Thumb animation="quick" />
      </TamaguiSwitch>
      {label && <Text fontSize="$3">{label}</Text>}
    </XStack>
  )
}
