import React from 'react';
import { Dialog, XStack, Button, Text } from 'tamagui';

export const ConfirmDialog: React.FC<any> = ({
  open,
  onClose,
  title,
  children,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <Dialog.Content>
        <XStack flexDirection='column' padding='$3' space='$3'>
          <Text fontWeight={700}>{title}</Text>
          <Text>{children}</Text>
          <XStack>
            <Button variant='outlined' onPress={onClose}>
              Cancel
            </Button>
            <Button onPress={onConfirm}>Confirm</Button>
          </XStack>
        </XStack>
      </Dialog.Content>
    </Dialog>
  );
};

export default ConfirmDialog;
