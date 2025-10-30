import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { YStack, XStack, Text, Button, Separator } from 'tamagui';
import {
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
  useUpdatePaymentStatusMutation,
  useCancelOrderMutation,
} from '../../src/graphql/orders/orders.generated';
import { OrderStatusBadge } from '../../components/orders/OrderStatusBadge';
import { PaymentStatusBadge } from '../../components/orders/PaymentStatusBadge';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
import { OrderItemsList } from '../../components/orders/OrderItemsList';
import { OrderActions } from '../../components/orders/OrderActions';
import { PaymentIntegration } from '../../components/orders/PaymentIntegration';
import { PaymentReceipt } from '../../components/orders/PaymentReceipt';
import { ShippingTracking } from '../../components/orders/ShippingTracking';
import { OrderCompletion } from '../../components/orders/OrderCompletion';
import { Loading } from '../../components/atoms/Loading';
import { useToast } from '../../components/hooks/useToast';
import { OrderStatus, PaymentStatus } from '../../src/generated/graphql';

export default function OrderDetailScreen() {
  const params = useLocalSearchParams();
  const orderId = typeof params.id === 'string' ? params.id : '';
  const { showSuccess, showError } = useToast();

  const [isUpdating, setIsUpdating] = useState(false);

  const { data, loading, error, refetch } = useGetOrderQuery({
    variables: { orderId },
    skip: !orderId,
  });

  const [updateOrderStatus] = useUpdateOrderStatusMutation({
    onCompleted: () => {
      showSuccess('Order status updated');
      refetch();
      setIsUpdating(false);
    },
    onError: (error: any) => {
      showError(error.message);
      setIsUpdating(false);
    },
  });

  const [updatePaymentStatus] = useUpdatePaymentStatusMutation({
    onCompleted: () => {
      showSuccess('Payment status updated');
      refetch();
      setIsUpdating(false);
    },
    onError: (error: any) => {
      showError(error.message);
      setIsUpdating(false);
    },
  });

  const [cancelOrder] = useCancelOrderMutation({
    onCompleted: () => {
      showSuccess('Order cancelled');
      refetch();
      setIsUpdating(false);
    },
    onError: (error: any) => {
      showError(error.message);
      setIsUpdating(false);
    },
  });

  const handleStatusUpdate = async (
    status: OrderStatus,
    sellerNotes?: string
  ) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus({
        variables: {
          orderId,
          status,
          sellerNotes,
        },
      });
    } catch (error) {
      console.error('Status update error:', error);
      setIsUpdating(false);
    }
  };

  const handlePaymentUpdate = async (
    paymentStatus: PaymentStatus,
    paymentMethod?: string
  ) => {
    setIsUpdating(true);
    try {
      await updatePaymentStatus({
        variables: {
          orderId,
          paymentStatus,
          paymentMethod,
        },
      });
    } catch (error) {
      console.error('Payment update error:', error);
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setIsUpdating(true);
            try {
              await cancelOrder({ variables: { orderId } });
            } catch (error) {
              console.error('Cancel order error:', error);
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  if (loading) return <Loading />;

  if (error || !data?.order) {
    return (
      <YStack flex={1} alignItems='center' justifyContent='center' space='$3'>
        <Text color='$red10'>Failed to load order</Text>
        <Button onPress={() => refetch()}>Retry</Button>
      </YStack>
    );
  }

  const order = data.order;
  const shippingAddress = order.shippingAddress
    ? JSON.parse(order.shippingAddress)
    : null;

  return (
    <>
      <Stack.Screen
        options={{
          title: `Order ${order.orderNumber}`,
          headerBackTitle: 'Orders',
        }}
      />

      <ScrollView style={{ flex: 1, backgroundColor: '$background' }}>
        <YStack padding='$4' space='$4'>
          {/* Order Header */}
          <YStack space='$3'>
            <XStack justifyContent='space-between' alignItems='center'>
              <Text fontSize='$7' fontWeight='600'>
                Order #{order.orderNumber}
              </Text>
              <YStack alignItems='flex-end' space='$2'>
                <OrderStatusBadge status={order.status} />
                <PaymentStatusBadge status={order.paymentStatus} />
              </YStack>
            </XStack>

            <Text fontSize='$5' fontWeight='600' color='$blue10'>
              ${order.totalAmount.toLocaleString()} {order.currency}
            </Text>

            <Text fontSize='$3' color='$gray11'>
              Created {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </YStack>

          <Separator />

          {/* Order Timeline */}
          <YStack space='$3'>
            <Text fontSize='$6' fontWeight='600'>
              Order Timeline
            </Text>
            <OrderTimeline order={order} />
          </YStack>

          <Separator />

          {/* Buyer & Seller Info */}
          <YStack space='$3'>
            <Text fontSize='$6' fontWeight='600'>
              Order Details
            </Text>

            <XStack space='$4'>
              <YStack flex={1} space='$2'>
                <Text fontSize='$4' fontWeight='500' color='$gray11'>
                  Buyer
                </Text>
                <Text fontSize='$4'>{order.buyer.name}</Text>
                <Text fontSize='$3' color='$gray10'>
                  {order.buyer.email}
                </Text>
                {order.buyerOrg && (
                  <Text fontSize='$3' color='$gray10'>
                    {order.buyerOrg.name}
                  </Text>
                )}
              </YStack>

              <YStack flex={1} space='$2'>
                <Text fontSize='$4' fontWeight='500' color='$gray11'>
                  Seller
                </Text>
                <Text fontSize='$4'>{order.seller.name}</Text>
                <Text fontSize='$3' color='$gray10'>
                  {order.seller.email}
                </Text>
                <Text fontSize='$3' color='$gray10'>
                  {order.sellerOrg.name}
                </Text>
              </YStack>
            </XStack>
          </YStack>

          <Separator />

          {/* Order Items */}
          <YStack space='$3'>
            <Text fontSize='$6' fontWeight='600'>
              Order Items
            </Text>
            <OrderItemsList items={order.orderItems} />
          </YStack>

          {/* Shipping Address */}
          {shippingAddress && (
            <>
              <Separator />
              <YStack space='$3'>
                <Text fontSize='$6' fontWeight='600'>
                  Shipping Address
                </Text>
                <YStack backgroundColor='$gray2' padding='$3' borderRadius='$4'>
                  <Text fontSize='$4'>{shippingAddress.street}</Text>
                  <Text fontSize='$4'>
                    {shippingAddress.city}, {shippingAddress.state}{' '}
                    {shippingAddress.zipCode}
                  </Text>
                  <Text fontSize='$4'>{shippingAddress.country}</Text>
                </YStack>
              </YStack>
            </>
          )}

          {/* Notes */}
          {(order.buyerNotes || order.sellerNotes) && (
            <>
              <Separator />
              <YStack space='$3'>
                <Text fontSize='$6' fontWeight='600'>
                  Notes
                </Text>

                {order.buyerNotes && (
                  <YStack space='$2'>
                    <Text fontSize='$4' fontWeight='500' color='$gray11'>
                      Buyer Notes
                    </Text>
                    <YStack
                      backgroundColor='$gray2'
                      padding='$3'
                      borderRadius='$4'
                    >
                      <Text fontSize='$4'>{order.buyerNotes}</Text>
                    </YStack>
                  </YStack>
                )}

                {order.sellerNotes && (
                  <YStack space='$2'>
                    <Text fontSize='$4' fontWeight='500' color='$gray11'>
                      Seller Notes
                    </Text>
                    <YStack
                      backgroundColor='$gray2'
                      padding='$3'
                      borderRadius='$4'
                    >
                      <Text fontSize='$4'>{order.sellerNotes}</Text>
                    </YStack>
                  </YStack>
                )}
              </YStack>
            </>
          )}

          {/* Payment Integration */}
          <Separator />
          <PaymentIntegration order={order} onPaymentUpdate={() => refetch()} />

          {/* Payment Receipt */}
          <PaymentReceipt order={order} />

          {/* Shipping Tracking */}
          <Separator />
          <ShippingTracking order={order} onOrderUpdate={() => refetch()} />

          {/* Order Completion */}
          <Separator />
          <OrderCompletion order={order} onOrderUpdate={() => refetch()} />

          {/* Order Actions */}
          <Separator />
          <OrderActions
            order={order}
            onStatusUpdate={handleStatusUpdate}
            onPaymentUpdate={handlePaymentUpdate}
            onCancelOrder={handleCancelOrder}
            isUpdating={isUpdating}
          />
        </YStack>
      </ScrollView>
    </>
  );
}
