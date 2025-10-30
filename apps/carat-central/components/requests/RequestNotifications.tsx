import React from 'react';
import { YStack, XStack, Text, Button, Card, ScrollView } from 'tamagui';
import { Alert } from 'react-native';
import { Bell, BellOff, Clock, MessageCircle, CheckCircle, XCircle, Trash2 } from '@tamagui/lucide-icons';

interface RequestNotification {
  id: string;
  type: 'status_change' | 'expiration_warning' | 'new_response' | 'response_accepted' | 'response_rejected';
  title: string;
  message: string;
  requestId: string;
  timestamp: Date;
  read: boolean;
}

interface RequestNotificationsProps {
  notifications: RequestNotification[];
  onMarkAsRead: (notificationId: string) => void;
  onClearNotification: (notificationId: string) => void;
  onClearAll: () => void;
  onNotificationPress?: (requestId: string) => void;
}

const getNotificationIcon = (type: RequestNotification['type']) => {
  switch (type) {
    case 'status_change':
      return <CheckCircle size={16} color="$blue9" />;
    case 'expiration_warning':
      return <Clock size={16} color="$yellow9" />;
    case 'new_response':
      return <MessageCircle size={16} color="$green9" />;
    case 'response_accepted':
      return <CheckCircle size={16} color="$green9" />;
    case 'response_rejected':
      return <XCircle size={16} color="$red9" />;
    default:
      return <Bell size={16} color="$gray9" />;
  }
};

const getNotificationColor = (type: RequestNotification['type']) => {
  switch (type) {
    case 'status_change':
      return '$blue2';
    case 'expiration_warning':
      return '$yellow2';
    case 'new_response':
      return '$green2';
    case 'response_accepted':
      return '$green2';
    case 'response_rejected':
      return '$red2';
    default:
      return '$gray2';
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return timestamp.toLocaleDateString();
};

interface NotificationItemProps {
  notification: RequestNotification;
  onMarkAsRead: (notificationId: string) => void;
  onClearNotification: (notificationId: string) => void;
  onPress?: (requestId: string) => void;
}

function NotificationItem({ notification, onMarkAsRead, onClearNotification, onPress }: NotificationItemProps) {
  const handlePress = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    onPress?.(notification.requestId);
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Notification',
      'Are you sure you want to clear this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => onClearNotification(notification.id),
        },
      ]
    );
  };

  return (
    <Card
      elevate
      size="$3"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      backgroundColor={notification.read ? '$background' : getNotificationColor(notification.type)}
      borderColor={notification.read ? '$borderColor' : undefined}
      onPress={handlePress}
      marginBottom="$2"
    >
      <Card.Header padded>
        <XStack justifyContent="space-between" alignItems="flex-start">
          <XStack flex={1} space="$3" alignItems="flex-start">
            {getNotificationIcon(notification.type)}
            
            <YStack flex={1} space="$1">
              <XStack alignItems="center" space="$2">
                <Text fontSize="$4" fontWeight="600" color="$color" flex={1}>
                  {notification.title}
                </Text>
                {!notification.read && (
                  <Text
                    fontSize="$1"
                    fontWeight="600"
                    color="white"
                    backgroundColor="$blue9"
                    paddingHorizontal="$1"
                    paddingVertical="$0.5"
                    borderRadius="$1"
                  >
                    New
                  </Text>
                )}
              </XStack>
              
              <Text fontSize="$3" color="$gray11" numberOfLines={2}>
                {notification.message}
              </Text>
              
              <Text fontSize="$2" color="$gray10">
                {formatTimestamp(notification.timestamp)}
              </Text>
            </YStack>
          </XStack>
          
          <Button
            size="$2"
            icon={Trash2}
            onPress={handleClear}
            color="$gray10"
            backgroundColor="transparent"
          />
        </XStack>
      </Card.Header>
    </Card>
  );
}

export function RequestNotifications({
  notifications,
  onMarkAsRead,
  onClearNotification,
  onClearAll,
  onNotificationPress,
}: RequestNotificationsProps) {
  const unreadCount = notifications.filter(n => !n.read).length;
  const sortedNotifications = [...notifications].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: onClearAll,
        },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    notifications.filter(n => !n.read).forEach(notification => {
      onMarkAsRead(notification.id);
    });
  };

  if (notifications.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$4" padding="$6">
        <BellOff size={48} color="$gray10" />
        <Text fontSize="$5" fontWeight="600" color="$gray11" textAlign="center">
          No notifications
        </Text>
        <Text fontSize="$4" color="$gray10" textAlign="center">
          You'll see updates about your requests here
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center" padding="$4" paddingBottom="$2">
        <XStack alignItems="center" space="$2">
          <Text fontSize="$6" fontWeight="bold" color="$color">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Text
              fontSize="$2"
              fontWeight="600"
              color="white"
              backgroundColor="$red9"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              {unreadCount}
            </Text>
          )}
        </XStack>
        
        <XStack space="$2">
          {unreadCount > 0 && (
            <Button
              size="$3"
              variant="outlined"
              onPress={handleMarkAllAsRead}
            >
              Mark All Read
            </Button>
          )}
          <Button
            size="$3"
            variant="outlined"
            color="$red9"
            borderColor="$red8"
            onPress={handleClearAll}
          >
            Clear All
          </Button>
        </XStack>
      </XStack>

      {/* Notifications List */}
      <ScrollView flex={1} padding="$4" paddingTop="$2">
        <YStack space="$2">
          {sortedNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onClearNotification={onClearNotification}
              onPress={onNotificationPress}
            />
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}