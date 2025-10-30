import React from 'react';
import { YStack, XStack, Text, Button } from 'tamagui';
import { OrderStatus, PaymentStatus } from '../../src/generated/graphql';

interface OrderFiltersProps {
  statusFilter: OrderStatus | 'all';
  paymentFilter: PaymentStatus | 'all';
  onStatusFilterChange: (status: OrderStatus | 'all') => void;
  onPaymentFilterChange: (status: PaymentStatus | 'all') => void;
}

export function OrderFilters({
  statusFilter,
  paymentFilter,
  onStatusFilterChange,
  onPaymentFilterChange,
}: OrderFiltersProps) {
  const orderStatuses: (OrderStatus | 'all')[] = [
    'all',
    OrderStatus.Pending,
    OrderStatus.Confirmed,
    OrderStatus.Processing,
    OrderStatus.Shipped,
    OrderStatus.Delivered,
    OrderStatus.Completed,
    OrderStatus.Canceled,
  ];

  const paymentStatuses: (PaymentStatus | 'all')[] = [
    'all',
    PaymentStatus.Pending,
    PaymentStatus.Paid,
    PaymentStatus.Failed,
    PaymentStatus.Refunded,
  ];

  const getStatusLabel = (status: OrderStatus | 'all') => {
    if (status === 'all') return 'All';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  const getPaymentLabel = (status: PaymentStatus | 'all') => {
    if (status === 'all') return 'All';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <YStack space="$3">
      {/* Order Status Filter */}
      <YStack space="$2">
        <Text fontSize="$4" fontWeight="500">Order Status</Text>
        <XStack space="$2" flexWrap="wrap">
          {orderStatuses.map((status) => (
            <Button
              key={status}
              size="$2"
              variant={statusFilter === status ? 'solid' : 'outlined'}
              backgroundColor={statusFilter === status ? '$blue9' : 'transparent'}
              color={statusFilter === status ? 'white' : '$blue9'}
              onPress={() => onStatusFilterChange(status)}
              marginBottom="$2"
            >
              {getStatusLabel(status)}
            </Button>
          ))}
        </XStack>
      </YStack>

      {/* Payment Status Filter */}
      <YStack space="$2">
        <Text fontSize="$4" fontWeight="500">Payment Status</Text>
        <XStack space="$2" flexWrap="wrap">
          {paymentStatuses.map((status) => (
            <Button
              key={status}
              size="$2"
              variant={paymentFilter === status ? 'solid' : 'outlined'}
              backgroundColor={paymentFilter === status ? '$green9' : 'transparent'}
              color={paymentFilter === status ? 'white' : '$green9'}
              onPress={() => onPaymentFilterChange(status)}
              marginBottom="$2"
            >
              {getPaymentLabel(status)}
            </Button>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
}