import React from 'react';
import { View, Text, YStack } from 'tamagui';
import { Stack, useRouter } from 'expo-router';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { CreateRequestForm } from '../../components/requests/CreateRequestForm';

export default function CreateRequestScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AuthGuard requireOrganization={true}>
      <Stack.Screen
        options={{
          title: 'Create Request',
          headerShown: true,
        }}
      />
      <View flex={1} backgroundColor="$background">
        <CreateRequestForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </View>
    </AuthGuard>
  );
}