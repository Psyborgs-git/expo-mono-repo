import React, { useState } from 'react';
import { styled } from 'tamagui';
import { YStack, XStack, Paragraph, Button, Checkbox } from 'tamagui';
import {
  Edit3 as Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Share,
} from '@tamagui/lucide-icons';
import { DiamondCard } from '../molecules/DiamondCard';
import Alert from '../ui/Alert';
import { Diamond_BasicFragment } from '../../src/graphql/diamonds/diamonds.generated';

// Convert GraphQL fragment to DiamondType
const convertDiamondType = (diamond: Diamond_BasicFragment): DiamondType => ({
  id: diamond.id,
  name: diamond.name || '',
  carat: diamond.carat,
  clarity: diamond.clarity,
  color: diamond.color,
  cut: diamond.cut,
  shape: diamond.shape,
  pricePerCarat: diamond.pricePerCarat,
  totalPrice: diamond.totalPrice,
  status: diamond.status as 'AVAILABLE' | 'RESERVED' | 'SOLD',
  stockNumber: diamond.stockNumber || '',
  certificate: diamond.certificate || '',
  isPublic: diamond.isPublic,
});

// Inventory card container
export const InventoryCardContainer = styled(YStack, {
  name: 'InventoryCardContainer',
  position: 'relative',
});

// Selection checkbox
export const SelectionCheckbox = styled(Checkbox, {
  name: 'SelectionCheckbox',
  position: 'absolute',
  top: '$2',
  left: '$2',
  zIndex: 10,
  backgroundColor: '$background',
  borderRadius: '$2',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 2,
});

// Action buttons container
export const ActionButtons = styled(XStack, {
  name: 'ActionButtons',
  gap: '$2',
  marginTop: '$2',
  flexWrap: 'wrap',
});

// Status indicator
export const StatusIndicator = styled(XStack, {
  name: 'StatusIndicator',
  position: 'absolute',
  top: '$2',
  right: '$2',
  backgroundColor: '$background',
  borderRadius: '$2',
  paddingHorizontal: '$2',
  paddingVertical: '$1',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 2,

  variants: {
    status: {
      AVAILABLE: {
        backgroundColor: '$successLight',
      },
      RESERVED: {
        backgroundColor: '$warningLight',
      },
      SOLD: {
        backgroundColor: '$gray3',
      },
    },
    isPublic: {
      true: {
        borderWidth: 2,
        borderColor: '$primary',
      },
      false: {
        borderWidth: 1,
        borderColor: '$gray5',
      },
    },
  },
});

export const StatusText = styled(Paragraph, {
  name: 'StatusText',
  fontSize: '$1',
  fontWeight: '600',
  color: '$gray12',
});

// Props interface
export interface InventoryDiamondCardProps {
  diamond: Diamond_BasicFragment;
  variant?: 'compact' | 'detailed';
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (diamondId: string, selected: boolean) => void;
  onView?: (diamond: Diamond_BasicFragment) => void;
  onEdit?: (diamond: Diamond_BasicFragment) => void;
  onDelete?: (diamond: Diamond_BasicFragment) => void;
  onPublish?: (diamond: Diamond_BasicFragment) => void;
  onUnpublish?: (diamond: Diamond_BasicFragment) => void;
  onDuplicate?: (diamond: Diamond_BasicFragment) => void;
  onShare?: (diamond: Diamond_BasicFragment) => void;
  showActions?: boolean;
}

export const InventoryDiamondCard: React.FC<InventoryDiamondCardProps> = ({
  diamond,
  variant = 'compact',
  selectable = false,
  selected = false,
  onSelect,
  onView,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onDuplicate,
  onShare,
  showActions = true,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Convert to DiamondType for the base component
  const diamondType = convertDiamondType(diamond);

  // Handle selection change
  const handleSelectionChange = (checked: boolean) => {
    onSelect?.(diamond.id, checked);
  };

  // Handle card press
  const handleCardPress = () => {
    onView?.(diamond);
  };

  // Handle edit
  const handleEdit = (e: any) => {
    e.stopPropagation();
    onEdit?.(diamond);
  };

  // Handle delete with confirmation
  const handleDelete = (e: any) => {
    e.stopPropagation();
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    onDelete?.(diamond);
    setShowDeleteAlert(false);
  };

  // Handle publish/unpublish
  const handleTogglePublish = (e: any) => {
    e.stopPropagation();
    if (diamond.isPublic) {
      onUnpublish?.(diamond);
    } else {
      onPublish?.(diamond);
    }
  };

  // Handle duplicate
  const handleDuplicate = (e: any) => {
    e.stopPropagation();
    onDuplicate?.(diamond);
  };

  // Handle share
  const handleShare = (e: any) => {
    e.stopPropagation();
    onShare?.(diamond);
  };

  return (
    <InventoryCardContainer>
      {/* Selection checkbox */}
      {selectable && (
        <SelectionCheckbox
          checked={selected}
          onCheckedChange={handleSelectionChange}
        />
      )}

      {/* Status indicator */}
      <StatusIndicator>
        <StatusText>{diamond.isPublic ? 'PUBLIC' : 'PRIVATE'}</StatusText>
      </StatusIndicator>

      {/* Base diamond card */}
      <DiamondCard
        diamond={diamondType}
        variant={variant}
        onPress={handleCardPress}
        showActions={false}
        showStatus={false}
      />

      {/* Action buttons */}
      {showActions && (
        <ActionButtons>
          <Button
            size='$2'
            variant='outlined'
            onPress={handleCardPress}
            flex={1}
          >
            <Eye size={14} />
            View
          </Button>

          <Button size='$2' variant='outlined' onPress={handleEdit} flex={1}>
            <Edit size={14} />
            Edit
          </Button>

          <Button
            size='$2'
            variant='outlined'
            onPress={handleTogglePublish}
            flex={1}
            backgroundColor={diamond.isPublic ? '$primary' : '$background'}
          >
            {diamond.isPublic ? <EyeOff size={14} /> : <Eye size={14} />}
            {diamond.isPublic ? 'Unpublish' : 'Publish'}
          </Button>

          <Button
            size='$2'
            variant='outlined'
            onPress={handleDuplicate}
            circular
          >
            <Copy size={14} />
          </Button>

          <Button size='$2' variant='outlined' onPress={handleShare} circular>
            <Share size={14} />
          </Button>

          <Button
            size='$2'
            variant='outlined'
            onPress={handleDelete}
            circular
            borderColor='$red9'
            color='$red9'
          >
            <Trash2 size={14} />
          </Button>
        </ActionButtons>
      )}

      {/* Delete confirmation alert */}
      {showDeleteAlert && (
        <Alert
          variant='error'
          title='Delete Diamond'
          description={`Are you sure you want to delete "${diamond.name || 'this diamond'}"? This action cannot be undone.`}
          actions={[
            {
              label: 'Cancel',
              onPress: () => setShowDeleteAlert(false),
              variant: 'outlined',
            },
            {
              label: 'Delete',
              onPress: confirmDelete,
              variant: 'primary',
              destructive: true,
            },
          ]}
          dismissible
          onDismiss={() => setShowDeleteAlert(false)}
        />
      )}
    </InventoryCardContainer>
  );
};
