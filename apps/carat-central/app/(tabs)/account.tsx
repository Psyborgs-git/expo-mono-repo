import React from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { View, Text, YStack, Button, Card, XStack, Separator } from 'tamagui';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { useAuth } from '../../contexts/AuthContext';

export default function AccountScreen() {
  const { user, organization, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            router.replace('/(auth)/login');
          } catch (error) {
            console.error('Logout error:', error);
            // Force navigation even if logout fails
            router.replace('/(auth)/login');
          }
        },
      },
    ]);
  };

  const handleSwitchOrganization = () => {
    router.push('/(auth)/organization-select');
  };

  return (
    <AuthGuard>
      <View
        flex={1}
        backgroundColor='$background'
        paddingHorizontal='$4'
        paddingTop='$8'
      >
        <YStack flex={1} space='$4'>
          {/* Header */}
          <YStack space='$2' alignItems='center'>
            <Text fontSize='$7' fontWeight='bold'>
              Account
            </Text>
            <Text fontSize='$4' color='$gray10'>
              Manage your profile and settings
            </Text>
          </YStack>

          {/* User Info Card */}
          <Card elevate size='$4' bordered>
            <Card.Header padded>
              <YStack space='$3'>
                <Text fontSize='$5' fontWeight='bold'>
                  Profile Information
                </Text>
                <Separator />
                <YStack space='$2'>
                  <XStack justifyContent='space-between'>
                    <Text fontSize='$3' color='$gray11'>
                      Name:
                    </Text>
                    <Text fontSize='$3'>{user?.name || 'Not provided'}</Text>
                  </XStack>
                  <XStack justifyContent='space-between'>
                    <Text fontSize='$3' color='$gray11'>
                      Email:
                    </Text>
                    <Text fontSize='$3'>{user?.email || 'Not provided'}</Text>
                  </XStack>
                  <XStack justifyContent='space-between'>
                    <Text fontSize='$3' color='$gray11'>
                      Mobile:
                    </Text>
                    <Text fontSize='$3'>{user?.mobile || 'Not provided'}</Text>
                  </XStack>
                </YStack>
              </YStack>
            </Card.Header>
          </Card>

          {/* Organization Info Card */}
          {organization && (
            <Card elevate size='$4' bordered>
              <Card.Header padded>
                <YStack space='$3'>
                  <Text fontSize='$5' fontWeight='bold'>
                    Current Organization
                  </Text>
                  <Separator />
                  <YStack space='$2'>
                    <XStack justifyContent='space-between'>
                      <Text fontSize='$3' color='$gray11'>
                        Name:
                      </Text>
                      <Text fontSize='$3'>{organization.name}</Text>
                    </XStack>
                    {organization.description && (
                      <XStack justifyContent='space-between'>
                        <Text fontSize='$3' color='$gray11'>
                          Description:
                        </Text>
                        <Text fontSize='$3' flex={1} textAlign='right'>
                          {organization.description}
                        </Text>
                      </XStack>
                    )}
                    <XStack justifyContent='space-between'>
                      <Text fontSize='$3' color='$gray11'>
                        Status:
                      </Text>
                      <Text
                        fontSize='$3'
                        color={organization.isActive ? '$green10' : '$red10'}
                      >
                        {organization.isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </XStack>
                  </YStack>
                </YStack>
              </Card.Header>
            </Card>
          )}

          {/* Organization Management */}
          {organization && (
            <Card elevate size='$4' bordered>
              <Card.Header padded>
                <YStack space='$3'>
                  <Text fontSize='$5' fontWeight='bold'>
                    Organization Management
                  </Text>
                  <Separator />
                  <YStack space='$2'>
                    <Button
                      size='$3'
                      variant='outlined'
                      onPress={() => router.push('/organization/settings')}
                    >
                      Organization Settings
                    </Button>
                    <Button
                      size='$3'
                      variant='outlined'
                      onPress={() => router.push('/organization/members')}
                    >
                      Manage Members
                    </Button>
                    <Button
                      size='$3'
                      variant='outlined'
                      onPress={() => router.push('/organization/roles')}
                    >
                      Roles & Permissions
                    </Button>
                    <Button
                      size='$3'
                      variant='outlined'
                      onPress={() => router.push('/organization/analytics')}
                    >
                      Analytics & Reports
                    </Button>
                  </YStack>
                </YStack>
              </Card.Header>
            </Card>
          )}

          {/* Actions */}
          <YStack space='$3' marginTop='$4'>
            <Button
              size='$4'
              variant='outlined'
              onPress={handleSwitchOrganization}
            >
              Switch Organization
            </Button>

            <Button
              size='$4'
              backgroundColor='$red10'
              color='white'
              onPress={handleLogout}
            >
              Logout
            </Button>
          </YStack>
        </YStack>
      </View>
    </AuthGuard>
  );
}
