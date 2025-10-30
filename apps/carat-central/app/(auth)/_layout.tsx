import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="organization-select" />
    </Stack>
  );
}