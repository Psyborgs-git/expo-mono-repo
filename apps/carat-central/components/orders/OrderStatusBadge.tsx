import React from 'react';
import { Text } from 'tamagui';
import { OrderStatus } from '../../src/generated/graphql';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'medium' | 'large';
}

export function OrderStatusBadge({ status, size = 'medium' }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return {
          label: 'Pending',
          backgroundColor: '$orange4',
          color: '$orange11',
        };
      case OrderStatus.Confirmed:
        return {
          label: 'Confirmed',
          backgroundColor: '$blue4',
          color: '$blue11',
        };
      case OrderStatus.Processing:
        return {
          label: 'Processing',
          backgroundColor: '$purple4',
          color: '$purple11',
        };
      case OrderStatus.Shipped:
        return {
          label: 'Shipped',
          backgroundColor: '$indigo4',
          color: '$indigo11',
        };
      case OrderStatus.Delivered:
        return {
          label: 'Delivered',
          backgroundColor: '$green4',
          color: '$green11',
        };
      case OrderStatus.Completed:
        return {
          label: 'Completed',
          backgroundColor: '$green4',
          color: '$green11',
        };
      case OrderStatus.Canceled:
        return {
          label: 'Cancelled',
          backgroundColor: '$red4',
          color: '$red11',
        };
      default:
        return {
          label: status,
          backgroundColor: '$gray4',
          color: '$gray11',
        };
    }
  };

  const getSizeConfig = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return {
          fontSize: '$2',
          paddingHorizontal: '$2',
          paddingVertical: '$1',
        };
      case 'large':
        return {
          fontSize: '$4',
          paddingHorizontal: '$4',
          paddingVertical: '$2',
        };
      default:
        return {
          fontSize: '$3',
          paddingHorizontal: '$3',
          paddingVertical: '$1.5',
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const sizeConfig = getSizeConfig(size);

  return (
    <Text
      {...sizeConfig}
      backgroundColor={statusConfig.backgroundColor}
      color={statusConfig.color}
      borderRadius="$3"
      fontWeight="500"
      textAlign="center"
    >
      {statusConfig.label}
    </Text>
  );
}