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
  TextArea,
  Separator,
  ScrollView,
  Switch,
} from 'tamagui';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { useAuth } from '../../contexts/AuthContext';
import {
  useUpdateOrganizationMutation,
  useGetOrganizationQuery,
} from '../../src/generated/graphql';
import { Loading } from '../../components/atoms/Loading';

export default function OrganizationSettingsScreen() {
  const { organization } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { data, loading, refetch } = useGetOrganizationQuery({
    variables: { id: organization?.id || '' },
    skip: !organization?.id,
  });

  const [updateOrganization, { loading: updating }] =
    useUpdateOrganizationMutation();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domain: '',
    isActive: true,
  });

  React.useEffect(() => {
    if (data?.organization) {
      setFormData({
        name: data.organization.name || '',
        description: data.organization.description || '',
        domain: data.organization.domain || '',
        isActive: data.organization.isActive || true,
      });
    }
  }, [data]);

  const handleSave = async () => {
    if (!organization?.id) return;

    try {
      await updateOrganization({
        variables: {
          id: organization.id,
          data: {
            name: formData.name,
            description: formData.description,
            domain: formData.domain,
            isActive: formData.isActive,
          },
        },
      });

      Alert.alert('Success', 'Organization settings updated successfully');
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Update organization error:', error);
      Alert.alert('Error', 'Failed to update organization settings');
    }
  };

  const handleCancel = () => {
    if (data?.organization) {
      setFormData({
        name: data.organization.name || '',
        description: data.organization.description || '',
        domain: data.organization.domain || '',
        isActive: data.organization.isActive || true,
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <AuthGuard>
        <View flex={1} justifyContent='center' alignItems='center'>
          <Loading size='large' />
        </View>
      </AuthGuard>
    );
  }

  if (!data?.organization) {
    return (
      <AuthGuard>
        <View flex={1} justifyContent='center' alignItems='center' padding='$4'>
          <Text fontSize='$5' color='$gray10'>
            Organization not found
          </Text>
          <Button onPress={() => router.back()} marginTop='$4'>
            Go Back
          </Button>
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
              <XStack justifyContent='space-between' alignItems='center'>
                <Text fontSize='$7' fontWeight='bold' color='$color'>
                  Organization Settings
                </Text>
                {!isEditing ? (
                  <Button
                    size='$3'
                    variant='outlined'
                    onPress={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                ) : (
                  <XStack space='$2'>
                    <Button size='$3' variant='outlined' onPress={handleCancel}>
                      Cancel
                    </Button>
                    <Button
                      size='$3'
                      backgroundColor='$blue10'
                      color='white'
                      onPress={handleSave}
                      disabled={updating}
                    >
                      {updating ? 'Saving...' : 'Save'}
                    </Button>
                  </XStack>
                )}
              </XStack>
              <Text fontSize='$4' color='$gray10'>
                Manage your organization profile and settings
              </Text>
            </YStack>

            {/* Basic Information */}
            <Card elevate size='$4' bordered>
              <Card.Header padded>
                <YStack space='$4'>
                  <Text fontSize='$5' fontWeight='bold' color='$color'>
                    Basic Information
                  </Text>
                  <Separator />

                  <YStack space='$3'>
                    <YStack space='$2'>
                      <Text fontSize='$3' fontWeight='600' color='$color'>
                        Organization Name *
                      </Text>
                      <Input
                        value={formData.name}
                        onChangeText={text =>
                          setFormData(prev => ({ ...prev, name: text }))
                        }
                        placeholder='Enter organization name'
                        disabled={!isEditing}
                        backgroundColor={isEditing ? '$background' : '$gray2'}
                      />
                    </YStack>

                    <YStack space='$2'>
                      <Text fontSize='$3' fontWeight='600' color='$color'>
                        Description
                      </Text>
                      <TextArea
                        value={formData.description}
                        onChangeText={text =>
                          setFormData(prev => ({ ...prev, description: text }))
                        }
                        placeholder='Enter organization description'
                        disabled={!isEditing}
                        backgroundColor={isEditing ? '$background' : '$gray2'}
                        minHeight={80}
                      />
                    </YStack>

                    <YStack space='$2'>
                      <Text fontSize='$3' fontWeight='600' color='$color'>
                        Domain
                      </Text>
                      <Input
                        value={formData.domain}
                        onChangeText={text =>
                          setFormData(prev => ({ ...prev, domain: text }))
                        }
                        placeholder='Enter organization domain'
                        disabled={!isEditing}
                        backgroundColor={isEditing ? '$background' : '$gray2'}
                      />
                    </YStack>

                    <XStack justifyContent='space-between' alignItems='center'>
                      <Text fontSize='$3' fontWeight='600' color='$color'>
                        Active Status
                      </Text>
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={checked =>
                          setFormData(prev => ({ ...prev, isActive: checked }))
                        }
                        disabled={!isEditing}
                      />
                    </XStack>
                  </YStack>
                </YStack>
              </Card.Header>
            </Card>

            {/* Organization Info */}
            <Card elevate size='$4' bordered>
              <Card.Header padded>
                <YStack space='$3'>
                  <Text fontSize='$5' fontWeight='bold' color='$color'>
                    Organization Information
                  </Text>
                  <Separator />
                  <YStack space='$2'>
                    <XStack justifyContent='space-between'>
                      <Text fontSize='$3' color='$gray11'>
                        Created:
                      </Text>
                      <Text fontSize='$3' color='$color'>
                        {new Date(
                          data.organization.createdAt
                        ).toLocaleDateString()}
                      </Text>
                    </XStack>
                    <XStack justifyContent='space-between'>
                      <Text fontSize='$3' color='$gray11'>
                        Created By:
                      </Text>
                      <Text fontSize='$3' color='$color'>
                        {data.organization.createdBy.name}
                      </Text>
                    </XStack>
                    <XStack justifyContent='space-between'>
                      <Text fontSize='$3' color='$gray11'>
                        Members:
                      </Text>
                      <Text fontSize='$3' color='$color'>
                        {data.organization.organizationUsers.length}
                      </Text>
                    </XStack>
                    <XStack justifyContent='space-between'>
                      <Text fontSize='$3' color='$gray11'>
                        Last Updated:
                      </Text>
                      <Text fontSize='$3' color='$color'>
                        {new Date(
                          data.organization.updatedAt
                        ).toLocaleDateString()}
                      </Text>
                    </XStack>
                  </YStack>
                </YStack>
              </Card.Header>
            </Card>

            {/* Navigation Buttons */}
            <YStack space='$3'>
              <Button
                size='$4'
                variant='outlined'
                onPress={() => router.push('/organization/members')}
              >
                Manage Members
              </Button>

              <Button
                size='$4'
                variant='outlined'
                onPress={() => router.push('/organization/roles')}
              >
                Manage Roles & Permissions
              </Button>
            </YStack>
          </YStack>
        </View>
      </ScrollView>
    </AuthGuard>
  );
}
