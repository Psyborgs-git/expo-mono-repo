import React from 'react';
import { View } from 'tamagui';
import { Stack, useLocalSearchParams } from 'expo-router';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { RequestDetailScreen } from '../../components/requests/RequestDetailScreen';

export default function RequestDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return (
    <AuthGuard requireOrganization={true}>
      <Stack.Screen
        options={{
          title: 'Request Details',
          headerShown: true,
        }}
      />
      <View flex={1} backgroundColor="$background">
        <RequestDetailScreen requestId={id} />
      </View>
    </AuthGuard>
  );
}