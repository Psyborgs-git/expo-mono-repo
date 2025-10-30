import React, { useCallback } from 'react';
import { Alert, Share } from 'react-native';
import { 
  YStack, 
  XStack, 
  Text, 
  Button,
  Card,
  Separator,
  H6,
} from 'tamagui';
import { 
  Copy, 
  Trash2, 
  Edit3, 
  Reply, 
  Forward, 
  Share as ShareIcon,
  Flag,
  Info,
} from '@tamagui/lucide-icons';
import { useDeleteMessageMutation } from '../../src/graphql/chats/chats.generated';
import type { Chat_MessageFragment } from '../../src/graphql/chats/chats.generated';

interface MessageActionsProps {
  message: Chat_MessageFragment;
  isOwn: boolean;
  onClose: () => void;
  onReply?: (message: Chat_MessageFragment) => void;
  onEdit?: (message: Chat_MessageFragment) => void;
  onForward?: (message: Chat_MessageFragment) => void;
  onReport?: (message: Chat_MessageFragment) => void;
}

interface ActionButtonProps {
  icon: React.ComponentType<any>;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

function ActionButton({ icon: Icon, label, onPress, destructive, disabled }: ActionButtonProps) {
  return (
    <Button
      size="$4"
      onPress={onPress}
      disabled={disabled}
      backgroundColor="transparent"
      borderWidth={0}
      color={destructive ? '$red10' : '$color'}
      pressStyle={{ backgroundColor: destructive ? '$red2' : '$gray3' }}
      justifyContent="flex-start"
      paddingHorizontal="$4"
      paddingVertical="$3"
    >
      <XStack alignItems="center" space="$3" flex={1}>
        <Icon size={20} color={destructive ? '$red10' : '$color11'} />
        <Text 
          fontSize="$4" 
          color={destructive ? '$red10' : '$color'}
          fontWeight="500"
        >
          {label}
        </Text>
      </XStack>
    </Button>
  );
}

export function MessageActions({
  message,
  isOwn,
  onClose,
  onReply,
  onEdit,
  onForward,
  onReport,
}: MessageActionsProps) {
  const [deleteMessage, { loading: isDeleting }] = useDeleteMessageMutation({
    onCompleted: () => {
      onClose();
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to delete message. Please try again.');
      console.error('Delete message error:', error);
    },
  });

  // Copy message content to clipboard
  const handleCopy = useCallback(async () => {
    if (!message.content) {
      Alert.alert('Info', 'No text content to copy');
      return;
    }

    try {
      // In a real app, you'd use Expo Clipboard
      // await Clipboard.setStringAsync(message.content);
      Alert.alert('Copied', 'Message copied to clipboard');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to copy message');
    }
  }, [message.content, onClose]);

  // Delete message with confirmation
  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMessage({
                variables: { messageId: message.id },
                optimisticResponse: {
                  deleteMessage: {
                    ...message,
                    content: null, // Mark as deleted
                  },
                },
              });
            } catch (error) {
              console.error('Failed to delete message:', error);
            }
          },
        },
      ]
    );
  }, [deleteMessage, message, onClose]);

  // Edit message
  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(message);
    }
    onClose();
  }, [onEdit, message, onClose]);

  // Reply to message
  const handleReply = useCallback(() => {
    if (onReply) {
      onReply(message);
    }
    onClose();
  }, [onReply, message, onClose]);

  // Forward message
  const handleForward = useCallback(() => {
    if (onForward) {
      onForward(message);
    }
    onClose();
  }, [onForward, message, onClose]);

  // Share message
  const handleShare = useCallback(async () => {
    if (!message.content) {
      Alert.alert('Info', 'No content to share');
      return;
    }

    try {
      await Share.share({
        message: message.content,
        title: 'Shared Message',
      });
      onClose();
    } catch (error) {
      console.error('Failed to share message:', error);
    }
  }, [message.content, onClose]);

  // Report message
  const handleReport = useCallback(() => {
    if (onReport) {
      onReport(message);
    } else {
      Alert.alert(
        'Report Message',
        'Report this message for inappropriate content?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Report',
            style: 'destructive',
            onPress: () => {
              // In a real app, this would send a report to moderators
              Alert.alert('Reported', 'Message has been reported for review');
              onClose();
            },
          },
        ]
      );
    }
  }, [onReport, message, onClose]);

  // Show message info
  const handleInfo = useCallback(() => {
    const formatDate = (timestamp: string) => {
      return new Date(timestamp).toLocaleString();
    };

    Alert.alert(
      'Message Info',
      `Sent: ${formatDate(message.createdAt)}\n` +
      `From: ${message.senderId}\n` +
      `Status: ${message.isRead ? 'Read' : 'Unread'}` +
      (message.readAt ? `\nRead: ${formatDate(message.readAt)}` : ''),
      [{ text: 'OK' }]
    );
  }, [message]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <YStack backgroundColor="$background" borderRadius="$4" overflow="hidden">
      {/* Message Preview */}
      <Card padding="$3" backgroundColor="$gray2" margin="$3" marginBottom="$2">
        <YStack space="$2">
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontSize="$3" fontWeight="600" color="$color">
              {message.senderId}
            </Text>
            <Text fontSize="$2" color="$color">
              {formatTime(message.createdAt)}
            </Text>
          </XStack>
          
          <Text fontSize="$3" color="$color" numberOfLines={3}>
            {message.content || (message.s3Key ? '📎 Attachment' : 'No content')}
          </Text>
        </YStack>
      </Card>

      {/* Actions */}
      <YStack>
        {/* Copy */}
        {message.content && (
          <>
            <ActionButton
              icon={Copy}
              label="Copy Text"
              onPress={handleCopy}
            />
            <Separator />
          </>
        )}

        {/* Reply */}
        {onReply && (
          <>
            <ActionButton
              icon={Reply}
              label="Reply"
              onPress={handleReply}
            />
            <Separator />
          </>
        )}

        {/* Edit (only for own messages) */}
        {isOwn && onEdit && message.content && (
          <>
            <ActionButton
              icon={Edit3}
              label="Edit"
              onPress={handleEdit}
            />
            <Separator />
          </>
        )}

        {/* Forward */}
        {onForward && (
          <>
            <ActionButton
              icon={Forward}
              label="Forward"
              onPress={handleForward}
            />
            <Separator />
          </>
        )}

        {/* Share */}
        {message.content && (
          <>
            <ActionButton
              icon={ShareIcon}
              label="Share"
              onPress={handleShare}
            />
            <Separator />
          </>
        )}

        {/* Message Info */}
        <ActionButton
          icon={Info}
          label="Message Info"
          onPress={handleInfo}
        />

        {/* Report (only for others' messages) */}
        {!isOwn && (
          <>
            <Separator />
            <ActionButton
              icon={Flag}
              label="Report"
              onPress={handleReport}
              destructive
            />
          </>
        )}

        {/* Delete (only for own messages) */}
        {isOwn && (
          <>
            <Separator />
            <ActionButton
              icon={Trash2}
              label="Delete"
              onPress={handleDelete}
              destructive
              disabled={isDeleting}
            />
          </>
        )}
      </YStack>
    </YStack>
  );
}

