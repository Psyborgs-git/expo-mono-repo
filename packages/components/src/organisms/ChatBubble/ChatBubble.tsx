import { YStack, XStack, Text, Avatar } from 'tamagui'

export type ChatBubbleProps = {
  message: string
  timestamp: string
  variant?: 'sent' | 'received'
  senderName?: string
  senderAvatar?: string
  showAvatar?: boolean
}

export const ChatBubble = ({
  message,
  timestamp,
  variant = 'received',
  senderName,
  senderAvatar,
  showAvatar = true,
}: ChatBubbleProps) => {
  const isSent = variant === 'sent'

  return (
    <XStack
      gap="$2"
      alignItems="flex-end"
      justifyContent={isSent ? 'flex-end' : 'flex-start'}
      flex={1}
    >
      {!isSent && showAvatar && (
        <Avatar circular size="$3">
          {senderAvatar ? (
            <Avatar.Image src={senderAvatar} />
          ) : (
            <Avatar.Fallback backgroundColor="$primary">
              <Text color="white" fontSize="$3" fontWeight="600">
                {senderName?.charAt(0).toUpperCase() || '?'}
              </Text>
            </Avatar.Fallback>
          )}
        </Avatar>
      )}

      <YStack
        gap="$1"
        maxWidth="70%"
        alignItems={isSent ? 'flex-end' : 'flex-start'}
      >
        {!isSent && senderName && (
          <Text fontSize="$2" color="$textWeak" paddingHorizontal="$2">
            {senderName}
          </Text>
        )}
        
        <YStack
          padding="$3"
          borderRadius="$4"
          backgroundColor={isSent ? '$primary' : '$backgroundHover'}
          borderTopRightRadius={isSent ? '$1' : '$4'}
          borderTopLeftRadius={!isSent ? '$1' : '$4'}
        >
          <Text
            color={isSent ? 'white' : '$text'}
            fontSize="$4"
            lineHeight="$4"
          >
            {message}
          </Text>
        </YStack>

        <Text fontSize="$1" color="$textWeak" paddingHorizontal="$2">
          {timestamp}
        </Text>
      </YStack>

      {isSent && showAvatar && (
        <Avatar circular size="$3">
          {senderAvatar ? (
            <Avatar.Image src={senderAvatar} />
          ) : (
            <Avatar.Fallback backgroundColor="$primary">
              <Text color="white" fontSize="$3" fontWeight="600">
                {senderName?.charAt(0).toUpperCase() || 'Y'}
              </Text>
            </Avatar.Fallback>
          )}
        </Avatar>
      )}
    </XStack>
  )
}
