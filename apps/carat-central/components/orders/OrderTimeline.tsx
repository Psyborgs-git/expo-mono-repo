import React from 'react';
import { YStack, XStack, Text, Circle } from 'tamagui';
import { Check, Clock, X } from '@tamagui/lucide-icons';
import { OrderBasicFragment } from '../../src/graphql/orders/orders.generated';
import { OrderStatus } from '../../src/generated/graphql';

interface OrderTimelineProps {
  order: OrderBasicFragment;
}

interface TimelineStep {
  label: string;
  status: 'completed' | 'current' | 'pending' | 'cancelled';
  date?: string;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return undefined;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimelineSteps = (): TimelineStep[] => {
    const steps: TimelineStep[] = [
      {
        label: 'Order Created',
        status: 'completed',
        date: formatDate(order.createdAt),
      },
    ];

    // Add confirmed step if order was confirmed
    if (order.status !== OrderStatus.Pending && order.status !== OrderStatus.Canceled) {
      steps.push({
        label: 'Order Confirmed',
        status: 'completed',
        date: formatDate(order.updatedAt), // Approximation
      });
    }

    // Add processing step
    if (order.status === OrderStatus.Processing || 
        order.status === OrderStatus.Shipped || 
        order.status === OrderStatus.Delivered || 
        order.status === OrderStatus.Completed) {
      steps.push({
        label: 'Processing',
        status: 'completed',
      });
    } else if (order.status === OrderStatus.Confirmed) {
      steps.push({
        label: 'Processing',
        status: 'current',
      });
    } else {
      steps.push({
        label: 'Processing',
        status: 'pending',
      });
    }

    // Add shipped step
    if (order.status === OrderStatus.Shipped || 
        order.status === OrderStatus.Delivered || 
        order.status === OrderStatus.Completed) {
      steps.push({
        label: 'Shipped',
        status: 'completed',
        date: formatDate(order.shippedAt),
      });
    } else if (order.status === OrderStatus.Processing) {
      steps.push({
        label: 'Shipped',
        status: 'current',
      });
    } else {
      steps.push({
        label: 'Shipped',
        status: 'pending',
      });
    }

    // Add delivered step
    if (order.status === OrderStatus.Delivered || order.status === OrderStatus.Completed) {
      steps.push({
        label: 'Delivered',
        status: 'completed',
        date: formatDate(order.deliveredAt),
      });
    } else if (order.status === OrderStatus.Shipped) {
      steps.push({
        label: 'Delivered',
        status: 'current',
      });
    } else {
      steps.push({
        label: 'Delivered',
        status: 'pending',
      });
    }

    // Add completed step
    if (order.status === OrderStatus.Completed) {
      steps.push({
        label: 'Completed',
        status: 'completed',
        date: formatDate(order.completedAt),
      });
    } else if (order.status === OrderStatus.Delivered) {
      steps.push({
        label: 'Completed',
        status: 'current',
      });
    } else {
      steps.push({
        label: 'Completed',
        status: 'pending',
      });
    }

    // Handle cancelled orders
    if (order.status === OrderStatus.Canceled) {
      // Mark all pending steps as cancelled
      steps.forEach((step, index) => {
        if (step.status === 'pending' || step.status === 'current') {
          step.status = 'cancelled';
        }
      });
      
      // Add cancelled step
      steps.push({
        label: 'Cancelled',
        status: 'completed',
        date: formatDate(order.canceledAt),
      });
    }

    return steps;
  };

  const steps = getTimelineSteps();

  const getStepIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <Check size={16} color="white" />;
      case 'current':
        return <Clock size={16} color="white" />;
      case 'cancelled':
        return <X size={16} color="white" />;
      default:
        return null;
    }
  };

  const getStepColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return '$green9';
      case 'current':
        return '$blue9';
      case 'cancelled':
        return '$red9';
      default:
        return '$gray6';
    }
  };

  return (
    <YStack space="$2">
      {steps.map((step, index) => (
        <XStack key={index} alignItems="flex-start" space="$3">
          {/* Timeline Icon */}
          <YStack alignItems="center" minWidth={24}>
            <Circle
              size={24}
              backgroundColor={getStepColor(step.status)}
              alignItems="center"
              justifyContent="center"
            >
              {getStepIcon(step.status)}
            </Circle>
            {index < steps.length - 1 && (
              <YStack
                width={2}
                height={32}
                backgroundColor={
                  step.status === 'completed' ? '$green9' : '$gray6'
                }
                marginTop="$2"
              />
            )}
          </YStack>

          {/* Step Content */}
          <YStack flex={1} paddingBottom="$3">
            <Text
              fontSize="$4"
              fontWeight="500"
              color={step.status === 'pending' ? '$gray11' : '$color'}
            >
              {step.label}
            </Text>
            {step.date && (
              <Text fontSize="$3" color="$gray10">
                {step.date}
              </Text>
            )}
          </YStack>
        </XStack>
      ))}
    </YStack>
  );
}