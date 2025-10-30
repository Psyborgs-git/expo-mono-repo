import { useState } from 'react'
import { XStack, Button, TextArea as TamaguiTextArea } from 'tamagui'
import { Send, Paperclip } from '@tamagui/lucide-icons'

export type ChatInputProps = {
  onSend: (message: string) => void | Promise<void>
  onAttachment?: () => void
  placeholder?: string
  maxLength?: number
  disabled?: boolean
}

export const ChatInput = ({
  onSend,
  onAttachment,
  placeholder = 'Type a message...',
  maxLength = 1000,
  disabled = false,
}: ChatInputProps) => {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    const trimmed = message.trim()
    if (!trimmed || isSending) return

    setIsSending(true)
    try {
      await onSend(trimmed)
      setMessage('')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <XStack
      gap="$2"
      padding="$3"
      backgroundColor="$background"
      borderTopWidth={1}
      borderTopColor="$border"
      alignItems="flex-end"
    >
      {onAttachment && (
        <Button
          size="$3"
          circular
          icon={Paperclip}
          chromeless
          onPress={onAttachment}
          disabled={disabled || isSending}
        />
      )}

      <TamaguiTextArea
        flex={1}
        value={message}
        onChangeText={setMessage}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled || isSending}
        minHeight={40}
        maxHeight={120}
        size="$4"
        backgroundColor="$backgroundHover"
        borderColor="$border"
        borderRadius="$4"
        onKeyPress={handleKeyPress}
      />

      <Button
        size="$3"
        circular
        icon={Send}
        backgroundColor="$primary"
        color="white"
        onPress={handleSend}
        disabled={!message.trim() || disabled || isSending}
        opacity={!message.trim() || disabled || isSending ? 0.5 : 1}
      />
    </XStack>
  )
}
