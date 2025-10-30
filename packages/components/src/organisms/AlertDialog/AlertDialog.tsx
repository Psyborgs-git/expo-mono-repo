import { AlertDialog as TamaguiAlertDialog, YStack, XStack, Button, Text } from 'tamagui'

export type AlertDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  variant?: 'default' | 'destructive'
}

export const AlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
}: AlertDialogProps) => {
  return (
    <TamaguiAlertDialog open={open} onOpenChange={onOpenChange}>
      <TamaguiAlertDialog.Portal>
        <TamaguiAlertDialog.Overlay
          opacity={0.5}
          backgroundColor="$overlay"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          animation="quick"
        />
        <TamaguiAlertDialog.Content
          padding="$4"
          gap="$4"
          borderRadius="$4"
          backgroundColor="$background"
          maxWidth={400}
          bordered
          elevate
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
        >
          <YStack gap="$2">
            <TamaguiAlertDialog.Title fontSize="$6" fontWeight="bold">
              {title}
            </TamaguiAlertDialog.Title>
            {description && (
              <TamaguiAlertDialog.Description fontSize="$3" color="$textWeak">
                {description}
              </TamaguiAlertDialog.Description>
            )}
          </YStack>

          <XStack gap="$3" justifyContent="flex-end">
            <TamaguiAlertDialog.Cancel asChild>
              <Button
                chromeless
                onPress={() => {
                  onCancel?.()
                  onOpenChange(false)
                }}
              >
                {cancelText}
              </Button>
            </TamaguiAlertDialog.Cancel>
            <TamaguiAlertDialog.Action asChild>
              <Button
                backgroundColor={variant === 'destructive' ? '$error' : '$primary'}
                color="white"
                onPress={() => {
                  onConfirm?.()
                  onOpenChange(false)
                }}
              >
                {confirmText}
              </Button>
            </TamaguiAlertDialog.Action>
          </XStack>
        </TamaguiAlertDialog.Content>
      </TamaguiAlertDialog.Portal>
    </TamaguiAlertDialog>
  )
}
