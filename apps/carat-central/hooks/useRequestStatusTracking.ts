import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { DiamondRequest, RequestStatus } from '../src/generated/graphql';

interface RequestStatusUpdate {
  requestId: string;
  oldStatus: RequestStatus;
  newStatus: RequestStatus;
  timestamp: Date;
}

interface RequestNotification {
  id: string;
  type: 'status_change' | 'expiration_warning' | 'new_response' | 'response_accepted' | 'response_rejected';
  title: string;
  message: string;
  requestId: string;
  timestamp: Date;
  read: boolean;
}

export function useRequestStatusTracking(requests: DiamondRequest[]) {
  const [statusUpdates, setStatusUpdates] = useState<RequestStatusUpdate[]>([]);
  const [notifications, setNotifications] = useState<RequestNotification[]>([]);
  const [previousRequests, setPreviousRequests] = useState<DiamondRequest[]>([]);

  // Track status changes
  useEffect(() => {
    if (previousRequests.length === 0) {
      setPreviousRequests(requests);
      return;
    }

    const newStatusUpdates: RequestStatusUpdate[] = [];
    const newNotifications: RequestNotification[] = [];

    requests.forEach(currentRequest => {
      const previousRequest = previousRequests.find(r => r.id === currentRequest.id);
      
      if (previousRequest && previousRequest.status !== currentRequest.status) {
        const statusUpdate: RequestStatusUpdate = {
          requestId: currentRequest.id,
          oldStatus: previousRequest.status,
          newStatus: currentRequest.status,
          timestamp: new Date(),
        };
        
        newStatusUpdates.push(statusUpdate);

        // Create notification for status change
        const notification: RequestNotification = {
          id: `status_${currentRequest.id}_${Date.now()}`,
          type: 'status_change',
          title: 'Request Status Updated',
          message: `"${currentRequest.title}" status changed from ${previousRequest.status} to ${currentRequest.status}`,
          requestId: currentRequest.id,
          timestamp: new Date(),
          read: false,
        };
        
        newNotifications.push(notification);
      }

      // Check for new responses
      const previousResponseCount = previousRequest?.responseCount || 0;
      if (currentRequest.responseCount > previousResponseCount) {
        const newResponsesCount = currentRequest.responseCount - previousResponseCount;
        const notification: RequestNotification = {
          id: `response_${currentRequest.id}_${Date.now()}`,
          type: 'new_response',
          title: 'New Response Received',
          message: `"${currentRequest.title}" received ${newResponsesCount} new response${newResponsesCount > 1 ? 's' : ''}`,
          requestId: currentRequest.id,
          timestamp: new Date(),
          read: false,
        };
        
        newNotifications.push(notification);
      }
    });

    if (newStatusUpdates.length > 0) {
      setStatusUpdates(prev => [...prev, ...newStatusUpdates]);
    }

    if (newNotifications.length > 0) {
      setNotifications(prev => [...prev, ...newNotifications]);
    }

    setPreviousRequests(requests);
  }, [requests, previousRequests]);

  // Check for expiring requests
  useEffect(() => {
    const checkExpiringRequests = () => {
      const now = new Date();
      const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

      requests.forEach(request => {
        if (request.expiresAt && request.status === RequestStatus.Open) {
          const expirationDate = new Date(request.expiresAt);
          
          // Check if expiring within 24 hours
          if (expirationDate <= oneDayFromNow && expirationDate > now) {
            const existingNotification = notifications.find(
              n => n.requestId === request.id && n.type === 'expiration_warning'
            );
            
            if (!existingNotification) {
              const notification: RequestNotification = {
                id: `expiring_${request.id}_${Date.now()}`,
                type: 'expiration_warning',
                title: 'Request Expiring Soon',
                message: `"${request.title}" expires in less than 24 hours`,
                requestId: request.id,
                timestamp: new Date(),
                read: false,
              };
              
              setNotifications(prev => [...prev, notification]);
            }
          }
          
          // Check if expiring within 3 days (for early warning)
          if (expirationDate <= threeDaysFromNow && expirationDate > oneDayFromNow) {
            const existingNotification = notifications.find(
              n => n.requestId === request.id && n.type === 'expiration_warning' && 
              n.message.includes('3 days')
            );
            
            if (!existingNotification) {
              const notification: RequestNotification = {
                id: `expiring_3d_${request.id}_${Date.now()}`,
                type: 'expiration_warning',
                title: 'Request Expiring Soon',
                message: `"${request.title}" expires in 3 days`,
                requestId: request.id,
                timestamp: new Date(),
                read: false,
              };
              
              setNotifications(prev => [...prev, notification]);
            }
          }
        }
      });
    };

    // Check immediately and then every hour
    checkExpiringRequests();
    const interval = setInterval(checkExpiringRequests, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [requests, notifications]);

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadNotifications = () => {
    return notifications.filter(n => !n.read);
  };

  const getRequestAnalytics = () => {
    const totalRequests = requests.length;
    const openRequests = requests.filter(r => r.status === RequestStatus.Open).length;
    const inProgressRequests = requests.filter(r => r.status === RequestStatus.InProgress).length;
    const fulfilledRequests = requests.filter(r => r.status === RequestStatus.Fulfilled).length;
    const expiredRequests = requests.filter(r => r.status === RequestStatus.Expired).length;
    const closedRequests = requests.filter(r => r.status === RequestStatus.Closed).length;

    const totalResponses = requests.reduce((sum, request) => sum + request.responseCount, 0);
    const averageResponsesPerRequest = totalRequests > 0 ? totalResponses / totalRequests : 0;

    const expiringRequests = requests.filter(request => {
      if (!request.expiresAt || request.status !== RequestStatus.Open) return false;
      const expirationDate = new Date(request.expiresAt);
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      return expirationDate <= threeDaysFromNow;
    }).length;

    return {
      totalRequests,
      openRequests,
      inProgressRequests,
      fulfilledRequests,
      expiredRequests,
      closedRequests,
      totalResponses,
      averageResponsesPerRequest: Math.round(averageResponsesPerRequest * 10) / 10,
      expiringRequests,
    };
  };

  const showNotificationAlert = (notification: RequestNotification) => {
    Alert.alert(
      notification.title,
      notification.message,
      [
        {
          text: 'Dismiss',
          style: 'cancel',
          onPress: () => markNotificationAsRead(notification.id),
        },
        {
          text: 'View Request',
          style: 'default',
          onPress: () => {
            markNotificationAsRead(notification.id);
            // Navigation would be handled by the component using this hook
          },
        },
      ]
    );
  };

  return {
    statusUpdates,
    notifications,
    unreadNotifications: getUnreadNotifications(),
    markNotificationAsRead,
    clearNotification,
    clearAllNotifications,
    getRequestAnalytics,
    showNotificationAlert,
  };
}