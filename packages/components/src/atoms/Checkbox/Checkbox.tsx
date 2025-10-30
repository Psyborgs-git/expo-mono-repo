import { XStack, Text, styled } from 'tamagui'
import { Check } from '@tamagui/lucide-icons'
import { ReactNode } from 'react'

const CheckboxFrame = styled(XStack, {
  width: 24,
  height: 24,
  borderRadius: '$2',
  borderWidth: 2,
  borderColor: '$border',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  
  variants: {
    checked: {
      true: {
        backgroundColor: '$primary',
        borderColor: '$primary',
      },
    },
    indeterminate: {
      true: {
        backgroundColor: '$primary',
        borderColor: '$primary',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    },
  } as const,
})
export type CheckboxProps = {
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  label?: string | ReactNode
  onChange?: (checked: boolean) => void
}

export const Checkbox = ({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  onChange,
}: CheckboxProps) => {
  return (
    <XStack
      gap="$2"
      alignItems="center"
      onPress={() => !disabled && onChange?.(!checked)}
      cursor={disabled ? 'not-allowed' : 'pointer'}
    >
      <CheckboxFrame
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
      >
        {(checked || indeterminate) && (
          <Check size={16} color="white" />
        )}
      </CheckboxFrame>
      {label && (
        typeof label === 'string' ? (
          <Text
            fontSize="$3"
            color={disabled ? '$textDisabled' : '$text'}
          >
            {label}
          </Text>
        ) : (
          label
        )
      )}
    </XStack>
  )
}
