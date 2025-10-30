import React, { useState } from 'react';
import {
  View,
  Text,
  YStack,
  XStack,
  Button,
  Card,
  Separator,
  ScrollView,
  Select,
  Adapt,
  Sheet,
} from 'tamagui';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { useAuth } from '../../contexts/AuthContext';
import {
  useGetOrganizationQuery,
  useGetDiamondsQuery,
  useGetMyOrgOrdersQuery,
  useGetMyOrgRequestsQuery,
} from '../../src/generated/graphql';
import { Loading } from '../../components/atoms/Loading';
import {
  ChevronDown,
  Check,
  Download,
  TrendingUp,
  Users,
  Package,
  MessageSquare,
} from '@tamagui/lucide-icons';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = '$blue10',
  trend,
}: MetricCardProps) {
  return (
    <Card elevate size='$3' bordered>
      <Card.Header padded>
        <YStack space='$2'>
          <XStack justifyContent='space-between' alignItems='flex-start'>
            <YStack flex={1}>
              <Text fontSize='$3' color='$gray11' fontWeight='500'>
                {title}
              </Text>
              <Text fontSize='$6' fontWeight='bold' color={color}>
                {value}
              </Text>
              {subtitle && (
                <Text fontSize='$2' color='$gray10'>
                  {subtitle}
                </Text>
              )}
            </YStack>
            {icon && (
              <View
                padding='$2'
                backgroundColor={`${color}2`}
                borderRadius='$3'
              >
                {icon}
              </View>
            )}
          </XStack>

          {trend && (
            <XStack alignItems='center' space='$1'>
              <TrendingUp
                size={12}
                color={trend.isPositive ? '$green10' : '$red10'}
              />
              <Text
                fontSize='$2'
                color={trend.isPositive ? '$green10' : '$red10'}
                fontWeight='600'
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </Text>
              <Text fontSize='$2' color='$gray11'>
                vs last period
              </Text>
            </XStack>
          )}
        </YStack>
      </Card.Header>
    </Card>
  );
}

