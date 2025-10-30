import React, { useState, useEffect } from 'react';
import { Alert, FlatList, Platform } from 'react-native';
import { router } from 'expo-router';
import {
  View,
  Text,
  YStack,
  XStack,
  Button,
  Card,
  Spinner,
  Separator,
  H2,
  H5,
  Theme,
} from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';
import { type Organization } from '@bdt/network';

interface OrganizationCardProps {
  organization: Organization;
  onSelect: (org: Organization) => void;
  isLoading: boolean;
}

function OrganizationCard({
  organization,
  onSelect,
  isLoading,
}: OrganizationCardProps) {
  return (
    <Card
      elevate
      size='$4'
      bordered
      animation='bouncy'
      hoverStyle={{ scale: 0.98, borderColor: '$blue9' }}
      pressStyle={{ scale: 0.96 }}
      onPress={() => onSelect(organization)}
      disabled={isLoading || !organization.isActive}
      opacity={isLoading || !organization.isActive ? 0.6 : 1}
      backgroundColor='$backgroundStrong'
      borderRadius='$5'
      borderWidth={2}
      borderColor='$gray5'
      shadowColor='$shadowColor'
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      cursor={organization.isActive && !isLoading ? 'pointer' : 'default'}
    >
      <Card.Header padded padding='$5'>
        <YStack space='$3'>
          <XStack justifyContent='space-between' alignItems='flex-start'>
            <YStack flex={1} space='$2'>
              <Text fontSize='$6' fontWeight='800' color='$gray12'>
                {organization.name}
              </Text>
              {organization.description && (
                <Text
                  fontSize='$3'
                  color='$gray10'
                  numberOfLines={2}
                  lineHeight='$1'
                >
                  {organization.description}
                </Text>
              )}
            </YStack>

            {/* Status Badge */}
            <XStack
              paddingHorizontal='$3'
              paddingVertical='$1.5'
              borderRadius='$3'
              backgroundColor={organization.isActive ? '$green5' : '$gray4'}
              borderWidth={1}
              borderColor={organization.isActive ? '$green9' : '$gray7'}
              alignItems='center'
              space='$2'
            >
              <View
                width='$0.75'
                height='$0.75'
                borderRadius='$10'
                backgroundColor={organization.isActive ? '$green10' : '$gray9'}
              />
              <Text
                fontSize='$2'
                fontWeight='700'
                color={organization.isActive ? '$green11' : '$gray11'}
                textTransform='uppercase'
              >
                {organization.isActive ? 'Active' : 'Inactive'}
              </Text>
            </XStack>
          </XStack>
        </YStack>
      </Card.Header>
    </Card>
  );
}