// Bulk message actions for selected messages
interface BulkMessageActionsProps {
  selectedMessages: Chat_MessageFragment[];
  currentUserId: string;
  onDelete: (messageIds: string[]) => Promise<void>;
  onForward?: (messages: Chat_MessageFragment[]) => void;
  onClearSelection: () => void;
}

export function BulkMessageActions({
  selectedMessages,
  currentUserId,
  onDelete,
  onForward,
  onClearSelection,
}: BulkMessageActionsProps) {
  const ownMessages = selectedMessages.filter(msg => msg.senderId === currentUserId);
  const canDelete = ownMessages.length > 0;
  const canForward = selectedMessages.length > 0;

  const handleBulkDelete = useCallback(() => {
    if (ownMessages.length === 0) {
      Alert.alert('Info', 'You can only delete your own messages');
      return;
    }

    Alert.alert(
      'Delete Messages',
      `Delete ${ownMessages.length} message${ownMessages.length !== 1 ? 's' : ''}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete(ownMessages.map(msg => msg.id));
              onClearSelection();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete messages');
            }
          },
        },
      ]
    );
  }, [ownMessages, onDelete, onClearSelection]);

  const handleBulkForward = useCallback(() => {
    if (onForward) {
      onForward(selectedMessages);
    }
    onClearSelection();
  }, [onForward, selectedMessages, onClearSelection]);

  if (selectedMessages.length === 0) {
    return null;
  }

  return (
    <XStack 
      padding="$3" 
      space="$3" 
      alignItems="center" 
      backgroundColor="$blue2"
      borderTopWidth={1}
      borderTopColor="$borderColor"
    >
      <Text fontSize="$4" fontWeight="600" color="$blue11" flex={1}>
        {selectedMessages.length} selected
      </Text>

      {canForward && onForward && (
        <Button
          size="$3"
          icon={Forward}
          onPress={handleBulkForward}
          chromeless
        />
      )}

      {canDelete && (
        <Button
          size="$3"
          icon={Trash2}
          onPress={handleBulkDelete}
          color="$red10"
          chromeless
        />
      )}

      <Button
        size="$3"
        onPress={onClearSelection}
        chromeless
      >
        Cancel
      </Button>
    </XStack>
  );
}