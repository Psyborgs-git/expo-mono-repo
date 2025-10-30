import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
  View,
  Text,
  YStack,
  XStack,
  Button,
  Card,
  Input,
  Separator,
  ScrollView,
  Select,
  Adapt,
  Sheet,
} from 'tamagui';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { useAuth } from '../../contexts/AuthContext';
import {
  useGetOrganizationRolesQuery,
  useInviteUserToOrganizationMutation,
} from '../../src/generated/graphql';
import { Loading } from '../../components/atoms/Loading';
import { ChevronDown, Check } from '@tamagui/lucide-icons';

export default function InviteMemberScreen() {
  const { organization } = useAuth();
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    roleId: '',
  });
  const [inviteMethod, setInviteMethod] = useState<'userId' | 'email'>('email');

  const { data: rolesData, loading: rolesLoading } =
    useGetOrganizationRolesQuery({
      variables: { organizationId: organization?.id || '' },
      skip: !organization?.id,
    });

  const [inviteUser, { loading: inviting }] =
    useInviteUserToOrganizationMutation();

  const roles = rolesData?.roles || [];

  const handleInvite = async () => {
    if (!organization?.id) return;

    if (inviteMethod === 'email' && !formData.email) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    if (inviteMethod === 'userId' && !formData.userId) {
      Alert.alert('Error', 'Please enter a user ID');
      return;
    }

    try {
      await inviteUser({
        variables: {
          organizationId: organization.id,
          userId: inviteMethod === 'userId' ? formData.userId : formData.email,
          roleId: formData.roleId || undefined,
        },
      });

      Alert.alert('Success', 'User invited successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('Invite user error:', error);
      const errorMessage = error.message || 'Failed to invite user';
      Alert.alert('Error', errorMessage);
    }
  };

  const isFormValid = () => {
    if (inviteMethod === 'email') {
      return formData.email.trim() !== '';
    }
    return formData.userId.trim() !== '';
  };

  if (rolesLoading) {
    return (
      <AuthGuard>
        <View flex={1} justifyContent='center' alignItems='center'>
          <Loading size='large' />
        </View>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <ScrollView flex={1} backgroundColor='$background'>
        <View padding='$4'>
          <YStack space='$4'>
            {/* Header */}
            <YStack space='$2'>
              <Text fontSize='$7' fontWeight='bold' color='$color'>
                Invite Member
              </Text>
              <Text fontSize='$4' color='$gray10'>
                Invite a new member to join your organization
              </Text>
            </YStack>

            {/* Invite Method Selection */}
            <Card elevate size='$4' bordered>
              <Card.Header padded>
                <YStack space='$4'>
                  <Text fontSize='$5' fontWeight='bold' color='$color'>
                    Invitation Method
                  </Text>
                  <Separator />

                  <XStack space='$3'>
                    <Button
                      flex={1}
                      size='$4'
                      variant={inviteMethod === 'email' ? 'outlined' : 'ghost'}
                      onPress={() => setInviteMethod('email')}
                      backgroundColor={
                        inviteMethod === 'email' ? '$blue2' : 'transparent'
                      }
                    >
                      By Email
                    </Button>
                    <Button
                      flex={1}
                      size='$4'
                      variant={inviteMethod === 'userId' ? 'outlined' : 'ghost'}
                      onPress={() => setInviteMethod('userId')}
                      backgroundColor={
                        inviteMethod === 'userId' ? '$blue2' : 'transparent'
                      }
                    >
                      By User ID
                    </Button>
                  </XStack>
                </YStack>
              </Card.Header>
            </Card>

            {/* Invitation Form */}
            <Card elevate size='$4' bordered>
              <Card.Header padded>
                <YStack space='$4'>
                  <Text fontSize='$5' fontWeight='bold' color='$color'>
                    Member Details
                  </Text>
                  <Separator />

                  <YStack space='$3'>
                    {inviteMethod === 'email' ? (
                      <YStack space='$2'>
                        <Text fontSize='$3' fontWeight='600' color='$color'>
                          Email Address *
                        </Text>
                        <Input
                          value={formData.email}
                          onChangeText={text =>
                            setFormData(prev => ({ ...prev, email: text }))
                          }
                          placeholder='Enter email address'
                          keyboardType='email-address'
                          autoCapitalize='none'
                          size='$4'
                        />
                        <Text fontSize='$2' color='$gray11'>
                          An invitation will be sent to this email address
                        </Text>
                      </YStack>
                    ) : (
                      <YStack space='$2'>
                        <Text fontSize='$3' fontWeight='600' color='$color'>
                          User ID *
                        </Text>
                        <Input
                          value={formData.userId}
                          onChangeText={text =>
                            setFormData(prev => ({ ...prev, userId: text }))
                          }
                          placeholder='Enter user ID'
                          size='$4'
                        />
                        <Text fontSize='$2' color='$gray11'>
                          The exact user ID from the system
                        </Text>
                      </YStack>
                    )}

                    <YStack space='$2'>
                      <Text fontSize='$3' fontWeight='600' color='$color'>
                        Role (Optional)
                      </Text>
                      <Select
                        value={formData.roleId}
                        onValueChange={value =>
                          setFormData(prev => ({ ...prev, roleId: value }))
                        }
                        size='$4'
                      >
                        <Select.Trigger iconAfter={ChevronDown}>
                          <Select.Value placeholder='Select a role' />
                        </Select.Trigger>

                        <Adapt when='sm' platform='touch'>
                          <Sheet modal dismissOnSnapToBottom>
                            <Sheet.Frame>
                              <Sheet.ScrollView>
                                <Adapt.Contents />
                              </Sheet.ScrollView>
                            </Sheet.Frame>
                            <Sheet.Overlay />
                          </Sheet>
                        </Adapt>

                        <Select.Content zIndex={200000}>
                          <Select.ScrollUpButton />
                          <Select.Viewport>
                            <Select.Group>
                              <Select.Label>Available Roles</Select.Label>
                              <Select.Item index={0} value=''>
                                <Select.ItemText>
                                  No Role (Default)
                                </Select.ItemText>
                                <Select.ItemIndicator marginLeft='auto'>
                                  <Check size={16} />
                                </Select.ItemIndicator>
                              </Select.Item>
                              {roles.map((role, index) => (
                                <Select.Item
                                  key={role.id}
                                  index={index + 1}
                                  value={role.id}
                                >
                                  <Select.ItemText>{role.name}</Select.ItemText>
                                  <Select.ItemIndicator marginLeft='auto'>
                                    <Check size={16} />
                                  </Select.ItemIndicator>
                                </Select.Item>
                              ))}
                            </Select.Group>
                          </Select.Viewport>
                          <Select.ScrollDownButton />
                        </Select.Content>
                      </Select>
                      <Text fontSize='$2' color='$gray11'>
                        If no role is selected, the user will be added without
                        specific permissions
                      </Text>
                    </YStack>
                  </YStack>
                </YStack>
              </Card.Header>
            </Card>

            {/* Available Roles Info */}
            {roles.length > 0 && (
              <Card elevate size='$4' bordered>
                <Card.Header padded>
                  <YStack space='$3'>
                    <Text fontSize='$5' fontWeight='bold' color='$color'>
                      Available Roles
                    </Text>
                    <Separator />
                    <YStack space='$2'>
                      {roles.map(role => (
                        <XStack
                          key={role.id}
                          justifyContent='space-between'
                          alignItems='center'
                        >
                          <YStack flex={1}>
                            <Text fontSize='$3' fontWeight='600' color='$color'>
                              {role.name}
                            </Text>
                            {role.description && (
                              <Text fontSize='$2' color='$gray10'>
                                {role.description}
                              </Text>
                            )}
                          </YStack>
                          {role.isAdminRole && (
                            <Text fontSize='$2' color='$red10' fontWeight='600'>
                              Admin
                            </Text>
                          )}
                        </XStack>
                      ))}
                    </YStack>
                  </YStack>
                </Card.Header>
              </Card>
            )}

            {/* Action Buttons */}
            <YStack space='$3'>
              <Button
                size='$4'
                backgroundColor='$blue10'
                color='white'
                onPress={handleInvite}
                disabled={!isFormValid() || inviting}
              >
                {inviting ? 'Sending Invitation...' : 'Send Invitation'}
              </Button>

              <Button
                size='$4'
                variant='outlined'
                onPress={() => router.back()}
              >
                Cancel
              </Button>
            </YStack>
          </YStack>
        </View>
      </ScrollView>
    </AuthGuard>
  );
}
