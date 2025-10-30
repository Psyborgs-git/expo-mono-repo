import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { YStack, XStack, Text, Button } from 'tamagui';
import { BarChart3, TrendingUp, Users } from '@tamagui/lucide-icons';
import {
  useGetMyOrdersQuery,
  useGetMyOrgOrdersQuery,
} from '../../src/graphql/orders/orders.generated';
import { OrderAnalytics } from '../../components/orders/OrderAnalytics';
import { Loading } from '../../components/atoms/Loading';

type AnalyticsView = 'personal' | 'organization' | 'combined';

export default function OrderAnalyticsScreen() {
  const [activeView, setActiveView] = useState<AnalyticsView>('combined');

  const {
    data: myOrdersData,
    loading: myOrdersLoading,
    error: myOrdersError,
  } = useGetMyOrdersQuery();

  const {
    data: orgOrdersData,
    loading: orgOrdersLoading,
    error: orgOrdersError,
  } = useGetMyOrgOrdersQuery();

  const loading = myOrdersLoading || orgOrdersLoading;
  const error = myOrdersError || orgOrdersError;

  if (loading) return <Loading />;

  if (error) {
    return (
      <YStack flex={1} alignItems='center' justifyContent='center' space='$3'>
        <Text color='$red10'>Failed to load order analytics</Text>
        <Text color='$gray11' textAlign='center'>
          {error.message}
        </Text>
      </YStack>
    );
  }

  const myOrders = myOrdersData?.myOrders || [];
  const orgOrders = orgOrdersData?.myOrgOrders || [];

  // Combine orders and remove duplicates
  const allOrdersMap = new Map();
  myOrders.forEach(order => allOrdersMap.set(order.id, order));
  orgOrders.forEach(order => allOrdersMap.set(order.id, order));
  const allOrders = Array.from(allOrdersMap.values());

  const getOrdersForView = () => {
    switch (activeView) {
      case 'personal':
        return myOrders;
      case 'organization':
        return orgOrders;
      case 'combined':
      default:
        return allOrders;
    }
  };

  const getAnalyticsTitle = () => {
    switch (activeView) {
      case 'personal':
        return 'My Orders Analytics';
      case 'organization':
        return 'Organization Orders Analytics';
      case 'combined':
      default:
        return 'All Orders Analytics';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Order Analytics',
          headerBackTitle: 'Orders',
        }}
      />

      <ScrollView style={{ flex: 1, backgroundColor: '$background' }}>
        <YStack padding='$4' space='$4'>
          {/* View Selector */}
          <YStack space='$3'>
            <XStack alignItems='center' space='$3'>
              <BarChart3 size={24} color='$blue10' />
              <Text fontSize='$6' fontWeight='600'>
                Order Analytics
              </Text>
            </XStack>

            <XStack space='$2' flexWrap='wrap'>
              <Button
                size='$3'
                variant={activeView === 'combined' ? 'solid' : 'outlined'}
                backgroundColor={
                  activeView === 'combined' ? '$blue9' : 'transparent'
                }
                color={activeView === 'combined' ? 'white' : '$blue9'}
                onPress={() => setActiveView('combined')}
                icon={TrendingUp}
              >
                All Orders
              </Button>

              <Button
                size='$3'
                variant={activeView === 'personal' ? 'solid' : 'outlined'}
                backgroundColor={
                  activeView === 'personal' ? '$green9' : 'transparent'
                }
                color={activeView === 'personal' ? 'white' : '$green9'}
                onPress={() => setActiveView('personal')}
                icon={Users}
              >
                My Orders
              </Button>

              <Button
                size='$3'
                variant={activeView === 'organization' ? 'solid' : 'outlined'}
                backgroundColor={
                  activeView === 'organization' ? '$purple9' : 'transparent'
                }
                color={activeView === 'organization' ? 'white' : '$purple9'}
                onPress={() => setActiveView('organization')}
                icon={Users}
              >
                Organization
              </Button>
            </XStack>
          </YStack>

          {/* Analytics Component */}
          <OrderAnalytics
            orders={getOrdersForView()}
            title={getAnalyticsTitle()}
          />

          {/* Additional Insights */}
          {allOrders.length > 0 && (
            <YStack space='$3'>
              <Text fontSize='$5' fontWeight='600'>
                Insights
              </Text>

              <YStack space='$2'>
                <Text fontSize='$4' color='$gray11'>
                  • You have {myOrders.length} personal order
                  {myOrders.length !== 1 ? 's' : ''}
                </Text>
                <Text fontSize='$4' color='$gray11'>
                  • Your organization has {orgOrders.length} total order
                  {orgOrders.length !== 1 ? 's' : ''}
                </Text>
                <Text fontSize='$4' color='$gray11'>
                  • Combined total: {allOrders.length} unique order
                  {allOrders.length !== 1 ? 's' : ''}
                </Text>
              </YStack>
            </YStack>
          )}
        </YStack>
      </ScrollView>
    </>
  );
}
