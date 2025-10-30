import { Sheet, YStack, Button, Text } from 'tamagui'

export type ActionSheetOption = {
  label: string
  onPress: () => void
  variant?: 'default' | 'destructive'
  disabled?: boolean
}

export type ActionSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  options: ActionSheetOption[]
  cancelText?: string
}

export const ActionSheet = ({
  open,
  onOpenChange,
  title,
  options,
  cancelText = 'Cancel',
}: ActionSheetProps) => {
  return (
    <Sheet modal open={open} onOpenChange={onOpenChange} snapPoints={[60]} dismissOnSnapToBottom>
      <Sheet.Overlay opacity={0.5} backgroundColor="$overlay" animation="quick" />
      <Sheet.Frame padding="$4" gap="$2" backgroundColor="$background">
        <Sheet.Handle />
        {title && (
          <Text fontSize="$4" fontWeight="600" textAlign="center" paddingBottom="$2">
            {title}
          </Text>
        )}
        
        <YStack gap="$2">
          {options.map((option, index) => (
            <Button
              key={index}
              size="$4"
              backgroundColor={option.variant === 'destructive' ? '$error' : '$backgroundHover'}
              color={option.variant === 'destructive' ? 'white' : '$text'}
              disabled={option.disabled}
              onPress={() => {
                option.onPress()
                onOpenChange(false)
              }}
            >
              {option.label}
            </Button>
          ))}
          
          <Button
            size="$4"
            chromeless
            onPress={() => onOpenChange(false)}
            marginTop="$2"
          >
            {cancelText}
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}
