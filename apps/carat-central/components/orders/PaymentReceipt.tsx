import React from 'react';
import { Share } from 'react-native';
import { YStack, XStack, Text, Button, Card, Separator } from 'tamagui';
import { Download, Share as ShareIcon, CheckCircle } from '@tamagui/lucide-icons';
import { OrderBasicFragment } from '../../src/graphql/orders/orders.generated';
import { PaymentStatus } from '../../src/generated/graphql';

interface PaymentReceiptProps {
  order: OrderBasicFragment;
}

export function PaymentReceipt({ order }: PaymentReceiptProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const generateReceiptText = () => {
    return `
PAYMENT RECEIPT
Order #${order.orderNumber}

Date: ${formatDate(order.createdAt)}
Amount: $${order.totalAmount.toLocaleString()} ${order.currency}
Payment Status: ${order.paymentStatus}
Payment Method: ${order.paymentMethod || 'Not specified'}

Buyer: ${order.buyer.name}
Email: ${order.buyer.email}
${order.buyerOrg ? `Organization: ${order.buyerOrg.name}` : ''}

Seller: ${order.seller.name}
Email: ${order.seller.email}
Organization: ${order.sellerOrg.name}

Items:
${order.orderItems.map((item, index) => 
  `${index + 1}. Diamond ID: ${item.diamondId}
   Quantity: ${item.quantity}
   Price: $${item.totalPrice.toLocaleString()}`
).join('\n')}

Total: $${order.totalAmount.toLocaleString()} ${order.currency}

Thank you for your business!
    `.trim();
  };

  const handleShareReceipt = async () => {
    try {
      await Share.share({
        message: generateReceiptText(),
        title: `Payment Receipt - Order #${order.orderNumber}`,
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF
    // For now, we'll just show an alert
    alert('Receipt download functionality would be implemented here');
  };

  // Only show receipt if payment is completed
  if (order.paymentStatus !== PaymentStatus.Paid) {
    return null;
  }

  return (
    <YStack space="$4">
      <YStack space="$3">
        <XStack alignItems="center" space="$3">
          <CheckCircle size={24} color="$green10" />
          <Text fontSize="$6" fontWeight="600" color="$green10">
            Payment Receipt
          </Text>
        </XStack>
        
        <Text fontSize="$3" color="$gray11">
          Payment completed successfully
        </Text>
      </YStack>

      <Card bordered padding="$4" backgroundColor="$gray1">
        <YStack space="$3">
          {/* Receipt Header */}
          <YStack alignItems="center" space="$2">
            <Text fontSize="$5" fontWeight="600">PAYMENT RECEIPT</Text>
            <Text fontSize="$4" color="$gray11">Order #{order.orderNumber}</Text>
          </YStack>

          <Separator />

          {/* Payment Details */}
          <YStack space="$2">
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$gray11">Date:</Text>
              <Text fontSize="$3">{formatDate(order.createdAt)}</Text>
            </XStack>
            
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$gray11">Payment Method:</Text>
              <Text fontSize="$3">{order.paymentMethod || 'Not specified'}</Text>
            </XStack>
            
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$gray11">Status:</Text>
              <Text fontSize="$3" color="$green10" fontWeight="500">
                {order.paymentStatus}
              </Text>
            </XStack>
          </YStack>

          <Separator />

          {/* Transaction Details */}
          <YStack space="$2">
            <Text fontSize="$4" fontWeight="500">Transaction Details</Text>
            
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$gray11">Subtotal:</Text>
              <Text fontSize="$3">${order.totalAmount.toLocaleString()}</Text>
            </XStack>
            
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$gray11">Processing Fee:</Text>
              <Text fontSize="$3">$0.00</Text>
            </XStack>
            
            <Separator />
            
            <XStack justifyContent="space-between">
              <Text fontSize="$4" fontWeight="600">Total Paid:</Text>
              <Text fontSize="$4" fontWeight="600" color="$green10">
                ${order.totalAmount.toLocaleString()} {order.currency}
              </Text>
            </XStack>
          </YStack>

          <Separator />

          {/* Buyer/Seller Info */}
          <YStack space="$2">
            <Text fontSize="$4" fontWeight="500">Transaction Parties</Text>
            
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$gray11">Buyer:</Text>
              <Text fontSize="$3">{order.buyer.name}</Text>
            </XStack>
            
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$gray11">Seller:</Text>
              <Text fontSize="$3">{order.seller.name}</Text>
            </XStack>
            
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$gray11">Seller Org:</Text>
              <Text fontSize="$3">{order.sellerOrg.name}</Text>
            </XStack>
          </YStack>

          <Separator />

          {/* Items Summary */}
          <YStack space="$2">
            <Text fontSize="$4" fontWeight="500">Items</Text>
            <Text fontSize="$3" color="$gray11">
              {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''} purchased
            </Text>
          </YStack>
        </YStack>
      </Card>

      {/* Receipt Actions */}
      <XStack space="$3">
        <Button
          flex={1}
          variant="outlined"
          icon={Download}
          onPress={handleDownloadReceipt}
        >
          Download PDF
        </Button>
        
        <Button
          flex={1}
          backgroundColor="$blue9"
          color="white"
          icon={ShareIcon}
          onPress={handleShareReceipt}
        >
          Share Receipt
        </Button>
      </XStack>

      {/* Footer */}
      <YStack alignItems="center" space="$2">
        <Text fontSize="$2" color="$gray11" textAlign="center">
          This is an official payment receipt for your records.
        </Text>
        <Text fontSize="$2" color="$gray11" textAlign="center">
          For questions about this transaction, please contact support.
        </Text>
      </YStack>
    </YStack>
  );
}