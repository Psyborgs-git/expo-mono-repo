import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { YStack, XStack, Text, Button, Input, Separator } from 'tamagui';
import { useCreateOrderMutation } from '../../src/graphql/orders/orders.generated';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/hooks/useToast';

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CreateOrderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { organization } = useAuth();
  const { showSuccess, showError } = useToast();

  // Parse diamond IDs from params (could be comma-separated string)
  const diamondIds =
    typeof params.diamondIds === 'string'
      ? params.diamondIds.split(',')
      : Array.isArray(params.diamondIds)
        ? params.diamondIds
        : [];

  const sellerOrgId =
    typeof params.sellerOrgId === 'string' ? params.sellerOrgId : '';

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [buyerNotes, setBuyerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createOrder] = useCreateOrderMutation({
    onCompleted: data => {
      showSuccess(
        `Order ${data.createOrder.orderNumber} created successfully!`
      );
      router.push(`/orders/${data.createOrder.id}`);
    },
    onError: error => {
      showError(error.message || 'Failed to create order');
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async () => {
    if (!diamondIds.length) {
      Alert.alert('Error', 'No diamonds selected for order');
      return;
    }

    if (!sellerOrgId) {
      Alert.alert('Error', 'Seller organization not specified');
      return;
    }

    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.country
    ) {
      Alert.alert('Error', 'Please fill in required shipping address fields');
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrder({
        variables: {
          diamondIds,
          sellerOrgId,
          shippingAddress: JSON.stringify(shippingAddress),
          buyerNotes: buyerNotes.trim() || undefined,
        },
      });
    } catch (error) {
      console.error('Order creation error:', error);
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    // This would normally calculate based on selected diamonds
    // For now, we'll show a placeholder
    return 0;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Create Order',
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView style={{ flex: 1, backgroundColor: '$background' }}>
        <YStack padding='$4' space='$4'>
          {/* Order Summary */}
          <YStack space='$3'>
            <Text fontSize='$6' fontWeight='600'>
              Order Summary
            </Text>
            <YStack backgroundColor='$gray2' padding='$3' borderRadius='$4'>
              <Text fontSize='$4' color='$gray11'>
                {diamondIds.length} diamond{diamondIds.length !== 1 ? 's' : ''}{' '}
                selected
              </Text>
              <Text fontSize='$5' fontWeight='600' marginTop='$2'>
                Total: ${calculateTotal().toLocaleString()}
              </Text>
            </YStack>
          </YStack>

          <Separator />

          {/* Shipping Address */}
          <YStack space='$3'>
            <Text fontSize='$6' fontWeight='600'>
              Shipping Address
            </Text>

            <YStack space='$3'>
              <YStack space='$2'>
                <Text fontSize='$4' fontWeight='500'>
                  Street Address *
                </Text>
                <Input
                  placeholder='Enter street address'
                  value={shippingAddress.street}
                  onChangeText={text =>
                    setShippingAddress(prev => ({ ...prev, street: text }))
                  }
                />
              </YStack>

              <XStack space='$3'>
                <YStack flex={1} space='$2'>
                  <Text fontSize='$4' fontWeight='500'>
                    City *
                  </Text>
                  <Input
                    placeholder='City'
                    value={shippingAddress.city}
                    onChangeText={text =>
                      setShippingAddress(prev => ({ ...prev, city: text }))
                    }
                  />
                </YStack>

                <YStack flex={1} space='$2'>
                  <Text fontSize='$4' fontWeight='500'>
                    State/Province
                  </Text>
                  <Input
                    placeholder='State'
                    value={shippingAddress.state}
                    onChangeText={text =>
                      setShippingAddress(prev => ({ ...prev, state: text }))
                    }
                  />
                </YStack>
              </XStack>

              <XStack space='$3'>
                <YStack flex={1} space='$2'>
                  <Text fontSize='$4' fontWeight='500'>
                    ZIP/Postal Code
                  </Text>
                  <Input
                    placeholder='ZIP Code'
                    value={shippingAddress.zipCode}
                    onChangeText={text =>
                      setShippingAddress(prev => ({ ...prev, zipCode: text }))
                    }
                  />
                </YStack>

                <YStack flex={1} space='$2'>
                  <Text fontSize='$4' fontWeight='500'>
                    Country *
                  </Text>
                  <Input
                    placeholder='Country'
                    value={shippingAddress.country}
                    onChangeText={text =>
                      setShippingAddress(prev => ({ ...prev, country: text }))
                    }
                  />
                </YStack>
              </XStack>
            </YStack>
          </YStack>

          <Separator />

          {/* Buyer Notes */}
          <YStack space='$3'>
            <Text fontSize='$6' fontWeight='600'>
              Special Instructions
            </Text>
            <YStack space='$2'>
              <Text fontSize='$4' color='$gray11'>
                Add any special instructions or notes for the seller
              </Text>
              <Input
                placeholder='Enter special instructions or delivery preferences...'
                value={buyerNotes}
                onChangeText={setBuyerNotes}
                multiline
                numberOfLines={4}
                textAlignVertical='top'
                minHeight={100}
              />
            </YStack>
          </YStack>

          {/* Submit Button */}
          <YStack marginTop='$4' space='$3'>
            <Button
              size='$5'
              backgroundColor='$blue9'
              color='white'
              onPress={handleSubmit}
              disabled={isSubmitting}
              opacity={isSubmitting ? 0.6 : 1}
            >
              {isSubmitting ? 'Creating Order...' : 'Create Order'}
            </Button>

            <Button
              size='$5'
              variant='outlined'
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </>
  );
}
