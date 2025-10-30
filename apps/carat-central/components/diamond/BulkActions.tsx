import React, { useState } from 'react';
import { styled } from 'tamagui';
import {
  XStack,
  YStack,
  Paragraph,
  Button,
  Checkbox,
  Sheet,
  H4,
} from 'tamagui';
import {
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Share,
  X,
  CheckSquare,
  Square,
} from '@tamagui/lucide-icons';
import Alert from '../ui/Alert';

// Bulk actions bar
export const BulkActionsBar = styled(XStack, {
  name: 'BulkActionsBar',
  backgroundColor: '$primaryLight',
  borderTopWidth: 1,
  borderTopColor: '$primary',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$3',

  variants: {
    visible: {
      true: {
        display: 'flex',
      },
      false: {
        display: 'none',
      },
    },
  },
});

// Selection info
export const SelectionInfo = styled(XStack, {
  name: 'SelectionInfo',
  alignItems: 'center',
  gap: '$2',
});

export const SelectionText = styled(Paragraph, {
  name: 'SelectionText',
  fontSize: '$3',
  fontWeight: '600',
  color: '$primary',
});

// Action buttons
export const ActionButtons = styled(XStack, {
  name: 'ActionButtons',
  gap: '$2',
});

export const ActionButton = styled(Button, {
  name: 'ActionButton',
  size: '$3',
  variant: 'outlined',
  borderColor: '$primary',
  color: '$primary',

  pressStyle: {
    backgroundColor: '$primary',
    color: '$colorInverse',
  },
});

// Props interface
export interface BulkActionsProps {
  selectedCount: number;
  totalCount: number;
  visible: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkDelete: () => void;
  onBulkPublish: () => void;
  onBulkUnpublish: () => void;
  onBulkDuplicate?: () => void;
  onBulkShare?: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  totalCount,
  visible,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkPublish,
  onBulkUnpublish,
  onBulkDuplicate,
  onBulkShare,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showActionsSheet, setShowActionsSheet] = useState(false);

  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  // Handle select all toggle
  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      onClearSelection();
    } else {
      onSelectAll();
    }
  };

  // Handle delete with confirmation
  const handleDelete = () => {
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    onBulkDelete();
    setShowDeleteAlert(false);
  };

  // Handle publish
  const handlePublish = () => {
    onBulkPublish();
    setShowActionsSheet(false);
  };

  // Handle unpublish
  const handleUnpublish = () => {
    onBulkUnpublish();
    setShowActionsSheet(false);
  };

  // Handle duplicate
  const handleDuplicate = () => {
    onBulkDuplicate?.();
    setShowActionsSheet(false);
  };

  // Handle share
  const handleShare = () => {
    onBulkShare?.();
    setShowActionsSheet(false);
  };

  if (!visible) return null;

  return (
    <>
      <BulkActionsBar visible={visible}>
        <SelectionInfo>
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAllToggle}
          />
          <SelectionText>
            {selectedCount} of {totalCount} selected
          </SelectionText>
        </SelectionInfo>

        <ActionButtons>
          <ActionButton onPress={() => setShowActionsSheet(true)}>
            Actions
          </ActionButton>

          <ActionButton onPress={handleDelete} color='$red10'>
            <Trash2 size={16} />
          </ActionButton>

          <ActionButton onPress={onClearSelection}>
            <X size={16} />
          </ActionButton>
        </ActionButtons>
      </BulkActionsBar>

      {/* Actions sheet */}
      <Sheet
        modal
        open={showActionsSheet}
        onOpenChange={setShowActionsSheet}
        snapPoints={[50]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding='$4'>
          <YStack gap='$4'>
            <XStack alignItems='center' justifyContent='space-between'>
              <H4>Bulk Actions</H4>
              <Button
                size='$3'
                variant='ghost'
                onPress={() => setShowActionsSheet(false)}
                circular
              >
                <X size={20} />
              </Button>
            </XStack>

            <Paragraph color='$colorPress'>
              {selectedCount} diamonds selected
            </Paragraph>

            <YStack gap='$3'>
              <Button
                size='$4'
                variant='outlined'
                onPress={handlePublish}
                justifyContent='flex-start'
              >
                <Eye size={20} />
                Publish Selected
              </Button>

              <Button
                size='$4'
                variant='outlined'
                onPress={handleUnpublish}
                justifyContent='flex-start'
              >
                <EyeOff size={20} />
                Unpublish Selected
              </Button>

              {onBulkDuplicate && (
                <Button
                  size='$4'
                  variant='outlined'
                  onPress={handleDuplicate}
                  justifyContent='flex-start'
                >
                  <Copy size={20} />
                  Duplicate Selected
                </Button>
              )}

              {onBulkShare && (
                <Button
                  size='$4'
                  variant='outlined'
                  onPress={handleShare}
                  justifyContent='flex-start'
                >
                  <Share size={20} />
                  Share Selected
                </Button>
              )}

              <Button
                size='$4'
                variant='outlined'
                onPress={handleDelete}
                justifyContent='flex-start'
                color='$red10'
                borderColor='$red10'
              >
                <Trash2 size={20} />
                Delete Selected
              </Button>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>

      {/* Delete confirmation alert */}
      <Alert
        visible={showDeleteAlert}
        title='Delete Diamonds'
        message={`Are you sure you want to delete ${selectedCount} diamond${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`}
        buttons={[
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setShowDeleteAlert(false),
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: confirmDelete,
          },
        ]}
        onDismiss={() => setShowDeleteAlert(false)}
      />
    </>
  );
};
