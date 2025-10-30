import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  ScrollView,
  Tabs,
  Spinner,
} from 'tamagui';
import { FlatList, Alert, RefreshControl } from 'react-native';
import { Plus, Filter, Bell, BarChart3 } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { RequestCard } from './RequestCard';
import { RequestAnalytics } from './RequestAnalytics';
import { RequestNotifications } from './RequestNotifications';
import { useMyRequests, useMyOrgRequests, usePublicRequests } from '../../hooks/useRequests';
import { useRequestStatusTracking } from '../../hooks/useRequestStatusTracking';
import { DiamondRequest, RequestStatus } from '../../src/generated/graphql';

interface RequestsListProps {
  onRequestPress?: (request: DiamondRequest) => void;
}

type TabValue = 'my-requests' | 'org-requests' | 'public-requests' | 'analytics' | 'notifications';

export function RequestsList({ onRequestPress }: RequestsListProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabValue>('my-requests');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');

  const {
    requests: myRequests,
    loading: myRequestsLoading,
    error: myRequestsError,
    refetch: refetchMyRequests,
  } = useMyRequests();

  const {
    requests: orgRequests,
    loading: orgRequestsLoading,
    error: orgRequestsError,
    refetch: refetchOrgRequests,
  } = useMyOrgRequests();

  const {
    requests: publicRequests,
    loading: publicRequestsLoading,
    error: publicRequestsError,
    refetch: refetchPublicRequests,
  } = usePublicRequests();

  // Status tracking for my requests
  const allMyRequests = [...myRequests, ...orgRequests];
  const {
    notifications,
    unreadNotifications,
    markNotificationAsRead,
    clearNotification,
    clearAllNotifications,
    getRequestAnalytics,
  } = useRequestStatusTracking(allMyRequests);

  const getCurrentRequests = () => {
    switch (activeTab) {
      case 'my-requests':
        return myRequests;
      case 'org-requests':
        return orgRequests;
      case 'public-requests':
        return publicRequests;
      case 'analytics':
      case 'notifications':
        return [];
      default:
        return [];
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case 'my-requests':
        return myRequestsLoading;
      case 'org-requests':
        return orgRequestsLoading;
      case 'public-requests':
        return publicRequestsLoading;
      case 'analytics':
      case 'notifications':
        return false;
      default:
        return false;
    }
  };

  const getCurrentError = () => {
    switch (activeTab) {
      case 'my-requests':
        return myRequestsError;
      case 'org-requests':
        return orgRequestsError;
      case 'public-requests':
        return publicRequestsError;
      case 'analytics':
      case 'notifications':
        return null;
      default:
        return null;
    }
  };

  const handleRefresh = () => {
    switch (activeTab) {
      case 'my-requests':
        refetchMyRequests();
        break;
      case 'org-requests':
        refetchOrgRequests();
        break;
      case 'public-requests':
        refetchPublicRequests();
        break;
      case 'analytics':
        refetchMyRequests();
        refetchOrgRequests();
        break;
      case 'notifications':
        // Notifications are managed locally
        break;
    }
  };

  const filteredRequests = getCurrentRequests().filter(request => {
    if (statusFilter === 'all') return true;
    return request.status === statusFilter;
  });

  const handleCreateRequest = () => {
    router.push('/requests/create');
  };

  const handleEditRequest = (request: DiamondRequest) => {
    // TODO: Implement edit functionality
    Alert.alert('Edit Request', 'Edit functionality will be implemented in the next phase');
  };

  const handleCancelRequest = (request: DiamondRequest) => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement cancel functionality
            Alert.alert('Cancel Request', 'Cancel functionality will be implemented in the next phase');
          },
        },
      ]
    );
  };

  const handleNotificationPress = (requestId: string) => {
    const request = allMyRequests.find(r => r.id === requestId);
    if (request && onRequestPress) {
      onRequestPress(request);
    }
  };

  const renderRequestItem = ({ item }: { item: DiamondRequest }) => (
    <RequestCard
      request={item}
      onPress={onRequestPress || undefined}
      onEdit={activeTab === 'my-requests' ? handleEditRequest : undefined}
      onCancel={activeTab === 'my-requests' ? handleCancelRequest : undefined}
      showActions={activeTab === 'my-requests'}
    />
  );

  const renderEmptyState = () => (
    <YStack flex={1} justifyContent="center" alignItems="center" space="$4" padding="$6">
      <Text fontSize="$6" fontWeight="600" color="$gray11" textAlign="center">
        {activeTab === 'my-requests' && 'No requests yet'}
        {activeTab === 'org-requests' && 'No organization requests'}
        {activeTab === 'public-requests' && 'No public requests available'}
      </Text>
      <Text fontSize="$4" color="$gray10" textAlign="center">
        {activeTab === 'my-requests' && 'Create your first diamond request to get started'}
        {activeTab === 'org-requests' && 'Your organization hasn\'t created any requests yet'}
        {activeTab === 'public-requests' && 'Check back later for new requests from buyers'}
      </Text>
      {activeTab === 'my-requests' && (
        <Button
          backgroundColor="$blue9"
          color="white"
          icon={Plus}
          onPress={handleCreateRequest}
        >
          Create Request
        </Button>
      )}
    </YStack>
  );

  const renderError = () => (
    <YStack flex={1} justifyContent="center" alignItems="center" space="$4" padding="$6">
      <Text fontSize="$5" fontWeight="600" color="$red9" textAlign="center">
        Error loading requests
      </Text>
      <Text fontSize="$4" color="$gray10" textAlign="center">
        {getCurrentError()?.message || 'Something went wrong'}
      </Text>
      <Button variant="outlined" onPress={handleRefresh}>
        Try Again
      </Button>
    </YStack>
  );

  if (getCurrentError()) {
    return renderError();
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header with Create Button */}
      <XStack justifyContent="space-between" alignItems="center" padding="$4" paddingBottom="$2">
        <Text fontSize="$7" fontWeight="bold" color="$color">
          Diamond Requests
        </Text>
        <XStack space="$2" alignItems="center">
          {unreadNotifications.length > 0 && (
            <XStack alignItems="center" space="$1">
              <Bell size={16} color="$blue9" />
              <Text fontSize="$2" color="$red9" fontWeight="bold">
                {unreadNotifications.length}
              </Text>
            </XStack>
          )}
          {(activeTab === 'my-requests' || activeTab === 'org-requests') && (
            <Button
              size="$3"
              backgroundColor="$blue9"
              color="white"
              icon={Plus}
              onPress={handleCreateRequest}
            >
              Create
            </Button>
          )}
        </XStack>
      </XStack>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        orientation="horizontal"
        flexDirection="column"
        flex={1}
      >
        <Tabs.List
          separator={<></>}
          paddingHorizontal="$4"
          backgroundColor="transparent"
        >
          <Tabs.Tab flex={1} value="my-requests">
            <Text fontSize="$3" fontWeight="500">My Requests</Text>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="org-requests">
            <Text fontSize="$3" fontWeight="500">Organization</Text>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="public-requests">
            <Text fontSize="$3" fontWeight="500">Public</Text>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="analytics">
            <XStack alignItems="center" space="$1">
              <BarChart3 size={14} />
              <Text fontSize="$3" fontWeight="500">Analytics</Text>
            </XStack>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="notifications">
            <XStack alignItems="center" space="$1">
              <Bell size={14} />
              <Text fontSize="$3" fontWeight="500">Alerts</Text>
              {unreadNotifications.length > 0 && (
                <Text fontSize="$1" color="$red9" fontWeight="bold">
                  ({unreadNotifications.length})
                </Text>
              )}
            </XStack>
          </Tabs.Tab>
        </Tabs.List>

        {/* Status Filter - Only show for request tabs */}
        {(activeTab === 'my-requests' || activeTab === 'org-requests' || activeTab === 'public-requests') && (
          <XStack padding="$4" paddingTop="$2" space="$2" alignItems="center">
            <Filter size={16} color="$gray10" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack space="$2">
                {(['all', 'OPEN', 'IN_PROGRESS', 'FULFILLED', 'EXPIRED', 'CLOSED'] as const).map((status) => (
                  <Button
                    key={status}
                    size="$2"
                    variant={statusFilter === status ? 'outlined' : undefined}
                    backgroundColor={statusFilter === status ? '$blue2' : 'transparent'}
                    borderColor={statusFilter === status ? '$blue8' : '$borderColor'}
                    onPress={() => setStatusFilter(status as RequestStatus | 'all')}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ')}
                  </Button>
                ))}
              </XStack>
            </ScrollView>
          </XStack>
        )}

        {/* Content */}
        <Tabs.Content value="my-requests" flex={1}>
          {getCurrentLoading() ? (
            <YStack flex={1} justifyContent="center" alignItems="center">
              <Spinner size="large" color="$blue9" />
            </YStack>
          ) : filteredRequests.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={filteredRequests}
              renderItem={renderRequestItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              refreshControl={
                <RefreshControl refreshing={getCurrentLoading()} onRefresh={handleRefresh} />
              }
            />
          )}
        </Tabs.Content>

        <Tabs.Content value="org-requests" flex={1}>
          {getCurrentLoading() ? (
            <YStack flex={1} justifyContent="center" alignItems="center">
              <Spinner size="large" color="$blue9" />
            </YStack>
          ) : filteredRequests.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={filteredRequests}
              renderItem={renderRequestItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              refreshControl={
                <RefreshControl refreshing={getCurrentLoading()} onRefresh={handleRefresh} />
              }
            />
          )}
        </Tabs.Content>

        <Tabs.Content value="public-requests" flex={1}>
          {getCurrentLoading() ? (
            <YStack flex={1} justifyContent="center" alignItems="center">
              <Spinner size="large" color="$blue9" />
            </YStack>
          ) : filteredRequests.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={filteredRequests}
              renderItem={renderRequestItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 16 }}
              refreshControl={
                <RefreshControl refreshing={getCurrentLoading()} onRefresh={handleRefresh} />
              }
            />
          )}
        </Tabs.Content>

        <Tabs.Content value="analytics" flex={1}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={getCurrentLoading()} onRefresh={handleRefresh} />
            }
          >
            <RequestAnalytics analytics={getRequestAnalytics()} />
          </ScrollView>
        </Tabs.Content>

        <Tabs.Content value="notifications" flex={1}>
          <RequestNotifications
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onClearNotification={clearNotification}
            onClearAll={clearAllNotifications}
            onNotificationPress={handleNotificationPress}
          />
        </Tabs.Content>
      </Tabs>
    </YStack>
  );
}