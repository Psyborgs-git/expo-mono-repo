import { YStack } from 'tamagui'
import { Radio } from '../../atoms/Radio'

export type RadioGroupProps = {
  options: Array<{ value: string; label: string }>
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export const RadioGroup = ({
  options,
  value,
  onChange,
  disabled,
}: RadioGroupProps) => {
  return (
    <YStack gap="$3">
      {options.map((option) => (
        <Radio
          key={option.value}
          label={option.label}
          selected={value === option.value}
          disabled={disabled}
          onSelect={() => onChange?.(option.value)}
        />
      ))}
    </YStack>
  )
}
