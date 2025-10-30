import React, { useState } from 'react';
import { Alert } from 'react-native';
import { YStack, XStack, Text, Button, Input, Card, Separator } from 'tamagui';
import {
  Star,
  CheckCircle,
  MessageSquare,
  ThumbsUp,
} from '@tamagui/lucide-icons';
import { OrderBasicFragment } from '../../src/graphql/orders/orders.generated';
import { OrderStatus } from '../../src/generated/graphql';
import { useUpdateOrderStatusMutation } from '../../src/graphql/orders/orders.generated';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';

interface OrderCompletionProps {
  order: OrderBasicFragment;
  onOrderUpdate?: () => void;
}

interface FeedbackData {
  rating: number;
  comment: string;
  wouldRecommend: boolean;
}

export function OrderCompletion({
  order,
  onOrderUpdate,
}: OrderCompletionProps) {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    comment: '',
    wouldRecommend: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const [updateOrderStatus] = useUpdateOrderStatusMutation({
    onCompleted: () => {
      showSuccess('Order completed successfully');
      onOrderUpdate?.();
      setIsSubmitting(false);
      setShowFeedbackForm(false);
    },
    onError: error => {
      showError(error.message || 'Failed to complete order');
      setIsSubmitting(false);
    },
  });

  const isBuyer = user?.id === order.buyerId;
  const canCompleteOrder = isBuyer && order.status === OrderStatus.Delivered;
  const isCompleted = order.status === OrderStatus.Completed;

  const handleCompleteOrder = async () => {
    Alert.alert(
      'Complete Order',
      'Are you satisfied with your order? This will mark the transaction as complete.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete Order',
          onPress: async () => {
            setIsSubmitting(true);

            try {
              const feedbackNote = feedback.comment
                ? `Buyer feedback: ${feedback.rating}/5 stars. ${feedback.comment}${
                    feedback.wouldRecommend
                      ? ' Would recommend seller.'
                      : ' Would not recommend seller.'
                  }`
                : 'Order completed by buyer';

              await updateOrderStatus({
                variables: {
                  orderId: order.id,
                  status: OrderStatus.Completed,
                  sellerNotes: feedbackNote,
                },
              });
            } catch (error) {
              console.error('Order completion error:', error);
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  const handleSubmitFeedback = async () => {
    if (feedback.rating === 0) {
      Alert.alert('Error', 'Please provide a rating');
      return;
    }

    await handleCompleteOrder();
  };

  const renderStarRating = () => {
    return (
      <XStack space='$2' alignItems='center'>
        {[1, 2, 3, 4, 5].map(star => (
          <Button
            key={star}
            size='$3'
            backgroundColor='transparent'
            onPress={() => setFeedback(prev => ({ ...prev, rating: star }))}
            padding='$1'
          >
            <Star
              size={24}
              color={star <= feedback.rating ? '$yellow9' : '$gray6'}
              fill={star <= feedback.rating ? '$yellow9' : 'transparent'}
            />
          </Button>
        ))}
        <Text fontSize='$3' color='$gray11' marginLeft='$2'>
          {feedback.rating > 0 ? `${feedback.rating}/5` : 'Tap to rate'}
        </Text>
      </XStack>
    );
  };

  const getCompletionDate = () => {
    if (order.completedAt) {
      return new Date(order.completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return null;
  };

  // Show completion status if already completed
  if (isCompleted) {
    return (
      <YStack space='$4'>
        <YStack space='$3'>
          <XStack alignItems='center' space='$3'>
            <CheckCircle size={24} color='$green10' />
            <Text fontSize='$6' fontWeight='600' color='$green10'>
              Order Completed
            </Text>
          </XStack>

          <Card bordered padding='$3' backgroundColor='$green1'>
            <YStack space='$2'>
              <Text fontSize='$4' fontWeight='500'>
                Transaction completed successfully!
              </Text>
              {getCompletionDate() && (
                <Text fontSize='$3' color='$gray11'>
                  Completed on {getCompletionDate()}
                </Text>
              )}
              <Text fontSize='$3' color='$gray11'>
                Thank you for your business. We hope you're satisfied with your
                purchase.
              </Text>
            </YStack>
          </Card>
        </YStack>

        {/* Order Summary */}
        <Separator />
        <YStack space='$3'>
          <Text fontSize='$5' fontWeight='600'>
            Order Summary
          </Text>

          <Card bordered padding='$3'>
            <YStack space='$2'>
              <XStack justifyContent='space-between'>
                <Text fontSize='$3' color='$gray11'>
                  Order Number:
                </Text>
                <Text fontSize='$3' fontWeight='500'>
                  #{order.orderNumber}
                </Text>
              </XStack>

              <XStack justifyContent='space-between'>
                <Text fontSize='$3' color='$gray11'>
                  Total Amount:
                </Text>
                <Text fontSize='$3' fontWeight='500'>
                  ${order.totalAmount.toLocaleString()} {order.currency}
                </Text>
              </XStack>

              <XStack justifyContent='space-between'>
                <Text fontSize='$3' color='$gray11'>
                  Items:
                </Text>
                <Text fontSize='$3' fontWeight='500'>
                  {order.orderItems.length} item
                  {order.orderItems.length !== 1 ? 's' : ''}
                </Text>
              </XStack>

              <XStack justifyContent='space-between'>
                <Text fontSize='$3' color='$gray11'>
                  Seller:
                </Text>
                <Text fontSize='$3' fontWeight='500'>
                  {order.sellerOrg.name}
                </Text>
              </XStack>
            </YStack>
          </Card>
        </YStack>
      </YStack>
    );
  }

  // Show completion form for buyers when order is delivered
  if (!canCompleteOrder) {
    return null;
  }

  return (
    <YStack space='$4'>
      <YStack space='$3'>
        <Text fontSize='$6' fontWeight='600'>
          Complete Your Order
        </Text>

        <Card bordered padding='$3' backgroundColor='$blue1'>
          <YStack space='$2'>
            <Text fontSize='$4' fontWeight='500'>
              Ready to complete your order?
            </Text>
            <Text fontSize='$3' color='$gray11'>
              Your order has been delivered. Please confirm that you're
              satisfied with your purchase.
            </Text>
          </YStack>
        </Card>
      </YStack>

      <Separator />

      {/* Feedback Form */}
      <YStack space='$3'>
        <Text fontSize='$5' fontWeight='600'>
          Share Your Experience (Optional)
        </Text>

        {!showFeedbackForm ? (
          <XStack space='$3'>
            <Button
              flex={1}
              backgroundColor='$green9'
              color='white'
              icon={CheckCircle}
              onPress={handleCompleteOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Completing...' : 'Complete Order'}
            </Button>

            <Button
              flex={1}
              variant='outlined'
              icon={MessageSquare}
              onPress={() => setShowFeedbackForm(true)}
            >
              Add Feedback
            </Button>
          </XStack>
        ) : (
          <Card bordered padding='$4' backgroundColor='$gray1'>
            <YStack space='$4'>
              <YStack space='$3'>
                <Text fontSize='$4' fontWeight='500'>
                  Rate Your Experience
                </Text>
                {renderStarRating()}
              </YStack>

              <YStack space='$2'>
                <Text fontSize='$4' fontWeight='500'>
                  Comments (Optional)
                </Text>
                <Input
                  placeholder='Share your thoughts about this transaction...'
                  value={feedback.comment}
                  onChangeText={text =>
                    setFeedback(prev => ({ ...prev, comment: text }))
                  }
                  multiline
                  numberOfLines={3}
                  textAlignVertical='top'
                  minHeight={80}
                />
              </YStack>

              <YStack space='$2'>
                <Text fontSize='$4' fontWeight='500'>
                  Would you recommend this seller?
                </Text>
                <XStack space='$2'>
                  <Button
                    flex={1}
                    size='$3'
                    variant={feedback.wouldRecommend ? 'solid' : 'outlined'}
                    backgroundColor={
                      feedback.wouldRecommend ? '$green9' : 'transparent'
                    }
                    color={feedback.wouldRecommend ? 'white' : '$green9'}
                    icon={ThumbsUp}
                    onPress={() =>
                      setFeedback(prev => ({ ...prev, wouldRecommend: true }))
                    }
                  >
                    Yes
                  </Button>

                  <Button
                    flex={1}
                    size='$3'
                    variant={!feedback.wouldRecommend ? 'solid' : 'outlined'}
                    backgroundColor={
                      !feedback.wouldRecommend ? '$red9' : 'transparent'
                    }
                    color={!feedback.wouldRecommend ? 'white' : '$red9'}
                    onPress={() =>
                      setFeedback(prev => ({ ...prev, wouldRecommend: false }))
                    }
                  >
                    No
                  </Button>
                </XStack>
              </YStack>

              <XStack space='$3' marginTop='$3'>
                <Button
                  flex={1}
                  backgroundColor='$green9'
                  color='white'
                  onPress={handleSubmitFeedback}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Completing...' : 'Complete with Feedback'}
                </Button>

                <Button
                  flex={1}
                  variant='outlined'
                  onPress={() => {
                    setShowFeedbackForm(false);
                    setFeedback({
                      rating: 0,
                      comment: '',
                      wouldRecommend: true,
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

      {/* Order Details */}
      <Separator />
      <YStack space='$3'>
        <Text fontSize='$5' fontWeight='600'>
          Order Details
        </Text>

        <Card bordered padding='$3'>
          <YStack space='$2'>
            <XStack justifyContent='space-between'>
              <Text fontSize='$3' color='$gray11'>
                Order Number:
              </Text>
              <Text fontSize='$3' fontWeight='500'>
                #{order.orderNumber}
              </Text>
            </XStack>

            <XStack justifyContent='space-between'>
              <Text fontSize='$3' color='$gray11'>
                Total Paid:
              </Text>
              <Text fontSize='$3' fontWeight='500' color='$green10'>
                ${order.totalAmount.toLocaleString()} {order.currency}
              </Text>
            </XStack>

            <XStack justifyContent='space-between'>
              <Text fontSize='$3' color='$gray11'>
                Seller:
              </Text>
              <Text fontSize='$3' fontWeight='500'>
                {order.sellerOrg.name}
              </Text>
            </XStack>

            <XStack justifyContent='space-between'>
              <Text fontSize='$3' color='$gray11'>
                Delivered:
              </Text>
              <Text fontSize='$3' fontWeight='500'>
                {order.deliveredAt
                  ? new Date(order.deliveredAt).toLocaleDateString()
                  : 'Recently'}
              </Text>
            </XStack>
          </YStack>
        </Card>
      </YStack>
    </YStack>
  );
}