export default function OrganizationSelectScreen() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);

  const { fetchOrganizations, selectOrganization, logout, error } = useAuth();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setIsLoading(true);
      const orgs = await fetchOrganizations();
      setOrganizations(orgs);

      // Auto-select if only one organization
      if (orgs.length === 1 && orgs[0].isActive) {
        await handleSelectOrganization(orgs[0]);
        return;
      }

      // Handle no organizations case
      if (orgs.length === 0) {
        Alert.alert(
          'No Organizations',
          'You are not a member of any organization. Please contact your administrator.',
          [{ text: 'Logout', onPress: handleLogout }]
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load organizations';
      Alert.alert('Error', errorMessage, [
        { text: 'Retry', onPress: loadOrganizations },
        { text: 'Logout', onPress: handleLogout },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOrganization = async (organization: Organization) => {
    if (!organization.isActive) {
      Alert.alert(
        'Organization Inactive',
        'This organization is currently inactive. Please contact your administrator.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsSelecting(true);
      await selectOrganization(organization);

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to select organization';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSelecting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (err) {
      console.error('Logout error:', err);
      // Force navigation even if logout fails
      router.replace('/(auth)/login');
    }
  };

  const renderOrganization = ({ item }: { item: Organization }) => (
    <OrganizationCard
      organization={item}
      onSelect={handleSelectOrganization}
      isLoading={isSelecting}
    />
  );

  if (isLoading) {
    return (
      <Theme name='light'>
        <View
          flex={1}
          backgroundColor='$background'
          justifyContent='center'
          alignItems='center'
        >
          <YStack space='$4' alignItems='center'>
            <Spinner size='large' color='$blue10' />
            <Text fontSize='$5' color='$gray11' fontWeight='600'>
              Loading organizations...
            </Text>
          </YStack>
        </View>
      </Theme>
    );
  }

  return (
    <Theme name='light'>
      <View flex={1} backgroundColor='$background'>
        <YStack
          flex={1}
          paddingHorizontal='$6'
          paddingTop={Platform.OS === 'web' ? '$8' : '$12'}
          paddingBottom='$4'
        >
          {/* Header */}
          <YStack space='$3' alignItems='center' marginBottom='$6'>
            <H2
              fontSize='$9'
              fontWeight='800'
              color='$blue10'
              textAlign='center'
            >
              Select Organization
            </H2>
            <H5
              fontSize='$4'
              color='$gray11'
              fontWeight='500'
              textAlign='center'
              lineHeight='$2'
            >
              Choose an organization to continue
            </H5>
          </YStack>

          {/* Error Message */}
          {error && (
            <YStack
              marginBottom='$4'
              backgroundColor='$red5'
              padding='$4'
              borderRadius='$4'
              borderWidth={1}
              borderColor='$red9'
            >
              <Text
                color='$red11'
                fontSize='$3'
                textAlign='center'
                fontWeight='600'
              >
                {error}
              </Text>
            </YStack>
          )}

          {/* Organizations List */}
          {organizations.length > 0 ? (
            <YStack flex={1}>
              <FlatList
                data={organizations}
                renderItem={renderOrganization}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                ItemSeparatorComponent={() => <View height='$4' />}
              />
            </YStack>
          ) : (
            <YStack
              flex={1}
              justifyContent='center'
              alignItems='center'
              space='$4'
              backgroundColor='$gray2'
              borderRadius='$6'
              padding='$6'
              borderWidth={1}
              borderColor='$gray5'
              borderStyle='dashed'
            >
              <Text
                fontSize='$6'
                fontWeight='700'
                color='$gray11'
                textAlign='center'
              >
                No organizations available
              </Text>
              <Text
                fontSize='$4'
                color='$gray10'
                textAlign='center'
                lineHeight='$2'
              >
                You are not a member of any organization.{'\n'}
                Please contact your administrator for access.
              </Text>
            </YStack>
          )}

          {/* Footer Actions */}
          <YStack space='$4' paddingTop='$5'>
            <Separator />
            <XStack space='$3' justifyContent='center'>
              <Button
                size='$4'
                onPress={loadOrganizations}
                disabled={isLoading || isSelecting}
                backgroundColor='$gray3'
                color='$gray12'
                borderRadius='$4'
                fontWeight='600'
                borderWidth={1}
                borderColor='$gray6'
                flex={1}
                hoverStyle={{ backgroundColor: '$gray4' }}
                pressStyle={{ backgroundColor: '$gray5' }}
                icon={<Text>🔄</Text>}
              >
                Refresh
              </Button>
              <Button
                size='$4'
                onPress={handleLogout}
                disabled={isSelecting}
                backgroundColor='$red5'
                color='$red11'
                borderRadius='$4'
                fontWeight='600'
                borderWidth={1}
                borderColor='$red9'
                flex={1}
                hoverStyle={{ backgroundColor: '$red10', color: 'white' }}
                pressStyle={{ backgroundColor: '$red11', color: 'white' }}
              >
                Logout
              </Button>
            </XStack>
          </YStack>
        </YStack>

        {/* Loading Overlay */}
        {isSelecting && (
          <View
            position='absolute'
            top={0}
            left={0}
            right={0}
            bottom={0}
            backgroundColor='$backgroundPress'
            justifyContent='center'
            alignItems='center'
          >
            <YStack
              padding='$6'
              backgroundColor='$background'
              borderRadius='$6'
              space='$4'
              alignItems='center'
              shadowColor='$shadowColorStrong'
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={12}
              elevation={5}
              minWidth={280}
            >
              <Spinner size='large' color='$blue10' />
              <Text fontSize='$5' fontWeight='600' color='$gray12'>
                Selecting organization...
              </Text>
            </YStack>
          </View>
        )}
      </View>
    </Theme>
  );
}
