import React from 'react';
import { Pressable } from 'react-native';
import { YStack, XStack, Text, Card } from 'tamagui';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { OrderBasicFragment } from '../../src/graphql/orders/orders.generated';

interface OrderCardProps {
  order: OrderBasicFragment & { type?: 'buyer' | 'seller' };
  onPress: () => void;
  showType?: boolean;
}

export function OrderCard({ order, onPress, showType = false }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getOrderTypeLabel = () => {
    if (!showType || !order.type) return null;
    return order.type === 'buyer' ? 'Purchase' : 'Sale';
  };

  const getCounterparty = () => {
    if (order.type === 'buyer') {
      return {
        name: order.seller.name,
        org: order.sellerOrg.name,
        label: 'Seller',
      };
    }
    return {
      name: order.buyer.name,
      org: order.buyerOrg?.name || 'Individual',
      label: 'Buyer',
    };
  };

  const counterparty = getCounterparty();

  return (
    <Pressable onPress={onPress}>
      <Card
        elevate
        size="$4"
        bordered
        animation="bouncy"
        hoverTheme
        pressTheme
        marginBottom="$3"
      >
        <Card.Header padded>
          <YStack space="$3">
            {/* Header Row */}
            <XStack justifyContent="space-between" alignItems="flex-start">
              <YStack flex={1} space="$1">
                <XStack alignItems="center" space="$2">
                  <Text fontSize="$5" fontWeight="600">
                    #{order.orderNumber}
                  </Text>
                  {showType && getOrderTypeLabel() && (
                    <Text
                      fontSize="$2"
                      color="$gray11"
                      backgroundColor="$gray4"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      {getOrderTypeLabel()}
                    </Text>
                  )}
                </XStack>
                <Text fontSize="$3" color="$gray11">
                  {formatDate(order.createdAt)}
                </Text>
              </YStack>
              
              <YStack alignItems="flex-end" space="$2">
                <OrderStatusBadge status={order.status} size="small" />
                <PaymentStatusBadge status={order.paymentStatus} size="small" />
              </YStack>
            </XStack>

            {/* Amount */}
            <Text fontSize="$6" fontWeight="600" color="$blue10">
              ${order.totalAmount.toLocaleString()} {order.currency}
            </Text>

            {/* Counterparty Info */}
            <YStack space="$1">
              <Text fontSize="$3" color="$gray11">
                {counterparty.label}
              </Text>
              <Text fontSize="$4" fontWeight="500">
                {counterparty.name}
              </Text>
              <Text fontSize="$3" color="$gray10">
                {counterparty.org}
              </Text>
            </YStack>

            {/* Order Items Count */}
            <Text fontSize="$3" color="$gray11">
              {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
            </Text>
          </YStack>
        </Card.Header>
      </Card>
    </Pressable>
  );
}