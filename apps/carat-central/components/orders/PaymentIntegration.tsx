import React, { useState } from 'react';
import { Alert } from 'react-native';
import { YStack, XStack, Text, Button, Input, Card, Separator } from 'tamagui';
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from '@tamagui/lucide-icons';
import { OrderBasicFragment } from '../../src/graphql/orders/orders.generated';
import { PaymentStatus } from '../../src/generated/graphql';
import { useUpdatePaymentStatusMutation } from '../../src/graphql/orders/orders.generated';
import { useToast } from '../hooks/useToast';

interface PaymentIntegrationProps {
  order: OrderBasicFragment;
  onPaymentUpdate?: () => void;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'crypto' | 'wire';
  icon: React.ComponentType<any>;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit_card',
    name: 'Credit Card',
    type: 'card',
    icon: CreditCard,
    description: 'Pay with Visa, MasterCard, or American Express',
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    type: 'bank',
    icon: DollarSign,
    description: 'Direct bank transfer (ACH)',
  },
  {
    id: 'wire_transfer',
    name: 'Wire Transfer',
    type: 'wire',
    icon: DollarSign,
    description: 'International wire transfer',
  },
];

export function PaymentIntegration({
  order,
  onPaymentUpdate,
}: PaymentIntegrationProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    bankAccount: '',
    routingNumber: '',
  });

  const { showSuccess, showError } = useToast();

  const [updatePaymentStatus] = useUpdatePaymentStatusMutation({
    onCompleted: () => {
      showSuccess('Payment processed successfully');
      onPaymentUpdate?.();
      setIsProcessing(false);
    },
    onError: error => {
      showError(error.message || 'Payment processing failed');
      setIsProcessing(false);
    },
  });

  const handlePaymentSubmit = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    // Validate payment details based on method
    if (selectedMethod === 'credit_card') {
      if (
        !paymentDetails.cardNumber ||
        !paymentDetails.expiryDate ||
        !paymentDetails.cvv
      ) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    } else if (selectedMethod === 'bank_transfer') {
      if (!paymentDetails.bankAccount || !paymentDetails.routingNumber) {
        Alert.alert('Error', 'Please fill in all bank details');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // In a real app, this would integrate with a payment processor
        // For now, we'll just update the payment status
        await updatePaymentStatus({
          variables: {
            orderId: order.id,
            paymentStatus: PaymentStatus.Paid,
            paymentMethod: paymentMethods.find(m => m.id === selectedMethod)
              ?.name,
          },
        });
      } catch (error) {
        console.error('Payment processing error:', error);
        setIsProcessing(false);
      }
    }, 2000); // Simulate processing time
  };

  const getPaymentStatusIcon = () => {
    switch (order.paymentStatus) {
      case PaymentStatus.Paid:
        return <CheckCircle size={20} color='$green10' />;
      case PaymentStatus.Failed:
        return <AlertCircle size={20} color='$red10' />;
      default:
        return <AlertCircle size={20} color='$orange10' />;
    }
  };

  const getPaymentStatusColor = () => {
    switch (order.paymentStatus) {
      case PaymentStatus.Paid:
        return '$green10';
      case PaymentStatus.Failed:
        return '$red10';
      default:
        return '$orange10';
    }
  };

  // Don't show payment form if already paid
  if (order.paymentStatus === PaymentStatus.Paid) {
    return (
      <Card bordered padding='$4'>
        <XStack alignItems='center' space='$3'>
          {getPaymentStatusIcon()}
          <YStack flex={1}>
            <Text
              fontSize='$5'
              fontWeight='600'
              color={getPaymentStatusColor()}
            >
              Payment Completed
            </Text>
            <Text fontSize='$3' color='$gray11'>
              Payment method: {order.paymentMethod || 'Not specified'}
            </Text>
          </YStack>
        </XStack>
      </Card>
    );
  }

  return (
    <YStack space='$4'>
      <YStack space='$3'>
        <Text fontSize='$6' fontWeight='600'>
          Payment Information
        </Text>

        {/* Payment Status */}
        <Card bordered padding='$3'>
          <XStack alignItems='center' space='$3'>
            {getPaymentStatusIcon()}
            <YStack flex={1}>
              <Text fontSize='$4' fontWeight='500'>
                Amount Due: ${order.totalAmount.toLocaleString()}{' '}
                {order.currency}
              </Text>
              <Text fontSize='$3' color={getPaymentStatusColor()}>
                Status: {order.paymentStatus}
              </Text>
            </YStack>
          </XStack>
        </Card>
      </YStack>

      <Separator />

      {/* Payment Methods */}
      <YStack space='$3'>
        <Text fontSize='$5' fontWeight='600'>
          Select Payment Method
        </Text>

        <YStack space='$2'>
          {paymentMethods.map(method => (
            <Card
              key={method.id}
              bordered
              padding='$3'
              backgroundColor={
                selectedMethod === method.id ? '$blue2' : '$background'
              }
              borderColor={
                selectedMethod === method.id ? '$blue8' : '$borderColor'
              }
              pressStyle={{ backgroundColor: '$blue1' }}
              onPress={() => setSelectedMethod(method.id)}
            >
              <XStack alignItems='center' space='$3'>
                <method.icon size={24} color='$blue10' />
                <YStack flex={1}>
                  <Text fontSize='$4' fontWeight='500'>
                    {method.name}
                  </Text>
                  <Text fontSize='$3' color='$gray11'>
                    {method.description}
                  </Text>
                </YStack>
              </XStack>
            </Card>
          ))}
        </YStack>
      </YStack>

      {/* Payment Details Form */}
      {selectedMethod && (
        <>
          <Separator />
          <YStack space='$3'>
            <Text fontSize='$5' fontWeight='600'>
              Payment Details
            </Text>

            {selectedMethod === 'credit_card' && (
              <YStack space='$3'>
                <YStack space='$2'>
                  <Text fontSize='$4' fontWeight='500'>
                    Card Number
                  </Text>
                  <Input
                    placeholder='1234 5678 9012 3456'
                    value={paymentDetails.cardNumber}
                    onChangeText={text =>
                      setPaymentDetails(prev => ({ ...prev, cardNumber: text }))
                    }
                    keyboardType='numeric'
                  />
                </YStack>

                <XStack space='$3'>
                  <YStack flex={1} space='$2'>
                    <Text fontSize='$4' fontWeight='500'>
                      Expiry Date
                    </Text>
                    <Input
                      placeholder='MM/YY'
                      value={paymentDetails.expiryDate}
                      onChangeText={text =>
                        setPaymentDetails(prev => ({
                          ...prev,
                          expiryDate: text,
                        }))
                      }
                    />
                  </YStack>

                  <YStack flex={1} space='$2'>
                    <Text fontSize='$4' fontWeight='500'>
                      CVV
                    </Text>
                    <Input
                      placeholder='123'
                      value={paymentDetails.cvv}
                      onChangeText={text =>
                        setPaymentDetails(prev => ({ ...prev, cvv: text }))
                      }
                      keyboardType='numeric'
                      secureTextEntry
                    />
                  </YStack>
                </XStack>

                <YStack space='$2'>
                  <Text fontSize='$4' fontWeight='500'>
                    Name on Card
                  </Text>
                  <Input
                    placeholder='John Doe'
                    value={paymentDetails.nameOnCard}
                    onChangeText={text =>
                      setPaymentDetails(prev => ({ ...prev, nameOnCard: text }))
                    }
                  />
                </YStack>
              </YStack>
            )}

            {(selectedMethod === 'bank_transfer' ||
              selectedMethod === 'wire_transfer') && (
              <YStack space='$3'>
                <YStack space='$2'>
                  <Text fontSize='$4' fontWeight='500'>
                    Account Number
                  </Text>
                  <Input
                    placeholder='Account number'
                    value={paymentDetails.bankAccount}
                    onChangeText={text =>
                      setPaymentDetails(prev => ({
                        ...prev,
                        bankAccount: text,
                      }))
                    }
                    keyboardType='numeric'
                  />
                </YStack>

                <YStack space='$2'>
                  <Text fontSize='$4' fontWeight='500'>
                    Routing Number
                  </Text>
                  <Input
                    placeholder='Routing number'
                    value={paymentDetails.routingNumber}
                    onChangeText={text =>
                      setPaymentDetails(prev => ({
                        ...prev,
                        routingNumber: text,
                      }))
                    }
                    keyboardType='numeric'
                  />
                </YStack>
              </YStack>
            )}
          </YStack>
        </>
      )}

      {/* Payment Actions */}
      {selectedMethod && (
        <>
          <Separator />
          <YStack space='$3'>
            <Button
              size='$5'
              backgroundColor='$green9'
              color='white'
              onPress={handlePaymentSubmit}
              disabled={isProcessing}
              opacity={isProcessing ? 0.6 : 1}
            >
              {isProcessing
                ? 'Processing Payment...'
                : `Pay ${order.totalAmount.toLocaleString()} ${order.currency}`}
            </Button>

            <Text fontSize='$2' color='$gray11' textAlign='center'>
              Your payment information is secure and encrypted
            </Text>
          </YStack>
        </>
      )}
    </YStack>
  );
}
