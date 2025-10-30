import React from 'react';
import { XStack, YStack, Text } from 'tamagui';
import { Avatar } from '../atoms/Avatar';

export interface MessageBubbleProps {
  message: string;
  timestamp: string;
  variant?: 'sent' | 'received';
  senderName?: string;
  senderAvatar?: string;
  isRead?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  timestamp,
  variant = 'received',
  senderName,
  senderAvatar,
  isRead = false,
}) => {
  const isSent = variant === 'sent';
  return (
    <XStack
      width='100%'
      justifyContent={isSent ? 'flex-end' : 'flex-start'}
      paddingHorizontal='$4'
      paddingVertical='$2'
    >
      <XStack
        maxWidth='75%'
        flexDirection={isSent ? 'row-reverse' : 'row'}
        space='$2'
      >
        {!isSent && senderAvatar ? (
          <Avatar src={senderAvatar} fallback={senderName} size='sm' />
        ) : null}
        <YStack
          backgroundColor={isSent ? '$primary' : '$backgroundStrong'}
          borderRadius='$4'
          padding='$3'
          maxWidth='100%'
        >
          {!isSent && senderName ? (
            <Text fontSize='$2' fontWeight={600}>
              {senderName}
            </Text>
          ) : null}
          <Text fontSize='$3' color={isSent ? 'white' : '$color'}>
            {message}
          </Text>
          <XStack justifyContent='flex-end' alignItems='center' space='$2'>
            <Text
              fontSize='$1'
              color={isSent ? 'rgba(255,255,255,0.7)' : '$colorPress'}
            >
              {new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            {isSent && (
              <Text
                fontSize='$1'
                color={isRead ? '$success' : 'rgba(255,255,255,0.7)'}
              >
                {isRead ? '✓✓' : '✓'}
              </Text>
            )}
          </XStack>
        </YStack>
      </XStack>
    </XStack>
  );
};

MessageBubble.displayName = 'MessageBubble';
