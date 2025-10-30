import React from 'react';
import { View } from 'tamagui';
import { useRouter } from 'expo-router';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { RequestsList } from '../../components/requests/RequestsList';
import { DiamondRequest } from '../../src/generated/graphql';

export default function RequestsScreen() {
  const router = useRouter();

  const handleRequestPress = (request: DiamondRequest) => {
    router.push(`/requests/${request.id}`);
  };

  return (
    <AuthGuard requireOrganization={true}>
      <View flex={1} backgroundColor="$background">
        <RequestsList onRequestPress={handleRequestPress} />
      </View>
    </AuthGuard>
  );
}