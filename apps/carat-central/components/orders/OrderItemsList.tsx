import React from 'react';
import { YStack, XStack, Text, Card } from 'tamagui';
import { OrderItemBasicFragment } from '../../src/graphql/orders/orders.generated';

interface OrderItemsListProps {
  items: OrderItemBasicFragment[];
}

export function OrderItemsList({ items }: OrderItemsListProps) {
  const renderOrderItem = (item: OrderItemBasicFragment) => {
    // Parse diamond snapshot if available
    const diamondInfo = item.diamondSnapshot ? JSON.parse(item.diamondSnapshot) : null;

    return (
      <Card key={item.id} bordered padding="$3" marginBottom="$2">
        <YStack space="$2">
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack flex={1} space="$1">
              <Text fontSize="$4" fontWeight="500">
                Diamond ID: {item.diamondId}
              </Text>
              
              {diamondInfo && (
                <YStack space="$1">
                  {diamondInfo.name && (
                    <Text fontSize="$3" color="$gray11">
                      {diamondInfo.name}
                    </Text>
                  )}
                  
                  <XStack space="$3" flexWrap="wrap">
                    {diamondInfo.carat && (
                      <Text fontSize="$3" color="$gray10">
                        {diamondInfo.carat} ct
                      </Text>
                    )}
                    {diamondInfo.clarity && (
                      <Text fontSize="$3" color="$gray10">
                        {diamondInfo.clarity}
                      </Text>
                    )}
                    {diamondInfo.color && (
                      <Text fontSize="$3" color="$gray10">
                        {diamondInfo.color}
                      </Text>
                    )}
                    {diamondInfo.cut && (
                      <Text fontSize="$3" color="$gray10">
                        {diamondInfo.cut}
                      </Text>
                    )}
                    {diamondInfo.shape && (
                      <Text fontSize="$3" color="$gray10">
                        {diamondInfo.shape}
                      </Text>
                    )}
                  </XStack>
                  
                  {diamondInfo.stockNumber && (
                    <Text fontSize="$3" color="$gray10">
                      Stock: {diamondInfo.stockNumber}
                    </Text>
                  )}
                </YStack>
              )}
            </YStack>
            
            <YStack alignItems="flex-end" space="$1">
              <Text fontSize="$4" fontWeight="600">
                ${item.totalPrice.toLocaleString()}
              </Text>
              <Text fontSize="$3" color="$gray10">
                Qty: {item.quantity}
              </Text>
              <Text fontSize="$3" color="$gray10">
                ${item.pricePerUnit.toLocaleString()} each
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </Card>
    );
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <YStack space="$3">
      {items.map(renderOrderItem)}
      
      {/* Summary */}
      <Card bordered backgroundColor="$gray2" padding="$3">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$4" fontWeight="500">
            Total ({totalItems} item{totalItems !== 1 ? 's' : ''})
          </Text>
          <Text fontSize="$5" fontWeight="600" color="$blue10">
            ${totalValue.toLocaleString()}
          </Text>
        </XStack>
      </Card>
    </YStack>
  );
}