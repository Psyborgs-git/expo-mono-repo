import React from 'react';
import { YStack, XStack, Text, Card, Progress } from 'tamagui';
import { TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle } from '@tamagui/lucide-icons';

interface RequestAnalyticsProps {
  analytics: {
    totalRequests: number;
    openRequests: number;
    inProgressRequests: number;
    fulfilledRequests: number;
    expiredRequests: number;
    closedRequests: number;
    totalResponses: number;
    averageResponsesPerRequest: number;
    expiringRequests: number;
  };
}

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
}

function MetricCard({ title, value, icon, color = '$blue9', subtitle }: MetricCardProps) {
  return (
    <Card elevate size="$3" bordered flex={1} minWidth={120}>
      <Card.Header padded>
        <XStack alignItems="center" space="$2">
          {icon}
          <YStack flex={1}>
            <Text fontSize="$2" color="$gray10" fontWeight="500">
              {title}
            </Text>
            <Text fontSize="$6" fontWeight="bold" color={color}>
              {value}
            </Text>
            {subtitle && (
              <Text fontSize="$1" color="$gray9">
                {subtitle}
              </Text>
            )}
          </YStack>
        </XStack>
      </Card.Header>
    </Card>
  );
}

export function RequestAnalytics({ analytics }: RequestAnalyticsProps) {
  const {
    totalRequests,
    openRequests,
    inProgressRequests,
    fulfilledRequests,
    expiredRequests,
    closedRequests,
    totalResponses,
    averageResponsesPerRequest,
    expiringRequests,
  } = analytics;

  const fulfillmentRate = totalRequests > 0 ? (fulfilledRequests / totalRequests) * 100 : 0;
  const activeRequests = openRequests + inProgressRequests;

  return (
    <YStack space="$4" padding="$4">
      <Text fontSize="$5" fontWeight="600" color="$color">
        Request Analytics
      </Text>

      {/* Overview Cards */}
      <XStack space="$3" flexWrap="wrap">
        <MetricCard
          title="Total Requests"
          value={totalRequests}
          icon={<TrendingUp size={16} color="$blue9" />}
          color="$blue9"
        />
        
        <MetricCard
          title="Active"
          value={activeRequests}
          icon={<Clock size={16} color="$green9" />}
          color="$green9"
          subtitle={`${openRequests} open, ${inProgressRequests} in progress`}
        />
        
        <MetricCard
          title="Fulfilled"
          value={fulfilledRequests}
          icon={<CheckCircle size={16} color="$purple9" />}
          color="$purple9"
          subtitle={`${fulfillmentRate.toFixed(1)}% rate`}
        />
      </XStack>

      <XStack space="$3" flexWrap="wrap">
        <MetricCard
          title="Total Responses"
          value={totalResponses}
          icon={<TrendingUp size={16} color="$orange9" />}
          color="$orange9"
          subtitle={`${averageResponsesPerRequest} avg per request`}
        />
        
        <MetricCard
          title="Expired"
          value={expiredRequests}
          icon={<XCircle size={16} color="$red9" />}
          color="$red9"
        />
        
        <MetricCard
          title="Expiring Soon"
          value={expiringRequests}
          icon={<AlertTriangle size={16} color="$yellow9" />}
          color="$yellow9"
          subtitle="Within 3 days"
        />
      </XStack>

      {/* Status Distribution */}
      {totalRequests > 0 && (
        <Card elevate bordered>
          <Card.Header padded>
            <Text fontSize="$4" fontWeight="600" color="$color">
              Status Distribution
            </Text>
          </Card.Header>
          <Card.Footer padded>
            <YStack space="$3">
              {/* Open Requests */}
              <YStack space="$1">
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" space="$2">
                    <Text
                      fontSize="$1"
                      fontWeight="600"
                      color="white"
                      backgroundColor="$green9"
                      paddingHorizontal="$1"
                      paddingVertical="$0.5"
                      borderRadius="$1"
                    >
                      Open
                    </Text>
                    <Text fontSize="$3" color="$color">
                      {openRequests} requests
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$gray10">
                    {((openRequests / totalRequests) * 100).toFixed(1)}%
                  </Text>
                </XStack>
                <Progress value={(openRequests / totalRequests) * 100} backgroundColor="$green2">
                  <Progress.Indicator animation="bouncy" backgroundColor="$green9" />
                </Progress>
              </YStack>

              {/* In Progress Requests */}
              <YStack space="$1">
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" space="$2">
                    <Text
                      fontSize="$1"
                      fontWeight="600"
                      color="white"
                      backgroundColor="$blue9"
                      paddingHorizontal="$1"
                      paddingVertical="$0.5"
                      borderRadius="$1"
                    >
                      In Progress
                    </Text>
                    <Text fontSize="$3" color="$color">
                      {inProgressRequests} requests
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$gray10">
                    {((inProgressRequests / totalRequests) * 100).toFixed(1)}%
                  </Text>
                </XStack>
                <Progress value={(inProgressRequests / totalRequests) * 100} backgroundColor="$blue2">
                  <Progress.Indicator animation="bouncy" backgroundColor="$blue9" />
                </Progress>
              </YStack>

              {/* Fulfilled Requests */}
              <YStack space="$1">
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" space="$2">
                    <Text
                      fontSize="$1"
                      fontWeight="600"
                      color="white"
                      backgroundColor="$purple9"
                      paddingHorizontal="$1"
                      paddingVertical="$0.5"
                      borderRadius="$1"
                    >
                      Fulfilled
                    </Text>
                    <Text fontSize="$3" color="$color">
                      {fulfilledRequests} requests
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$gray10">
                    {((fulfilledRequests / totalRequests) * 100).toFixed(1)}%
                  </Text>
                </XStack>
                <Progress value={(fulfilledRequests / totalRequests) * 100} backgroundColor="$purple2">
                  <Progress.Indicator animation="bouncy" backgroundColor="$purple9" />
                </Progress>
              </YStack>

              {/* Other statuses */}
              {(expiredRequests + closedRequests) > 0 && (
                <YStack space="$1">
                  <XStack justifyContent="space-between" alignItems="center">
                    <XStack alignItems="center" space="$2">
                      <Text
                        fontSize="$1"
                        fontWeight="600"
                        color="white"
                        backgroundColor="$gray9"
                        paddingHorizontal="$1"
                        paddingVertical="$0.5"
                        borderRadius="$1"
                      >
                        Other
                      </Text>
                      <Text fontSize="$3" color="$color">
                        {expiredRequests + closedRequests} requests
                      </Text>
                    </XStack>
                    <Text fontSize="$3" color="$gray10">
                      {(((expiredRequests + closedRequests) / totalRequests) * 100).toFixed(1)}%
                    </Text>
                  </XStack>
                  <Progress value={((expiredRequests + closedRequests) / totalRequests) * 100} backgroundColor="$gray2">
                    <Progress.Indicator animation="bouncy" backgroundColor="$gray9" />
                  </Progress>
                </YStack>
              )}
            </YStack>
          </Card.Footer>
        </Card>
      )}

      {/* Alerts */}
      {expiringRequests > 0 && (
        <Card elevate bordered borderColor="$yellow8" backgroundColor="$yellow1">
          <Card.Header padded>
            <XStack alignItems="center" space="$2">
              <AlertTriangle size={20} color="$yellow9" />
              <YStack flex={1}>
                <Text fontSize="$4" fontWeight="600" color="$yellow11">
                  Requests Expiring Soon
                </Text>
                <Text fontSize="$3" color="$yellow10">
                  {expiringRequests} request{expiringRequests !== 1 ? 's' : ''} will expire within 3 days
                </Text>
              </YStack>
            </XStack>
          </Card.Header>
        </Card>
      )}
    </YStack>
  );
}