import React, { useState } from 'react';
import { Alert, Linking } from 'react-native';
import { YStack, XStack, Text, Button, Input, Card, Separator } from 'tamagui';
import {
  Truck,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  ExternalLink,
} from '@tamagui/lucide-icons';
import { OrderBasicFragment } from '../../src/graphql/orders/orders.generated';
import { OrderStatus } from '../../src/generated/graphql';
import { useUpdateOrderStatusMutation } from '../../src/graphql/orders/orders.generated';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';

interface ShippingTrackingProps {
  order: OrderBasicFragment;
  onOrderUpdate?: () => void;
}

interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
}

const shippingCarriers = [
  {
    id: 'fedex',
    name: 'FedEx',
    trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=',
  },
  {
    id: 'ups',
    name: 'UPS',
    trackingUrl: 'https://www.ups.com/track?tracknum=',
  },
  {
    id: 'usps',
    name: 'USPS',
    trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=',
  },
  {
    id: 'dhl',
    name: 'DHL',
    trackingUrl:
      'https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=',
  },
];

export function ShippingTracking({
  order,
  onOrderUpdate,
}: ShippingTrackingProps) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo>({
    trackingNumber: '',
    carrier: '',
    estimatedDelivery: '',
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [showShippingForm, setShowShippingForm] = useState(false);

  const [updateOrderStatus] = useUpdateOrderStatusMutation({
    onCompleted: () => {
      showSuccess('Shipping information updated');
      onOrderUpdate?.();
      setIsUpdating(false);
      setShowShippingForm(false);
    },
    onError: error => {
      showError(error.message || 'Failed to update shipping information');
      setIsUpdating(false);
    },
  });

  const isSeller = user?.id === order.sellerId;
  const canUpdateShipping =
    isSeller &&
    (order.status === OrderStatus.Confirmed ||
      order.status === OrderStatus.Processing);

  const handleMarkAsShipped = async () => {
    if (!trackingInfo.trackingNumber || !trackingInfo.carrier) {
      Alert.alert(
        'Error',
        'Please provide tracking number and carrier information'
      );
      return;
    }

    setIsUpdating(true);

    try {
      await updateOrderStatus({
        variables: {
          orderId: order.id,
          status: OrderStatus.Shipped,
          sellerNotes: `Shipped via ${trackingInfo.carrier}. Tracking: ${trackingInfo.trackingNumber}${
            trackingInfo.estimatedDelivery
              ? `. Estimated delivery: ${trackingInfo.estimatedDelivery}`
              : ''
          }`,
        },
      });
    } catch (error) {
      console.error('Shipping update error:', error);
      setIsUpdating(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    Alert.alert(
      'Confirm Delivery',
      'Mark this order as delivered? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Delivered',
          onPress: async () => {
            setIsUpdating(true);
            try {
              await updateOrderStatus({
                variables: {
                  orderId: order.id,
                  status: OrderStatus.Delivered,
                  sellerNotes: 'Order marked as delivered',
                },
              });
            } catch (error) {
              console.error('Delivery update error:', error);
              setIsUpdating(false);
            }
          },
        },
      ]
    );
  };

  const openTrackingUrl = (trackingNumber: string, carrier: string) => {
    const carrierInfo = shippingCarriers.find(
      c => c.id === carrier.toLowerCase()
    );
    if (carrierInfo && trackingNumber) {
      const url = `${carrierInfo.trackingUrl}${trackingNumber}`;
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Could not open tracking URL');
      });
    }
  };

  const parseTrackingFromNotes = () => {
    if (!order.sellerNotes) return null;

    const trackingMatch = order.sellerNotes.match(/Tracking:\s*([A-Z0-9]+)/i);
    const carrierMatch = order.sellerNotes.match(/Shipped via\s*([^.]+)/i);

    if (trackingMatch && carrierMatch) {
      return {
        trackingNumber: trackingMatch[1],
        carrier: carrierMatch[1].trim(),
      };
    }

    return null;
  };

  const existingTracking = parseTrackingFromNotes();

  const getShippingStatusIcon = () => {
    switch (order.status) {
      case OrderStatus.Shipped:
        return <Truck size={24} color='$blue10' />;
      case OrderStatus.Delivered:
        return <CheckCircle size={24} color='$green10' />;
      case OrderStatus.Completed:
        return <CheckCircle size={24} color='$green10' />;
      default:
        return <Package size={24} color='$gray10' />;
    }
  };

  const getShippingStatusText = () => {
    switch (order.status) {
      case OrderStatus.Pending:
        return 'Order pending confirmation';
      case OrderStatus.Confirmed:
        return 'Order confirmed, preparing for shipment';
      case OrderStatus.Processing:
        return 'Order being processed';
      case OrderStatus.Shipped:
        return 'Order shipped';
      case OrderStatus.Delivered:
        return 'Order delivered';
      case OrderStatus.Completed:
        return 'Order completed';
      case OrderStatus.Canceled:
        return 'Order cancelled';
      default:
        return 'Unknown status';
    }
  };

  return (
    <YStack space='$4'>
      <YStack space='$3'>
        <Text fontSize='$6' fontWeight='600'>
          Shipping & Tracking
        </Text>

        {/* Current Status */}
        <Card bordered padding='$3'>
          <XStack alignItems='center' space='$3'>
            {getShippingStatusIcon()}
            <YStack flex={1}>
              <Text fontSize='$4' fontWeight='500'>
                {getShippingStatusText()}
              </Text>
              {order.shippedAt && (
                <Text fontSize='$3' color='$gray11'>
                  Shipped: {new Date(order.shippedAt).toLocaleDateString()}
                </Text>
              )}
              {order.deliveredAt && (
                <Text fontSize='$3' color='$gray11'>
                  Delivered: {new Date(order.deliveredAt).toLocaleDateString()}
                </Text>
              )}
            </YStack>
          </XStack>
        </Card>
      </YStack>

      {/* Existing Tracking Information */}
      {existingTracking && (
        <>
          <Separator />
          <YStack space='$3'>
            <Text fontSize='$5' fontWeight='600'>
              Tracking Information
            </Text>

            <Card bordered padding='$3' backgroundColor='$blue1'>
              <YStack space='$3'>
                <XStack justifyContent='space-between' alignItems='center'>
                  <YStack flex={1}>
                    <Text fontSize='$4' fontWeight='500'>
                      Tracking Number: {existingTracking.trackingNumber}
                    </Text>
                    <Text fontSize='$3' color='$gray11'>
                      Carrier: {existingTracking.carrier}
                    </Text>
                  </YStack>

                  <Button
                    size='$3'
                    backgroundColor='$blue9'
                    color='white'
                    icon={ExternalLink}
                    onPress={() =>
                      openTrackingUrl(
                        existingTracking.trackingNumber,
                        existingTracking.carrier
                      )
                    }
                  >
                    Track
                  </Button>
                </XStack>
              </YStack>
            </Card>
          </YStack>
        </>
      )}

      {/* Shipping Actions for Sellers */}
      {canUpdateShipping && !existingTracking && (
        <>
          <Separator />
          <YStack space='$3'>
            <Text fontSize='$5' fontWeight='600'>
              Ship Order
            </Text>

            {!showShippingForm ? (
              <Button
                backgroundColor='$blue9'
                color='white'
                icon={Truck}
                onPress={() => setShowShippingForm(true)}
              >
                Add Shipping Information
              </Button>
            ) : (
              <Card bordered padding='$4' backgroundColor='$gray1'>
                <YStack space='$3'>
                  <Text fontSize='$4' fontWeight='500'>
                    Shipping Details
                  </Text>

                  <YStack space='$2'>
                    <Text fontSize='$3' color='$gray11'>
                      Carrier *
                    </Text>
                    <YStack space='$2'>
                      {shippingCarriers.map(carrier => (
                        <Button
                          key={carrier.id}
                          size='$3'
                          variant={
                            trackingInfo.carrier === carrier.name
                              ? 'solid'
                              : 'outlined'
                          }
                          backgroundColor={
                            trackingInfo.carrier === carrier.name
                              ? '$blue9'
                              : 'transparent'
                          }
                          color={
                            trackingInfo.carrier === carrier.name
                              ? 'white'
                              : '$blue9'
                          }
                          onPress={() =>
                            setTrackingInfo(prev => ({
                              ...prev,
                              carrier: carrier.name,
                            }))
                          }
                        >
                          {carrier.name}
                        </Button>
                      ))}
                    </YStack>
                  </YStack>

                  <YStack space='$2'>
                    <Text fontSize='$3' color='$gray11'>
                      Tracking Number *
                    </Text>
                    <Input
                      placeholder='Enter tracking number'
                      value={trackingInfo.trackingNumber}
                      onChangeText={text =>
                        setTrackingInfo(prev => ({
                          ...prev,
                          trackingNumber: text,
                        }))
                      }
                    />
                  </YStack>

                  <YStack space='$2'>
                    <Text fontSize='$3' color='$gray11'>
                      Estimated Delivery (Optional)
                    </Text>
                    <Input
                      placeholder='e.g., 2-3 business days'
                      value={trackingInfo.estimatedDelivery}
                      onChangeText={text =>
                        setTrackingInfo(prev => ({
                          ...prev,
                          estimatedDelivery: text,
                        }))
                      }
                    />
                  </YStack>

                  <XStack space='$3' marginTop='$3'>
                    <Button
                      flex={1}
                      backgroundColor='$blue9'
                      color='white'
                      onPress={handleMarkAsShipped}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Mark as Shipped'}
                    </Button>

                    <Button
                      flex={1}
                      variant='outlined'
                      onPress={() => {
                        setShowShippingForm(false);
                        setTrackingInfo({
                          trackingNumber: '',
                          carrier: '',
                          estimatedDelivery: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </XStack>
                </YStack>
              </Card>
            )}
          </YStack>
        </>
      )}

      {/* Delivery Confirmation for Sellers */}
      {isSeller && order.status === OrderStatus.Shipped && (
        <>
          <Separator />
          <YStack space='$3'>
            <Text fontSize='$5' fontWeight='600'>
              Delivery Confirmation
            </Text>
            <Button
              backgroundColor='$green9'
              color='white'
              icon={CheckCircle}
              onPress={handleMarkAsDelivered}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Mark as Delivered'}
            </Button>
          </YStack>
        </>
      )}

      {/* Delivery Information */}
      {order.status === OrderStatus.Delivered ||
      order.status === OrderStatus.Completed ? (
        <>
          <Separator />
          <Card bordered padding='$3' backgroundColor='$green1'>
            <XStack alignItems='center' space='$3'>
              <CheckCircle size={24} color='$green10' />
              <YStack flex={1}>
                <Text fontSize='$4' fontWeight='500' color='$green11'>
                  Order Delivered Successfully
                </Text>
                {order.deliveredAt && (
                  <Text fontSize='$3' color='$green10'>
                    Delivered on{' '}
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </Text>
                )}
              </YStack>
            </XStack>
          </Card>
        </>
      ) : null}
    </YStack>
  );
}
