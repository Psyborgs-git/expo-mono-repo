import React, { useState } from 'react';
import { Alert } from 'react-native';
import { YStack, XStack, Text, Button, Input } from 'tamagui';
import { ChevronDown } from '@tamagui/lucide-icons';
import { OrderBasicFragment } from '../../src/graphql/orders/orders.generated';
import { OrderStatus, PaymentStatus } from '../../src/generated/graphql';
import { useAuth } from '../../contexts/AuthContext';

interface OrderActionsProps {
  order: OrderBasicFragment;
  onStatusUpdate: (status: OrderStatus, sellerNotes?: string) => void;
  onPaymentUpdate: (paymentStatus: PaymentStatus, paymentMethod?: string) => void;
  onCancelOrder: () => void;
  isUpdating: boolean;
}

export function OrderActions({
  order,
  onStatusUpdate,
  onPaymentUpdate,
  onCancelOrder,
  isUpdating,
}: OrderActionsProps) {
  const { user } = useAuth();
  const [sellerNotes, setSellerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showPaymentUpdate, setShowPaymentUpdate] = useState(false);

  // Check if current user is the seller
  const isSeller = user?.id === order.sellerId;
  const isBuyer = user?.id === order.buyerId;

  // Determine available actions based on order status and user role
  const getAvailableStatusUpdates = (): OrderStatus[] => {
    if (!isSeller) return [];

    switch (order.status) {
      case OrderStatus.Pending:
        return [OrderStatus.Confirmed];
      case OrderStatus.Confirmed:
        return [OrderStatus.Processing];
      case OrderStatus.Processing:
        return [OrderStatus.Shipped];
      case OrderStatus.Shipped:
        return [OrderStatus.Delivered];
      case OrderStatus.Delivered:
        return [OrderStatus.Completed];
      default:
        return [];
    }
  };

  const getAvailablePaymentUpdates = (): PaymentStatus[] => {
    // Both buyer and seller can update payment status in different scenarios
    if (order.paymentStatus === PaymentStatus.Paid) return [];

    if (isSeller) {
      return [PaymentStatus.Paid, PaymentStatus.Failed];
    }

    if (isBuyer) {
      return [PaymentStatus.Paid];
    }

    return [];
  };

  const canCancelOrder = () => {
    return (
      (isBuyer || isSeller) &&
      order.status !== OrderStatus.Completed &&
      order.status !== OrderStatus.Canceled &&
      order.status !== OrderStatus.Delivered
    );
  };

  const availableStatusUpdates = getAvailableStatusUpdates();
  const availablePaymentUpdates = getAvailablePaymentUpdates();

  const handleStatusUpdate = (status: OrderStatus) => {
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    
    Alert.alert(
      `Update Order Status`,
      `Are you sure you want to mark this order as ${statusLabel}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            onStatusUpdate(status, sellerNotes.trim() || undefined);
            setSellerNotes('');
            setShowStatusUpdate(false);
          },
        },
      ]
    );
  };

  const handlePaymentUpdate = (status: PaymentStatus) => {
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    
    Alert.alert(
      `Update Payment Status`,
      `Are you sure you want to mark payment as ${statusLabel}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: () => {
            onPaymentUpdate(status, paymentMethod.trim() || undefined);
            setPaymentMethod('');
            setShowPaymentUpdate(false);
          },
        },
      ]
    );
  };

  if (!isSeller && !isBuyer) {
    return null; // User has no permissions for this order
  }

  return (
    <YStack space="$4">
      <Text fontSize="$6" fontWeight="600">Order Actions</Text>

      {/* Status Update Actions */}
      {availableStatusUpdates.length > 0 && (
        <YStack space="$3">
          <Text fontSize="$4" fontWeight="500">Update Order Status</Text>
          
          {!showStatusUpdate ? (
            <Button
              backgroundColor="$blue9"
              color="white"
              onPress={() => setShowStatusUpdate(true)}
              disabled={isUpdating}
            >
              Update Status
            </Button>
          ) : (
            <YStack space="$3" backgroundColor="$gray2" padding="$3" borderRadius="$4">
              <XStack space="$2" flexWrap="wrap">
                {availableStatusUpdates.map((status) => (
                  <Button
                    key={status}
                    size="$3"
                    backgroundColor="$blue9"
                    color="white"
                    onPress={() => handleStatusUpdate(status)}
                    disabled={isUpdating}
                  >
                    Mark as {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                  </Button>
                ))}
              </XStack>
              
              <YStack space="$2">
                <Text fontSize="$3" color="$gray11">Seller Notes (Optional)</Text>
                <Input
                  placeholder="Add notes about this status update..."
                  value={sellerNotes}
                  onChangeText={setSellerNotes}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  minHeight={60}
                />
              </YStack>
              
              <Button
                variant="outlined"
                onPress={() => {
                  setShowStatusUpdate(false);
                  setSellerNotes('');
                }}
              >
                Cancel
              </Button>
            </YStack>
          )}
        </YStack>
      )}

      {/* Payment Update Actions */}
      {availablePaymentUpdates.length > 0 && (
        <YStack space="$3">
          <Text fontSize="$4" fontWeight="500">Update Payment Status</Text>
          
          {!showPaymentUpdate ? (
            <Button
              backgroundColor="$green9"
              color="white"
              onPress={() => setShowPaymentUpdate(true)}
              disabled={isUpdating}
            >
              Update Payment
            </Button>
          ) : (
            <YStack space="$3" backgroundColor="$gray2" padding="$3" borderRadius="$4">
              <XStack space="$2" flexWrap="wrap">
                {availablePaymentUpdates.map((status) => (
                  <Button
                    key={status}
                    size="$3"
                    backgroundColor="$green9"
                    color="white"
                    onPress={() => handlePaymentUpdate(status)}
                    disabled={isUpdating}
                  >
                    Mark as {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                  </Button>
                ))}
              </XStack>
              
              <YStack space="$2">
                <Text fontSize="$3" color="$gray11">Payment Method (Optional)</Text>
                <Input
                  placeholder="e.g., Credit Card, Bank Transfer, etc."
                  value={paymentMethod}
                  onChangeText={setPaymentMethod}
                />
              </YStack>
              
              <Button
                variant="outlined"
                onPress={() => {
                  setShowPaymentUpdate(false);
                  setPaymentMethod('');
                }}
              >
                Cancel
              </Button>
            </YStack>
          )}
        </YStack>
      )}

      {/* Cancel Order Action */}
      {canCancelOrder() && (
        <YStack space="$3">
          <Text fontSize="$4" fontWeight="500">Cancel Order</Text>
          <Button
            backgroundColor="$red9"
            color="white"
            onPress={onCancelOrder}
            disabled={isUpdating}
          >
            Cancel Order
          </Button>
        </YStack>
      )}

      {/* No Actions Available */}
      {availableStatusUpdates.length === 0 && 
       availablePaymentUpdates.length === 0 && 
       !canCancelOrder() && (
        <YStack alignItems="center" padding="$4">
          <Text color="$gray11" textAlign="center">
            No actions available for this order at the moment.
          </Text>
        </YStack>
      )}
    </YStack>
  );
}