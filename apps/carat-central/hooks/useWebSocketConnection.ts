import { useEffect, useState, useRef, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';

export interface WebSocketConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  reconnectAttempts: number;
  lastConnectedAt: Date | null;
}

export interface WebSocketConnectionManager {
  state: WebSocketConnectionState;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_BASE = 1000; // 1 second
const RECONNECT_DELAY_MAX = 30000; // 30 seconds

export function useWebSocketConnection(): WebSocketConnectionManager {
  const { isAuthenticated, organization } = useAuth();
  const client = useApolloClient();
  const [state, setState] = useState<WebSocketConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempts: 0,
    lastConnectedAt: null,
  });

  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManualDisconnectRef = useRef(false);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const calculateReconnectDelay = useCallback((attempts: number) => {
    const delay = Math.min(
      RECONNECT_DELAY_BASE * Math.pow(2, attempts),
      RECONNECT_DELAY_MAX
    );
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }, []);

  const connect = useCallback(() => {
    if (!isAuthenticated || !organization) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: 'Not authenticated or no organization selected',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isConnecting: true,
      error: null,
    }));

    isManualDisconnectRef.current = false;

    // The actual WebSocket connection is handled by Apollo Client's GraphQLWsLink
    // We simulate the connection state based on authentication and organization
    const connectionTimer = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        reconnectAttempts: 0,
        lastConnectedAt: new Date(),
      }));
    }, 1000);

    return () => clearTimeout(connectionTimer);
  }, [isAuthenticated, organization]);

  const disconnect = useCallback(() => {
    isManualDisconnectRef.current = true;
    clearReconnectTimeout();
    
    setState(prev => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
      error: null,
    }));
  }, [clearReconnectTimeout]);

  const reconnect = useCallback(() => {
    if (isManualDisconnectRef.current) {
      return;
    }

    setState(prev => {
      const newAttempts = prev.reconnectAttempts + 1;
      
      if (newAttempts > MAX_RECONNECT_ATTEMPTS) {
        return {
          ...prev,
          isConnecting: false,
          error: 'Max reconnection attempts reached',
        };
      }

      const delay = calculateReconnectDelay(newAttempts);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, delay);

      return {
        ...prev,
        reconnectAttempts: newAttempts,
        isConnecting: true,
        error: `Reconnecting... (attempt ${newAttempts}/${MAX_RECONNECT_ATTEMPTS})`,
      };
    });
  }, [connect, calculateReconnectDelay]);

  // Handle connection state changes based on auth and organization
  useEffect(() => {
    if (isAuthenticated && organization && !isManualDisconnectRef.current) {
      connect();
    } else {
      disconnect();
    }
  }, [isAuthenticated, organization, connect, disconnect]);

  // Simulate connection errors and reconnection
  useEffect(() => {
    if (!state.isConnected || isManualDisconnectRef.current) {
      return;
    }

    // Listen for network state changes (if available)
    const handleOnline = () => {
      if (!state.isConnected && !isManualDisconnectRef.current) {
        connect();
      }
    };

    const handleOffline = () => {
      setState(prev => ({
        ...prev,
        isConnected: false,
        error: 'Network connection lost',
      }));
      
      if (!isManualDisconnectRef.current) {
        reconnect();
      }
    };

    // Add network event listeners if available (web only)
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [state.isConnected, connect, reconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearReconnectTimeout();
      isManualDisconnectRef.current = true;
    };
  }, [clearReconnectTimeout]);

  return {
    state,
    connect,
    disconnect,
    reconnect,
  };
}