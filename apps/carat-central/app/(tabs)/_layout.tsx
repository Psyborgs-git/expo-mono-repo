import React from 'react';
import { Tabs } from 'expo-router';
import { AuthGuard } from '../../components/auth/AuthGuard';

export default function TabLayout() {
  return (
    <AuthGuard requireOrganization={false}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
          },
        }}
      >
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }) => (
              // You can replace this with an actual icon component
              <div style={{ width: size, height: size, backgroundColor: color }} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <div style={{ width: size, height: size, backgroundColor: color }} />
            ),
          }}
        />
        <Tabs.Screen
          name="inventory"
          options={{
            title: 'Inventory',
            tabBarIcon: ({ color, size }) => (
              <div style={{ width: size, height: size, backgroundColor: color }} />
            ),
          }}
        />
        <Tabs.Screen
          name="requests"
          options={{
            title: 'Requests',
            tabBarIcon: ({ color, size }) => (
              <div style={{ width: size, height: size, backgroundColor: color }} />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: 'Account',
            tabBarIcon: ({ color, size }) => (
              <div style={{ width: size, height: size, backgroundColor: color }} />
            ),
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}