import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  ScrollView,
  Card,
  Separator,
  Spinner,
  Tabs,
} from 'tamagui';
import { Alert, RefreshControl } from 'react-native';
import { Clock, Users, Eye, EyeOff, MessageCircle, DollarSign } from '@tamagui/lucide-icons';
import { useQuery } from '@apollo/client';
import { useRouter } from 'expo-router';
import {
  GetRequestDocument,
  GetRequestQuery,
  GetRequestQueryVariables,
  DiamondRequest,
  RequestStatus,
  ResponseStatus,
} from '../../src/generated/graphql';
import { RequestResponseCard } from './RequestResponseCard';
import { SubmitResponseForm } from './SubmitResponseForm';
import { useAcceptResponse, useRejectResponse } from '../../hooks/useRequestResponses';

interface RequestDetailScreenProps {
  requestId: string;
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
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
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

export function RequestDetailScreen({ requestId }: RequestDetailScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'responses'>('details');
  const [showResponseForm, setShowResponseForm] = useState(false);

  const { data, loading, error, refetch } = useQuery<GetRequestQuery, GetRequestQueryVariables>(
    GetRequestDocument,
    {
      variables: { requestId },
      errorPolicy: 'all',
    }
  );

  const { acceptResponse, loading: acceptingResponse } = useAcceptResponse();
  const { rejectResponse, loading: rejectingResponse } = useRejectResponse();

  const request = data?.request;

  const handleRefresh = () => {
    refetch();
  };

  const handleSubmitResponse = () => {
    setShowResponseForm(true);
  };

  const handleResponseSubmitted = () => {
    setShowResponseForm(false);
    refetch();
  };

  const handleAcceptResponse = async (responseId: string) => {
    Alert.alert(
      'Accept Response',
      'Are you sure you want to accept this response? This will close the request and notify the seller.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          style: 'default',
          onPress: async () => {
            try {
              await acceptResponse(responseId);
              Alert.alert('Success', 'Response accepted successfully');
              refetch();
            } catch (error) {
              console.error('Error accepting response:', error);
              Alert.alert('Error', 'Failed to accept response. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleRejectResponse = async (responseId: string) => {
    Alert.alert(
      'Reject Response',
      'Are you sure you want to reject this response?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await rejectResponse(responseId);
              Alert.alert('Success', 'Response rejected');
              refetch();
            } catch (error) {
              console.error('Error rejecting response:', error);
              Alert.alert('Error', 'Failed to reject response. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleContactSeller = (responseId: string) => {
    // TODO: Navigate to chat or contact functionality
    Alert.alert('Contact Seller', 'Chat functionality will be implemented');
  };

  if (loading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" color="$blue9" />
      </YStack>
    );
  }

  if (error || !request) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4" padding="$6">
        <Text fontSize="$5" fontWeight="600" color="$red9" textAlign="center">
          Error loading request
        </Text>
        <Text fontSize="$4" color="$gray10" textAlign="center">
          {error?.message || 'Request not found'}
        </Text>
        <Button variant="outlined" onPress={handleRefresh}>
          Try Again
        </Button>
      </YStack>
    );
  }

  const isExpired = request.expiresAt && new Date(request.expiresAt) < new Date();
  const canRespond = request.status === RequestStatus.Open && !isExpired;
  const pendingResponses = request.responses?.filter(r => r.status === ResponseStatus.Pending) || [];
  const acceptedResponses = request.responses?.filter(r => r.status === ResponseStatus.Accepted) || [];
  const rejectedResponses = request.responses?.filter(r => r.status === ResponseStatus.Rejected) || [];

  if (showResponseForm) {
    return (
      <SubmitResponseForm
        requestId={requestId}
        onSuccess={handleResponseSubmitted}
        onCancel={() => setShowResponseForm(false)}
      />
    );
  }

  return (
    <ScrollView
      flex={1}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
    >
      <YStack space="$4" padding="$4">
        {/* Header */}
        <Card elevate bordered>
          <Card.Header padded>
            <XStack justifyContent="space-between" alignItems="flex-start" space="$3">
              <YStack flex={1} space="$2">
                <XStack alignItems="center" space="$2">
                  <Text fontSize="$6" fontWeight="bold" color="$color" flex={1}>
                    {request.title}
                  </Text>
                  {request.isPublic ? (
                    <Eye size={18} color="$blue9" />
                  ) : (
                    <EyeOff size={18} color="$gray9" />
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

                <Text fontSize="$3" color="$gray11">
                  Request #{request.requestNumber}
                </Text>
              </YStack>
            </XStack>

            {request.description && (
              <Text fontSize="$4" color="$color" marginTop="$3">
                {request.description}
              </Text>
            )}
          </Card.Header>
        </Card>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'details' | 'responses')}
          orientation="horizontal"
          flexDirection="column"
        >
          <Tabs.List separator={<></>} backgroundColor="transparent">
            <Tabs.Tab flex={1} value="details">
              <Text fontSize="$4" fontWeight="500">Details</Text>
            </Tabs.Tab>
            <Tabs.Tab flex={1} value="responses">
              <XStack alignItems="center" space="$2">
                <Text fontSize="$4" fontWeight="500">Responses</Text>
                <Text
                  fontSize="$2"
                  fontWeight="600"
                  color="white"
                  backgroundColor="$blue9"
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  borderRadius="$2"
                >
                  {request.responseCount}
                </Text>
              </XStack>
            </Tabs.Tab>
          </Tabs.List>

          {/* Details Tab */}
          <Tabs.Content value="details">
            <YStack space="$4">
              {/* Specifications */}
              <Card elevate bordered>
                <Card.Header padded>
                  <Text fontSize="$5" fontWeight="600" color="$color">
                    Specifications
                  </Text>
                </Card.Header>
                <Card.Footer padded>
                  <YStack space="$3">
                    <XStack justifyContent="space-between">
                      <Text fontSize="$4" color="$gray10">Carat Range:</Text>
                      <Text fontSize="$4" fontWeight="500">
                        {formatCaratRange(request.minCarat, request.maxCarat)}
                      </Text>
                    </XStack>

                    <XStack justifyContent="space-between">
                      <Text fontSize="$4" color="$gray10">Budget:</Text>
                      <Text fontSize="$4" fontWeight="500">
                        {formatBudget(request.minBudget, request.maxBudget, request.currency)}
                      </Text>
                    </XStack>

                    {request.shapes && request.shapes.length > 0 && (
                      <>
                        <Separator />
                        <XStack justifyContent="space-between">
                          <Text fontSize="$4" color="$gray10">Shapes:</Text>
                          <Text fontSize="$4" fontWeight="500" flex={1} textAlign="right">
                            {request.shapes.join(', ')}
                          </Text>
                        </XStack>
                      </>
                    )}

                    {request.clarityGrades && request.clarityGrades.length > 0 && (
                      <XStack justifyContent="space-between">
                        <Text fontSize="$4" color="$gray10">Clarity:</Text>
                        <Text fontSize="$4" fontWeight="500" flex={1} textAlign="right">
                          {request.clarityGrades.join(', ')}
                        </Text>
                      </XStack>
                    )}

                    {request.colorGrades && request.colorGrades.length > 0 && (
                      <XStack justifyContent="space-between">
                        <Text fontSize="$4" color="$gray10">Color:</Text>
                        <Text fontSize="$4" fontWeight="500" flex={1} textAlign="right">
                          {request.colorGrades.join(', ')}
                        </Text>
                      </XStack>
                    )}

                    {request.cutGrades && request.cutGrades.length > 0 && (
                      <XStack justifyContent="space-between">
                        <Text fontSize="$4" color="$gray10">Cut:</Text>
                        <Text fontSize="$4" fontWeight="500" flex={1} textAlign="right">
                          {request.cutGrades.join(', ')}
                        </Text>
                      </XStack>
                    )}

                    {request.certificates && request.certificates.length > 0 && (
                      <XStack justifyContent="space-between">
                        <Text fontSize="$4" color="$gray10">Certificates:</Text>
                        <Text fontSize="$4" fontWeight="500" flex={1} textAlign="right">
                          {request.certificates.join(', ')}
                        </Text>
                      </XStack>
                    )}
                  </YStack>
                </Card.Footer>
              </Card>

              {/* Request Information */}
              <Card elevate bordered>
                <Card.Header padded>
                  <Text fontSize="$5" fontWeight="600" color="$color">
                    Request Information
                  </Text>
                </Card.Header>
                <Card.Footer padded>
                  <YStack space="$3">
                    <XStack justifyContent="space-between">
                      <Text fontSize="$4" color="$gray10">Requester:</Text>
                      <Text fontSize="$4" fontWeight="500">
                        {request.requester.name}
                      </Text>
                    </XStack>

                    {request.requesterOrg && (
                      <XStack justifyContent="space-between">
                        <Text fontSize="$4" color="$gray10">Organization:</Text>
                        <Text fontSize="$4" fontWeight="500">
                          {request.requesterOrg.name}
                        </Text>
                      </XStack>
                    )}

                    <XStack justifyContent="space-between">
                      <Text fontSize="$4" color="$gray10">Created:</Text>
                      <Text fontSize="$4" fontWeight="500">
                        {formatDate(request.createdAt)}
                      </Text>
                    </XStack>

                    {request.expiresAt && (
                      <XStack justifyContent="space-between">
                        <Text fontSize="$4" color="$gray10">Expires:</Text>
                        <Text fontSize="$4" fontWeight="500" color={isExpired ? '$red9' : '$color'}>
                          {formatDate(request.expiresAt)}
                          {isExpired && ' (Expired)'}
                        </Text>
                      </XStack>
                    )}

                    <XStack justifyContent="space-between">
                      <Text fontSize="$4" color="$gray10">Visibility:</Text>
                      <Text fontSize="$4" fontWeight="500">
                        {request.isPublic ? 'Public' : 'Private'}
                      </Text>
                    </XStack>
                  </YStack>
                </Card.Footer>
              </Card>

              {/* Action Button */}
              {canRespond && (
                <Button
                  backgroundColor="$blue9"
                  color="white"
                  icon={MessageCircle}
                  onPress={handleSubmitResponse}
                >
                  Submit Response
                </Button>
              )}
            </YStack>
          </Tabs.Content>

          {/* Responses Tab */}
          <Tabs.Content value="responses">
            <YStack space="$4">
              {request.responses && request.responses.length > 0 ? (
                <>
                  {pendingResponses.length > 0 && (
                    <YStack space="$3">
                      <Text fontSize="$5" fontWeight="600" color="$color">
                        Pending Responses ({pendingResponses.length})
                      </Text>
                      {pendingResponses.map((response) => (
                        <RequestResponseCard
                          key={response.id}
                          response={response}
                          onAccept={handleAcceptResponse}
                          onReject={handleRejectResponse}
                          onContact={handleContactSeller}
                          showActions={true}
                        />
                      ))}
                    </YStack>
                  )}

                  {acceptedResponses.length > 0 && (
                    <YStack space="$3">
                      <Text fontSize="$5" fontWeight="600" color="$green9">
                        Accepted Responses ({acceptedResponses.length})
                      </Text>
                      {acceptedResponses.map((response) => (
                        <RequestResponseCard
                          key={response.id}
                          response={response}
                          onContact={handleContactSeller}
                          showActions={false}
                        />
                      ))}
                    </YStack>
                  )}

                  {rejectedResponses.length > 0 && (
                    <YStack space="$3">
                      <Text fontSize="$5" fontWeight="600" color="$red9">
                        Rejected Responses ({rejectedResponses.length})
                      </Text>
                      {rejectedResponses.map((response) => (
                        <RequestResponseCard
                          key={response.id}
                          response={response}
                          showActions={false}
                        />
                      ))}
                    </YStack>
                  )}
                </>
              ) : (
                <YStack flex={1} justifyContent="center" alignItems="center" space="$4" padding="$6">
                  <Text fontSize="$5" fontWeight="600" color="$gray11" textAlign="center">
                    No responses yet
                  </Text>
                  <Text fontSize="$4" color="$gray10" textAlign="center">
                    Sellers will see your request and can submit responses with their diamond proposals.
                  </Text>
                </YStack>
              )}

              {/* Submit Response Button for Public Requests */}
              {canRespond && (
                <Button
                  backgroundColor="$blue9"
                  color="white"
                  icon={MessageCircle}
                  onPress={handleSubmitResponse}
                >
                  Submit Response
                </Button>
              )}
            </YStack>
          </Tabs.Content>
        </Tabs>
      </YStack>
    </ScrollView>
  );
}