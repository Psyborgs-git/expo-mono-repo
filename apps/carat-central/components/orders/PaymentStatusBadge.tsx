import React from 'react';
import { Text } from 'tamagui';
import { PaymentStatus } from '../../src/generated/graphql';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: 'small' | 'medium' | 'large';
}

export function PaymentStatusBadge({ status, size = 'medium' }: PaymentStatusBadgeProps) {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.Pending:
        return {
          label: 'Payment Pending',
          backgroundColor: '$orange4',
          color: '$orange11',
        };
      case PaymentStatus.Paid:
        return {
          label: 'Paid',
          backgroundColor: '$green4',
          color: '$green11',
        };
      case PaymentStatus.Failed:
        return {
          label: 'Payment Failed',
          backgroundColor: '$red4',
          color: '$red11',
        };
      case PaymentStatus.Refunded:
        return {
          label: 'Refunded',
          backgroundColor: '$gray4',
          color: '$gray11',
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