export default function OrganizationAnalyticsScreen() {
  const { organization } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');

  const { data: orgData, loading: orgLoading } = useGetOrganizationQuery({
    variables: { id: organization?.id || '' },
    skip: !organization?.id,
  });

  const { data: diamondsData, loading: diamondsLoading } = useGetDiamondsQuery({
    variables: { first: 1000 },
    skip: !organization?.id,
  });

  const { data: ordersData, loading: ordersLoading } = useGetMyOrgOrdersQuery({
    skip: !organization?.id,
  });

  const { data: requestsData, loading: requestsLoading } =
    useGetMyOrgRequestsQuery({
      skip: !organization?.id,
    });

  const loading =
    orgLoading || diamondsLoading || ordersLoading || requestsLoading;

  // Calculate metrics
  const totalMembers = orgData?.organization?.organizationUsers?.length || 0;
  const activeMembers =
    orgData?.organization?.organizationUsers?.filter((m: any) => m.isActive)
      ?.length || 0;
  const totalDiamonds = diamondsData?.diamonds?.totalCount || 0;
  const publicDiamonds =
    diamondsData?.diamonds?.edges?.filter((e: any) => e.node.isPublic)
      ?.length || 0;
  const totalOrders = ordersData?.myOrgOrders?.length || 0;
  const completedOrders =
    ordersData?.myOrgOrders?.filter((o: any) => o.status === 'COMPLETED')
      ?.length || 0;
  const totalRequests = requestsData?.myOrgRequests?.length || 0;
  const activeRequests =
    requestsData?.myOrgRequests?.filter(
      (r: any) => r.status === 'OPEN' || r.status === 'IN_PROGRESS'
    )?.length || 0;

  // Calculate total revenue from completed orders
  const totalRevenue =
    ordersData?.myOrgOrders
      ?.filter((o: any) => o.status === 'COMPLETED')
      ?.reduce((sum: number, order: any) => sum + order.totalAmount, 0) || 0;

  // Calculate average order value
  const avgOrderValue =
    completedOrders > 0 ? totalRevenue / completedOrders : 0;

  const handleExportData = () => {
    // In a real app, this would generate and download a report
    alert('Export functionality would be implemented here');
  };

  if (loading) {
    return (
      <AuthGuard>
        <View flex={1} justifyContent='center' alignItems='center'>
          <Loading size='large' />
        </View>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <ScrollView flex={1} backgroundColor='$background'>
        <View padding='$4'>
          <YStack space='$4'>
            {/* Header */}
            <YStack space='$2'>
              <XStack justifyContent='space-between' alignItems='center'>
                <Text fontSize='$7' fontWeight='bold' color='$color'>
                  Organization Analytics
                </Text>
                <Button
                  size='$3'
                  variant='outlined'
                  onPress={handleExportData}
                  icon={Download}
                >
                  Export
                </Button>
              </XStack>
              <Text fontSize='$4' color='$gray10'>
                {organization?.name} performance overview
              </Text>
            </YStack>

            {/* Time Range Filter */}
            <Card elevate size='$3' bordered>
              <Card.Header padded>
                <XStack justifyContent='space-between' alignItems='center'>
                  <Text fontSize='$4' fontWeight='600' color='$color'>
                    Time Range
                  </Text>
                  <Select
                    value={timeRange}
                    onValueChange={setTimeRange}
                    size='$3'
                  >
                    <Select.Trigger width={120} iconAfter={ChevronDown}>
                      <Select.Value />
                    </Select.Trigger>

                    <Adapt when='sm' platform='touch'>
                      <Sheet modal dismissOnSnapToBottom>
                        <Sheet.Frame>
                          <Sheet.ScrollView>
                            <Adapt.Contents />
                          </Sheet.ScrollView>
                        </Sheet.Frame>
                        <Sheet.Overlay />
                      </Sheet>
                    </Adapt>

                    <Select.Content zIndex={200000}>
                      <Select.ScrollUpButton />
                      <Select.Viewport>
                        <Select.Group>
                          <Select.Item index={0} value='7d'>
                            <Select.ItemText>Last 7 days</Select.ItemText>
                            <Select.ItemIndicator marginLeft='auto'>
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item index={1} value='30d'>
                            <Select.ItemText>Last 30 days</Select.ItemText>
                            <Select.ItemIndicator marginLeft='auto'>
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item index={2} value='90d'>
                            <Select.ItemText>Last 90 days</Select.ItemText>
                            <Select.ItemIndicator marginLeft='auto'>
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item index={3} value='1y'>
                            <Select.ItemText>Last year</Select.ItemText>
                            <Select.ItemIndicator marginLeft='auto'>
                              <Check size={16} />
                            </Select.ItemIndicator>
                          </Select.Item>
                        </Select.Group>
                      </Select.Viewport>
                      <Select.ScrollDownButton />
                    </Select.Content>
                  </Select>
                </XStack>
              </Card.Header>
            </Card>

            {/* Key Metrics Grid */}
            <YStack space='$3'>
              <Text fontSize='$5' fontWeight='bold' color='$color'>
                Key Metrics
              </Text>

              <YStack space='$3'>
                {/* Row 1 */}
                <XStack space='$3'>
                  <View flex={1}>
                    <MetricCard
                      title='Total Members'
                      value={totalMembers}
                      subtitle={`${activeMembers} active`}
                      icon={<Users size={20} color='$blue10' />}
                      color='$blue10'
                      trend={{ value: 12, isPositive: true }}
                    />
                  </View>
                  <View flex={1}>
                    <MetricCard
                      title='Total Revenue'
                      value={`$${totalRevenue.toLocaleString()}`}
                      subtitle={`${completedOrders} orders`}
                      icon={<TrendingUp size={20} color='$green10' />}
                      color='$green10'
                      trend={{ value: 8, isPositive: true }}
                    />
                  </View>
                </XStack>

                {/* Row 2 */}
                <XStack space='$3'>
                  <View flex={1}>
                    <MetricCard
                      title='Diamond Inventory'
                      value={totalDiamonds}
                      subtitle={`${publicDiamonds} public`}
                      icon={<Package size={20} color='$purple10' />}
                      color='$purple10'
                      trend={{ value: 5, isPositive: true }}
                    />
                  </View>
                  <View flex={1}>
                    <MetricCard
                      title='Active Requests'
                      value={activeRequests}
                      subtitle={`${totalRequests} total`}
                      icon={<MessageSquare size={20} color='$orange10' />}
                      color='$orange10'
                      trend={{ value: 15, isPositive: true }}
                    />
                  </View>
                </XStack>
              </YStack>
            </YStack>

            {/* Performance Metrics */}
            <Card elevate size='$4' bordered>
              <Card.Header padded>
                <YStack space='$4'>
                  <Text fontSize='$5' fontWeight='bold' color='$color'>
                    Performance Metrics
                  </Text>
                  <Separator />

                  <YStack space='$3'>
                    <XStack justifyContent='space-between' alignItems='center'>
                      <Text fontSize='$3' color='$gray11'>
                        Average Order Value
                      </Text>
                      <Text fontSize='$4' fontWeight='600' color='$color'>
                        ${avgOrderValue.toFixed(2)}
                      </Text>
                    </XStack>

                    <XStack justifyContent='space-between' alignItems='center'>
                      <Text fontSize='$3' color='$gray11'>
                        Order Completion Rate
                      </Text>
                      <Text fontSize='$4' fontWeight='600' color='$color'>
                        {totalOrders > 0
                          ? ((completedOrders / totalOrders) * 100).toFixed(1)
                          : 0}
                        %
                      </Text>
                    </XStack>

                    <XStack justifyContent='space-between' alignItems='center'>
                      <Text fontSize='$3' color='$gray11'>
                        Public Diamond Ratio
                      </Text>
                      <Text fontSize='$4' fontWeight='600' color='$color'>
                        {totalDiamonds > 0
                          ? ((publicDiamonds / totalDiamonds) * 100).toFixed(1)
                          : 0}
                        %
                      </Text>
                    </XStack>

                    <XStack justifyContent='space-between' alignItems='center'>
                      <Text fontSize='$3' color='$gray11'>
                        Member Activity Rate
                      </Text>
                      <Text fontSize='$4' fontWeight='600' color='$color'>
                        {totalMembers > 0
                          ? ((activeMembers / totalMembers) * 100).toFixed(1)
                          : 0}
                        %
                      </Text>
                    </XStack>
                  </YStack>
                </YStack>
              </Card.Header>
            </Card>

            {/* Activity Summary */}
            <Card elevate size='$4' bordered>
              <Card.Header padded>
                <YStack space='$4'>
                  <Text fontSize='$5' fontWeight='bold' color='$color'>
                    Activity Summary
                  </Text>
                  <Separator />

                  <YStack space='$3'>
                    <YStack space='$2'>
                      <Text fontSize='$3' fontWeight='600' color='$color'>
                        Recent Activity
                      </Text>
                      <Text fontSize='$3' color='$gray10'>
                        • {totalOrders} orders processed
                      </Text>
                      <Text fontSize='$3' color='$gray10'>
                        • {totalRequests} requests created
                      </Text>
                      <Text fontSize='$3' color='$gray10'>
                        • {totalDiamonds} diamonds in inventory
                      </Text>
                      <Text fontSize='$3' color='$gray10'>
                        • {totalMembers} team members
                      </Text>
                    </YStack>

                    <Separator />

                    <YStack space='$2'>
                      <Text fontSize='$3' fontWeight='600' color='$color'>
                        Organization Health
                      </Text>
                      <XStack justifyContent='space-between'>
                        <Text fontSize='$3' color='$gray10'>
                          Status:
                        </Text>
                        <Text
                          fontSize='$3'
                          color={
                            orgData?.organization?.isActive
                              ? '$green10'
                              : '$red10'
                          }
                        >
                          {orgData?.organization?.isActive
                            ? 'Active'
                            : 'Inactive'}
                        </Text>
                      </XStack>
                      <XStack justifyContent='space-between'>
                        <Text fontSize='$3' color='$gray10'>
                          Created:
                        </Text>
                        <Text fontSize='$3' color='$color'>
                          {orgData?.organization?.createdAt
                            ? new Date(
                                orgData.organization.createdAt
                              ).toLocaleDateString()
                            : 'N/A'}
                        </Text>
                      </XStack>
                    </YStack>
                  </YStack>
                </YStack>
              </Card.Header>
            </Card>

            {/* Export Options */}
            <Card elevate size='$4' bordered>
              <Card.Header padded>
                <YStack space='$3'>
                  <Text fontSize='$5' fontWeight='bold' color='$color'>
                    Export Data
                  </Text>
                  <Separator />
                  <Text fontSize='$3' color='$gray10'>
                    Export organization data for external analysis and
                    reporting.
                  </Text>

                  <YStack space='$2'>
                    <Button
                      size='$3'
                      variant='outlined'
                      onPress={handleExportData}
                    >
                      Export Member Data
                    </Button>
                    <Button
                      size='$3'
                      variant='outlined'
                      onPress={handleExportData}
                    >
                      Export Order History
                    </Button>
                    <Button
                      size='$3'
                      variant='outlined'
                      onPress={handleExportData}
                    >
                      Export Diamond Inventory
                    </Button>
                    <Button
                      size='$3'
                      variant='outlined'
                      onPress={handleExportData}
                    >
                      Export Full Report
                    </Button>
                  </YStack>
                </YStack>
              </Card.Header>
            </Card>
          </YStack>
        </View>
      </ScrollView>
    </AuthGuard>
  );
}
