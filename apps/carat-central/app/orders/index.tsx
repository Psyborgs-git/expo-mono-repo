import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { YStack, XStack, Text, Button, Input } from 'tamagui';
import { Plus } from '@tamagui/lucide-icons';
import {
  useGetMyOrdersQuery,
  useGetMyOrgOrdersQuery,
} from '../../src/graphql/orders/orders.generated';
import { OrderCard } from '../../components/orders/OrderCard';
import { OrderFilters } from '../../components/orders/OrderFilters';
import { Loading } from '../../components/atoms/Loading';
import { OrderStatus, PaymentStatus } from '../../src/generated/graphql';

type OrderFilterType = 'all' | 'buyer' | 'seller';
type StatusFilter = OrderStatus | 'all';
type PaymentFilter = PaymentStatus | 'all';

export default function OrdersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState<OrderFilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: myOrdersData,
    loading: myOrdersLoading,
    error: myOrdersError,
    refetch: refetchMyOrders,
  } = useGetMyOrdersQuery();

  const {
    data: orgOrdersData,
    loading: orgOrdersLoading,
    error: orgOrdersError,
    refetch: refetchOrgOrders,
  } = useGetMyOrgOrdersQuery();

  const loading = myOrdersLoading || orgOrdersLoading;
  const error = myOrdersError || orgOrdersError;

  // Combine and filter orders
  const allOrders = React.useMemo(() => {
    const myOrders = myOrdersData?.myOrders || [];
    const orgOrders = orgOrdersData?.myOrgOrders || [];

    // Combine orders and remove duplicates
    const orderMap = new Map();

    myOrders.forEach((order: any) => {
      orderMap.set(order.id, { ...order, type: 'buyer' });
    });

    orgOrders.forEach((order: any) => {
      if (!orderMap.has(order.id)) {
        orderMap.set(order.id, { ...order, type: 'seller' });
      }
    });

    return Array.from(orderMap.values());
  }, [myOrdersData, orgOrdersData]);

  const filteredOrders = React.useMemo(() => {
    return allOrders.filter(order => {
      // Filter by order type (buyer/seller)
      if (orderFilter === 'buyer' && order.type !== 'buyer') return false;
      if (orderFilter === 'seller' && order.type !== 'seller') return false;

      // Filter by status
      if (statusFilter !== 'all' && order.status !== statusFilter) return false;

      // Filter by payment status
      if (paymentFilter !== 'all' && order.paymentStatus !== paymentFilter)
        return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(query) ||
          order.buyer.name.toLowerCase().includes(query) ||
          order.seller.name.toLowerCase().includes(query) ||
          order.sellerOrg.name.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [allOrders, orderFilter, statusFilter, paymentFilter, searchQuery]);

  const handleRefresh = async () => {
    await Promise.all([refetchMyOrders(), refetchOrgOrders()]);
  };

  const renderOrderCard = ({ item }: { item: any }) => (
    <OrderCard
      order={item}
      onPress={() => router.push(`/orders/${item.id}`)}
      showType={orderFilter === 'all'}
    />
  );

  if (loading && !allOrders.length) {
    return <Loading />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Orders',
          headerRight: () => (
            <XStack space='$2'>
              <Button
                size='$3'
                variant='outlined'
                onPress={() => router.push('/orders/analytics')}
              >
                Analytics
              </Button>
              <Button
                size='$3'
                backgroundColor='$blue9'
                color='white'
                icon={Plus}
                onPress={() => router.push('/orders/create')}
              >
                New Order
              </Button>
            </XStack>
          ),
        }}
      />

      <YStack flex={1} backgroundColor='$background'>
        {/* Search and Filter Header */}
        <YStack padding='$4' space='$3' backgroundColor='$gray1'>
          <XStack space='$3' alignItems='center'>
            <YStack flex={1}>
              <Input
                placeholder='Search orders...'
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </YStack>
            <Button
              size='$4'
              variant='outlined'
              onPress={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </XStack>

          {/* Order Type Filter */}
          <XStack space='$2'>
            {(['all', 'buyer', 'seller'] as OrderFilterType[]).map(type => (
              <Button
                key={type}
                size='$3'
                variant='outlined'
                backgroundColor={
                  orderFilter === type ? '$blue9' : 'transparent'
                }
                color={orderFilter === type ? 'white' : '$blue9'}
                onPress={() => setOrderFilter(type)}
              >
                {type === 'all'
                  ? 'All Orders'
                  : type === 'buyer'
                    ? 'My Purchases'
                    : 'My Sales'}
              </Button>
            ))}
          </XStack>

          {/* Expandable Filters */}
          {showFilters && (
            <OrderFilters
              statusFilter={statusFilter}
              paymentFilter={paymentFilter}
              onStatusFilterChange={setStatusFilter}
              onPaymentFilterChange={setPaymentFilter}
            />
          )}
        </YStack>

        {/* Orders List */}
        <YStack flex={1}>
          {error ? (
            <YStack padding='$4' alignItems='center' space='$3'>
              <Text color='$red10'>Failed to load orders</Text>
              <Button onPress={handleRefresh}>Retry</Button>
            </YStack>
          ) : filteredOrders.length === 0 ? (
            <YStack
              flex={1}
              alignItems='center'
              justifyContent='center'
              space='$3'
            >
              <Text fontSize='$6' color='$gray11'>
                No orders found
              </Text>
              <Text color='$gray10' textAlign='center'>
                {searchQuery ||
                statusFilter !== 'all' ||
                paymentFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first order to get started'}
              </Text>
              {!searchQuery &&
                statusFilter === 'all' &&
                paymentFilter === 'all' && (
                  <Button
                    backgroundColor='$blue9'
                    color='white'
                    onPress={() => router.push('/orders/create')}
                  >
                    Create Order
                  </Button>
                )}
            </YStack>
          ) : (
            <FlatList
              data={filteredOrders}
              renderItem={renderOrderCard}
              keyExtractor={item => item.id}
              contentContainerStyle={{ padding: 16 }}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={handleRefresh}
                />
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </YStack>
      </YStack>
    </>
  );
}
