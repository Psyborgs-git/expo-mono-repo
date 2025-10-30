import React from 'react';
import { Card, YStack, XStack, Text, Button, Separator } from 'tamagui';
import { MessageCircle, Check, X, DollarSign, Calendar } from '@tamagui/lucide-icons';
import { RequestResponse, ResponseStatus } from '../../src/generated/graphql';

interface RequestResponseCardProps {
  response: RequestResponse;
  onAccept?: (responseId: string) => void;
  onReject?: (responseId: string) => void;
  onContact?: (responseId: string) => void;
  showActions?: boolean;
}

const getStatusColor = (status: ResponseStatus) => {
  switch (status) {
    case ResponseStatus.Pending:
      return '$blue9';
    case ResponseStatus.Accepted:
      return '$green9';
    case ResponseStatus.Rejected:
      return '$red9';
    case ResponseStatus.Withdrawn:
      return '$gray9';
    default:
      return '$gray9';
  }
};

const getStatusLabel = (status: ResponseStatus) => {
  switch (status) {
    case ResponseStatus.Pending:
      return 'Pending';
    case ResponseStatus.Accepted:
      return 'Accepted';
    case ResponseStatus.Rejected:
      return 'Rejected';
    case ResponseStatus.Withdrawn:
      return 'Withdrawn';
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatPrice = (price?: number | null, currency = 'USD') => {
  if (!price) return 'Price not specified';
  return `${currency} ${price.toLocaleString()}`;
};

export function RequestResponseCard({
  response,
  onAccept,
  onReject,
  onContact,
  showActions = false,
}: RequestResponseCardProps) {
  const isPending = response.status === ResponseStatus.Pending;
  const isAccepted = response.status === ResponseStatus.Accepted;

  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      marginBottom="$3"
    >
      <Card.Header padded>
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} space="$2">
            <XStack alignItems="center" space="$2">
              <Text fontSize="$5" fontWeight="600" color="$color" flex={1}>
                {response.responderOrg.name}
              </Text>
              <Text
                fontSize="$2"
                fontWeight="600"
                color="white"
                backgroundColor={getStatusColor(response.status)}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                {getStatusLabel(response.status)}
              </Text>
            </XStack>
            
            <Text fontSize="$3" color="$gray10">
              by {response.responder.name}
            </Text>
          </YStack>
        </XStack>
      </Card.Header>

      <Card.Footer padded>
        <YStack space="$3">
          {/* Response Message */}
          <YStack space="$2">
            <Text fontSize="$4" fontWeight="500" color="$color">
              Message:
            </Text>
            <Text fontSize="$3" color="$gray11">
              {response.message}
            </Text>
          </YStack>

          <Separator />

          {/* Response Details */}
          <YStack space="$2">
            {response.proposedPrice && (
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" space="$2">
                  <DollarSign size={16} color="$gray10" />
                  <Text fontSize="$3" color="$gray10">Proposed Price:</Text>
                </XStack>
                <Text fontSize="$4" fontWeight="600" color="$green9">
                  {formatPrice(response.proposedPrice, response.currency)}
                </Text>
              </XStack>
            )}

            {response.proposedDiamonds && response.proposedDiamonds.length > 0 && (
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$3" color="$gray10">Proposed Diamonds:</Text>
                <Text fontSize="$3" fontWeight="500">
                  {response.proposedDiamonds.length} diamond{response.proposedDiamonds.length !== 1 ? 's' : ''}
                </Text>
              </XStack>
            )}

            <XStack justifyContent="space-between" alignItems="center">
              <XStack alignItems="center" space="$2">
                <Calendar size={16} color="$gray10" />
                <Text fontSize="$3" color="$gray10">Submitted:</Text>
              </XStack>
              <Text fontSize="$3" fontWeight="500">
                {formatDate(response.createdAt)}
              </Text>
            </XStack>

            {response.acceptedAt && (
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$3" color="$gray10">Accepted:</Text>
                <Text fontSize="$3" fontWeight="500" color="$green9">
                  {formatDate(response.acceptedAt)}
                </Text>
              </XStack>
            )}

            {response.rejectedAt && (
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$3" color="$gray10">Rejected:</Text>
                <Text fontSize="$3" fontWeight="500" color="$red9">
                  {formatDate(response.rejectedAt)}
                </Text>
              </XStack>
            )}
          </YStack>

          {/* Action Buttons */}
          {showActions && isPending && (
            <XStack space="$2" marginTop="$2">
              {onAccept && (
                <Button
                  flex={1}
                  size="$3"
                  backgroundColor="$green9"
                  color="white"
                  icon={Check}
                  onPress={() => onAccept(response.id)}
                >
                  Accept
                </Button>
              )}
              {onReject && (
                <Button
                  flex={1}
                  size="$3"
                  variant="outlined"
                  borderColor="$red8"
                  color="$red9"
                  icon={X}
                  onPress={() => onReject(response.id)}
                >
                  Reject
                </Button>
              )}
            </XStack>
          )}

          {/* Contact Button */}
          {onContact && (isAccepted || isPending) && (
            <Button
              size="$3"
              variant="outlined"
              icon={MessageCircle}
              onPress={() => onContact(response.id)}
              marginTop={showActions && isPending ? "$2" : "$0"}
            >
              Contact Seller
            </Button>
          )}
        </YStack>
      </Card.Footer>
    </Card>
  );
}