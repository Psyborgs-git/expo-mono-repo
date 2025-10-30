import { Dialog, YStack, XStack, Text, Button } from 'tamagui'
import { X } from '@tamagui/lucide-icons'
import { ReactNode } from 'react'

export type ModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  children: ReactNode
  showCloseButton?: boolean
  footer?: ReactNode
  maxWidth?: number
}

export const Modal = ({
  open,
  onOpenChange,
  title,
  children,
  showCloseButton = true,
  footer,
  maxWidth = 600,
}: ModalProps) => {
  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          opacity={0.5}
          backgroundColor="$overlay"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          animation="quick"
        />
        <Dialog.Content
          padding="$0"
          gap="$0"
          borderRadius="$4"
          backgroundColor="$background"
          maxWidth={maxWidth}
          flex={1}
          elevate
          bordered
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
          {(title || showCloseButton) && (
            <XStack
              padding="$4"
              borderBottomWidth={1}
              borderBottomColor="$border"
              justifyContent="space-between"
              alignItems="center"
            >
              {title && <Dialog.Title fontSize="$5" fontWeight="bold">{title}</Dialog.Title>}
              {showCloseButton && (
                <Dialog.Close asChild>
                  <Button
                    size="$2"
                    circular
                    icon={X}
                    chromeless
                  />
                </Dialog.Close>
              )}
            </XStack>
          )}

          <YStack padding="$4">
            {children}
          </YStack>

          {footer && (
            <XStack
              padding="$4"
              borderTopWidth={1}
              borderTopColor="$border"
              gap="$2"
              justifyContent="flex-end"
            >
              {footer}
            </XStack>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
