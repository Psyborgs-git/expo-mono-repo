import React, { useMemo } from 'react';
import { YStack, XStack, Text, Card } from 'tamagui';
import { TrendingUp, DollarSign, Package, Clock, Users } from '@tamagui/lucide-icons';
import { OrderBasicFragment } from '../../src/graphql/orders/orders.generated';
import { OrderStatus, PaymentStatus } from '../../src/generated/graphql';

interface OrderAnalyticsProps {
  orders: OrderBasicFragment[];
  title?: string;
}

interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  paidOrders: number;
  unpaidOrders: number;
  topBuyers: Array<{ name: string; orderCount: number; totalSpent: number }>;
  recentTrends: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
}

export function OrderAnalytics({ orders, title = "Order Analytics" }: OrderAnalyticsProps) {
  const analytics = useMemo((): AnalyticsData => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const completedOrders = orders.filter(order => order.status === OrderStatus.Completed).length;
    const pendingOrders = orders.filter(order => 
      order.status === OrderStatus.Pending || 
      order.status === OrderStatus.Confirmed ||
      order.status === OrderStatus.Processing
    ).length;
    const cancelledOrders = orders.filter(order => order.status === OrderStatus.Canceled).length;

    const paidOrders = orders.filter(order => order.paymentStatus === PaymentStatus.Paid).length;
    const unpaidOrders = orders.filter(order => order.paymentStatus !== PaymentStatus.Paid).length;

    // Calculate top buyers
    const buyerMap = new Map<string, { name: string; orderCount: number; totalSpent: number }>();
    orders.forEach(order => {
      const buyerId = order.buyer.id;
      const existing = buyerMap.get(buyerId) || { 
        name: order.buyer.name, 
        orderCount: 0, 
        totalSpent: 0 
      };
      
      buyerMap.set(buyerId, {
        name: existing.name,
        orderCount: existing.orderCount + 1,
        totalSpent: existing.totalSpent + order.totalAmount,
      });
    });

    const topBuyers = Array.from(buyerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    // Calculate recent trends (this month vs last month)
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthOrders = orders.filter(order => 
      new Date(order.createdAt) >= thisMonthStart
    ).length;

    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
    }).length;

    const growth = lastMonthOrders > 0 
      ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 
      : 0;

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      paidOrders,
      unpaidOrders,
      topBuyers,
      recentTrends: {
        thisMonth: thisMonthOrders,
        lastMonth: lastMonthOrders,
        growth,
      },
    };
  }, [orders]);

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  if (orders.length === 0) {
    return (
      <YStack space="$3">
        <Text fontSize="$6" fontWeight="600">{title}</Text>
        <Card bordered padding="$4">
          <Text fontSize="$4" color="$gray11" textAlign="center">
            No orders available for analysis
          </Text>
        </Card>
      </YStack>
    );
  }

  return (
    <YStack space="$4">
      <Text fontSize="$6" fontWeight="600">{title}</Text>

      {/* Key Metrics */}
      <YStack space="$3">
        <Text fontSize="$5" fontWeight="600">Key Metrics</Text>
        
        <XStack space="$3" flexWrap="wrap">
          <Card flex={1} minWidth={150} bordered padding="$3">
            <YStack space="$2" alignItems="center">
              <Package size={24} color="$blue10" />
              <Text fontSize="$6" fontWeight="600" color="$blue10">
                {analytics.totalOrders}
              </Text>
              <Text fontSize="$3" color="$gray11" textAlign="center">
                Total Orders
              </Text>
            </YStack>
          </Card>

          <Card flex={1} minWidth={150} bordered padding="$3">
            <YStack space="$2" alignItems="center">
              <DollarSign size={24} color="$green10" />
              <Text fontSize="$6" fontWeight="600" color="$green10">
                {formatCurrency(analytics.totalRevenue)}
              </Text>
              <Text fontSize="$3" color="$gray11" textAlign="center">
                Total Revenue
              </Text>
            </YStack>
          </Card>

          <Card flex={1} minWidth={150} bordered padding="$3">
            <YStack space="$2" alignItems="center">
              <TrendingUp size={24} color="$purple10" />
              <Text fontSize="$6" fontWeight="600" color="$purple10">
                {formatCurrency(analytics.averageOrderValue)}
              </Text>
              <Text fontSize="$3" color="$gray11" textAlign="center">
                Avg Order Value
              </Text>
            </YStack>
          </Card>
        </XStack>
      </YStack>

      {/* Order Status Breakdown */}
      <YStack space="$3">
        <Text fontSize="$5" fontWeight="600">Order Status</Text>
        
        <XStack space="$3" flexWrap="wrap">
          <Card flex={1} minWidth={120} bordered padding="$3" backgroundColor="$green1">
            <YStack space="$1" alignItems="center">
              <Text fontSize="$5" fontWeight="600" color="$green11">
                {analytics.completedOrders}
              </Text>
              <Text fontSize="$3" color="$green11" textAlign="center">
                Completed
              </Text>
            </YStack>
          </Card>

          <Card flex={1} minWidth={120} bordered padding="$3" backgroundColor="$orange1">
            <YStack space="$1" alignItems="center">
              <Text fontSize="$5" fontWeight="600" color="$orange11">
                {analytics.pendingOrders}
              </Text>
              <Text fontSize="$3" color="$orange11" textAlign="center">
                In Progress
              </Text>
            </YStack>
          </Card>

          <Card flex={1} minWidth={120} bordered padding="$3" backgroundColor="$red1">
            <YStack space="$1" alignItems="center">
              <Text fontSize="$5" fontWeight="600" color="$red11">
                {analytics.cancelledOrders}
              </Text>
              <Text fontSize="$3" color="$red11" textAlign="center">
                Cancelled
              </Text>
            </YStack>
          </Card>
        </XStack>
      </YStack>

      {/* Payment Status */}
      <YStack space="$3">
        <Text fontSize="$5" fontWeight="600">Payment Status</Text>
        
        <XStack space="$3">
          <Card flex={1} bordered padding="$3" backgroundColor="$green1">
            <YStack space="$1" alignItems="center">
              <Text fontSize="$5" fontWeight="600" color="$green11">
                {analytics.paidOrders}
              </Text>
              <Text fontSize="$3" color="$green11" textAlign="center">
                Paid Orders
              </Text>
            </YStack>
          </Card>

          <Card flex={1} bordered padding="$3" backgroundColor="$orange1">
            <YStack space="$1" alignItems="center">
              <Text fontSize="$5" fontWeight="600" color="$orange11">
                {analytics.unpaidOrders}
              </Text>
              <Text fontSize="$3" color="$orange11" textAlign="center">
                Unpaid Orders
              </Text>
            </YStack>
          </Card>
        </XStack>
      </YStack>

      {/* Recent Trends */}
      <YStack space="$3">
        <Text fontSize="$5" fontWeight="600">Recent Trends</Text>
        
        <Card bordered padding="$3">
          <YStack space="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <YStack>
                <Text fontSize="$4" fontWeight="500">This Month</Text>
                <Text fontSize="$3" color="$gray11">
                  {analytics.recentTrends.thisMonth} orders
                </Text>
              </YStack>
              
              <YStack alignItems="flex-end">
                <Text fontSize="$4" fontWeight="500">Growth</Text>
                <Text 
                  fontSize="$3" 
                  color={analytics.recentTrends.growth >= 0 ? '$green11' : '$red11'}
                  fontWeight="500"
                >
                  {formatPercentage(analytics.recentTrends.growth)}
                </Text>
              </YStack>
            </XStack>
            
            <Text fontSize="$3" color="$gray11">
              Compared to last month ({analytics.recentTrends.lastMonth} orders)
            </Text>
          </YStack>
        </Card>
      </YStack>

      {/* Top Buyers */}
      {analytics.topBuyers.length > 0 && (
        <YStack space="$3">
          <Text fontSize="$5" fontWeight="600">Top Buyers</Text>
          
          <YStack space="$2">
            {analytics.topBuyers.map((buyer, index) => (
              <Card key={buyer.name} bordered padding="$3">
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" space="$3">
                    <YStack
                      width={24}
                      height={24}
                      backgroundColor="$blue9"
                      borderRadius="$12"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="$2" color="white" fontWeight="600">
                        {index + 1}
                      </Text>
                    </YStack>
                    
                    <YStack>
                      <Text fontSize="$4" fontWeight="500">
                        {buyer.name}
                      </Text>
                      <Text fontSize="$3" color="$gray11">
                        {buyer.orderCount} order{buyer.orderCount !== 1 ? 's' : ''}
                      </Text>
                    </YStack>
                  </XStack>
                  
                  <Text fontSize="$4" fontWeight="600" color="$green10">
                    {formatCurrency(buyer.totalSpent)}
                  </Text>
                </XStack>
              </Card>
            ))}
          </YStack>
        </YStack>
      )}
    </YStack>
  );
}