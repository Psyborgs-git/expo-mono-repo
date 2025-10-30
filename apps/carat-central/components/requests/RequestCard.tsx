import React from 'react';
import { Card, YStack, XStack, Text, Button } from 'tamagui';
import { Clock, Users, Eye, EyeOff } from '@tamagui/lucide-icons';
import { DiamondRequest, RequestStatus } from '../../src/generated/graphql';

interface RequestCardProps {
  request: DiamondRequest;
  onPress?: (request: DiamondRequest) => void;
  onEdit?: (request: DiamondRequest) => void;
  onCancel?: (request: DiamondRequest) => void;
  showActions?: boolean;
}

const getStatusColor = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.Open:
      return '$green9';
    case RequestStatus.InProgress:
      return '$blue9';
    case RequestStatus.Fulfilled:
      return '$purple9';
    case RequestStatus.Expired:
      return '$red9';
    case RequestStatus.Closed:
      return '$gray9';
    default:
      return '$gray9';
  }
};

const getStatusLabel = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.Open:
      return 'Open';
    case RequestStatus.InProgress:
      return 'In Progress';
    case RequestStatus.Fulfilled:
      return 'Fulfilled';
    case RequestStatus.Expired:
      return 'Expired';
    case RequestStatus.Closed:
      return 'Closed';
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const formatBudget = (min?: number | null, max?: number | null, currency = 'USD') => {
  if (!min && !max) return 'Budget not specified';
  if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  if (min) return `${currency} ${min.toLocaleString()}+`;
  if (max) return `Up to ${currency} ${max.toLocaleString()}`;
  return '';
};

const formatCaratRange = (min?: number | null, max?: number | null) => {
  if (!min && !max) return 'Any size';
  if (min && max) return `${min} - ${max} ct`;
  if (min) return `${min}+ ct`;
  if (max) return `Up to ${max} ct`;
  return '';
};

export function RequestCard({ request, onPress, onEdit, onCancel, showActions = false }: RequestCardProps) {
  const isExpired = request.expiresAt && new Date(request.expiresAt) < new Date();
  const canEdit = request.status === RequestStatus.Open && !isExpired;

  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      onPress={() => onPress?.(request)}
      marginBottom="$3"
    >
      <Card.Header padded>
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} space="$2">
            <XStack alignItems="center" space="$2">
              <Text fontSize="$5" fontWeight="600" color="$color" flex={1}>
                {request.title}
              </Text>
              {request.isPublic ? (
                <Eye size={16} color="$blue9" />
              ) : (
                <EyeOff size={16} color="$gray9" />
              )}
            </XStack>
            
            <Text
              fontSize="$2"
              fontWeight="600"
              color="white"
              backgroundColor={getStatusColor(request.status)}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
              alignSelf="flex-start"
            >
              {getStatusLabel(request.status)}
            </Text>
          </YStack>
        </XStack>

        {request.description && (
          <Text fontSize="$3" color="$gray11" numberOfLines={2}>
            {request.description}
          </Text>
        )}
      </Card.Header>

      <Card.Footer padded>
        <YStack space="$3">
          {/* Request Details */}
          <YStack space="$2">
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$gray10">Carat Range:</Text>
              <Text fontSize="$3" fontWeight="500">
                {formatCaratRange(request.minCarat, request.maxCarat)}
              </Text>
            </XStack>
            
            <XStack justifyContent="space-between">
              <Text fontSize="$3" color="$gray10">Budget:</Text>
              <Text fontSize="$3" fontWeight="500">
                {formatBudget(request.minBudget, request.maxBudget, request.currency)}
              </Text>
            </XStack>

            {request.shapes && request.shapes.length > 0 && (
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$gray10">Shapes:</Text>
                <Text fontSize="$3" fontWeight="500">
                  {request.shapes.join(', ')}
                </Text>
              </XStack>
            )}
          </YStack>

          {/* Meta Information */}
          <XStack justifyContent="space-between" alignItems="center">
            <XStack alignItems="center" space="$2">
              <Users size={14} color="$gray10" />
              <Text fontSize="$2" color="$gray10">
                {request.responseCount} response{request.responseCount !== 1 ? 's' : ''}
              </Text>
            </XStack>

            {request.expiresAt && (
              <XStack alignItems="center" space="$2">
                <Clock size={14} color={isExpired ? '$red9' : '$gray10'} />
                <Text fontSize="$2" color={isExpired ? '$red9' : '$gray10'}>
                  {isExpired ? 'Expired' : `Expires ${formatDate(request.expiresAt)}`}
                </Text>
              </XStack>
            )}
          </XStack>

          {/* Action Buttons */}
          {showActions && (
            <XStack space="$2" marginTop="$2">
              {canEdit && onEdit && (
                <Button
                  flex={1}
                  size="$3"
                  variant="outlined"
                  onPress={() => onEdit(request)}
                >
                  Edit
                </Button>
              )}
              {canEdit && onCancel && (
                <Button
                  flex={1}
                  size="$3"
                  variant="outlined"
                  borderColor="$red8"
                  color="$red9"
                  onPress={() => onCancel(request)}
                >
                  Cancel
                </Button>
              )}
            </XStack>
          )}
        </YStack>
      </Card.Footer>
    </Card>
  );
}