import React, { useState } from 'react';
import { Alert } from 'react-native';
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
} from 'tamagui';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { useAuth } from '../../contexts/AuthContext';
import {
  useGetOrganizationRolesQuery,
  useGetOrganizationPermissionsQuery,
  Role,
  Permission,
} from '../../src/generated/graphql';
import { Loading } from '../../components/atoms/Loading';

interface RoleCardProps {
  role: Role;
  permissions: Permission[];
  onEdit: (role: Role) => void;
}

function RoleCard({ role, onEdit }: RoleCardProps) {
  return (
    <Card elevate size='$3' bordered marginBottom='$3'>
      <Card.Header padded>
        <YStack space='$3'>
          <XStack justifyContent='space-between' alignItems='flex-start'>
            <YStack flex={1} space='$2'>
              <XStack alignItems='center' space='$2'>
                <Text fontSize='$4' fontWeight='bold' color='$color'>
                  {role.name}
                </Text>
                {role.isAdminRole && (
                  <View
                    backgroundColor='$red10'
                    paddingHorizontal='$2'
                    paddingVertical='$1'
                    borderRadius='$2'
                  >
                    <Text fontSize='$1' color='white' fontWeight='600'>
                      Admin
                    </Text>
                  </View>
                )}
                <View
                  backgroundColor={role.isActive ? '$green10' : '$gray10'}
                  paddingHorizontal='$2'
                  paddingVertical='$1'
                  borderRadius='$2'
                >
                  <Text fontSize='$1' color='white' fontWeight='600'>
                    {role.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </XStack>

              {role.description && (
                <Text fontSize='$3' color='$gray10'>
                  {role.description}
                </Text>
              )}

              <Text fontSize='$2' color='$gray11'>
                Created: {new Date(role.createdAt).toLocaleDateString()}
              </Text>
            </YStack>

            <Button size='$2' variant='outlined' onPress={() => onEdit(role)}>
              View Details
            </Button>
          </XStack>
        </YStack>
      </Card.Header>
    </Card>
  );
}

interface PermissionCardProps {
  permission: Permission;
}

function PermissionCard({ permission }: PermissionCardProps) {
  return (
    <Card elevate size='$2' bordered marginBottom='$2'>
      <Card.Header padded>
        <YStack space='$2'>
          <XStack justifyContent='space-between' alignItems='center'>
            <Text fontSize='$3' fontWeight='600' color='$color'>
              {permission.resource}:{permission.action}
            </Text>
            <View
              backgroundColor={permission.isActive ? '$green10' : '$gray10'}
              paddingHorizontal='$2'
              paddingVertical='$1'
              borderRadius='$2'
            >
              <Text fontSize='$1' color='white' fontWeight='600'>
                {permission.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </XStack>

          {permission.description && (
            <Text fontSize='$2' color='$gray10'>
              {permission.description}
            </Text>
          )}
        </YStack>
      </Card.Header>
    </Card>
  );
}

export default function RolesPermissionsScreen() {
  const { organization } = useAuth();
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: rolesData, loading: rolesLoading } =
    useGetOrganizationRolesQuery({
      variables: { organizationId: organization?.id || '' },
      skip: !organization?.id,
    });

  const { data: permissionsData, loading: permissionsLoading } =
    useGetOrganizationPermissionsQuery({
      variables: { organizationId: organization?.id || '' },
      skip: !organization?.id,
    });

  const roles = rolesData?.roles || [];
  const permissions = permissionsData?.permissions || [];

  const filteredRoles = roles.filter(
    (role: any) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (role.description &&
        role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPermissions = permissions.filter(
    (permission: any) =>
      permission.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (permission.description &&
        permission.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  const handleEditRole = (role: any) => {
    Alert.alert(
      role.name,
      `Role Details:\n\nDescription: ${role.description || 'No description'}\nAdmin Role: ${role.isAdminRole ? 'Yes' : 'No'}\nActive: ${role.isActive ? 'Yes' : 'No'}\nCreated: ${new Date(role.createdAt).toLocaleDateString()}`,
      [{ text: 'OK' }]
    );
  };

  const loading = rolesLoading || permissionsLoading;

  if (loading) {
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
      <View flex={1} backgroundColor='$background'>
        <YStack flex={1} padding='$4' space='$4'>
          {/* Header */}
          <YStack space='$2'>
            <Text fontSize='$7' fontWeight='bold' color='$color'>
              Roles & Permissions
            </Text>
            <Text fontSize='$4' color='$gray10'>
              Manage organization roles and permissions
            </Text>
          </YStack>

          {/* Tab Navigation */}
          <XStack space='$2'>
            <Button
              flex={1}
              size='$4'
              variant={activeTab === 'roles' ? 'outlined' : undefined}
              onPress={() => setActiveTab('roles')}
              backgroundColor={activeTab === 'roles' ? '$blue2' : 'transparent'}
            >
              Roles ({roles.length})
            </Button>
            <Button
              flex={1}
              size='$4'
              variant={activeTab === 'permissions' ? 'outlined' : undefined}
              onPress={() => setActiveTab('permissions')}
              backgroundColor={
                activeTab === 'permissions' ? '$blue2' : 'transparent'
              }
            >
              Permissions ({permissions.length})
            </Button>
          </XStack>

          {/* Search */}
          <Input
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            size='$4'
          />

          {/* Stats */}
          <Card elevate size='$3' bordered>
            <Card.Header padded>
              {activeTab === 'roles' ? (
                <XStack justifyContent='space-around'>
                  <YStack alignItems='center'>
                    <Text fontSize='$6' fontWeight='bold' color='$blue10'>
                      {roles.length}
                    </Text>
                    <Text fontSize='$3' color='$gray10'>
                      Total Roles
                    </Text>
                  </YStack>
                  <Separator vertical />
                  <YStack alignItems='center'>
                    <Text fontSize='$6' fontWeight='bold' color='$green10'>
                      {roles.filter((r: any) => r.isActive).length}
                    </Text>
                    <Text fontSize='$3' color='$gray10'>
                      Active Roles
                    </Text>
                  </YStack>
                  <Separator vertical />
                  <YStack alignItems='center'>
                    <Text fontSize='$6' fontWeight='bold' color='$red10'>
                      {roles.filter((r: any) => r.isAdminRole).length}
                    </Text>
                    <Text fontSize='$3' color='$gray10'>
                      Admin Roles
                    </Text>
                  </YStack>
                </XStack>
              ) : (
                <XStack justifyContent='space-around'>
                  <YStack alignItems='center'>
                    <Text fontSize='$6' fontWeight='bold' color='$blue10'>
                      {permissions.length}
                    </Text>
                    <Text fontSize='$3' color='$gray10'>
                      Total Permissions
                    </Text>
                  </YStack>
                  <Separator vertical />
                  <YStack alignItems='center'>
                    <Text fontSize='$6' fontWeight='bold' color='$green10'>
                      {permissions.filter((p: any) => p.isActive).length}
                    </Text>
                    <Text fontSize='$3' color='$gray10'>
                      Active Permissions
                    </Text>
                  </YStack>
                  <Separator vertical />
                  <YStack alignItems='center'>
                    <Text fontSize='$6' fontWeight='bold' color='$orange10'>
                      {new Set(permissions.map((p: any) => p.resource)).size}
                    </Text>
                    <Text fontSize='$3' color='$gray10'>
                      Resources
                    </Text>
                  </YStack>
                </XStack>
              )}
            </Card.Header>
          </Card>

          {/* Content */}
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack space='$3'>
              {activeTab === 'roles' ? (
                <>
                  {filteredRoles.map((role: any) => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      permissions={permissions}
                      onEdit={handleEditRole}
                    />
                  ))}

                  {filteredRoles.length === 0 && (
                    <Card elevate size='$4' bordered>
                      <Card.Header padded>
                        <YStack alignItems='center' space='$3'>
                          <Text fontSize='$5' color='$gray10'>
                            No roles found
                          </Text>
                          <Text
                            fontSize='$3'
                            color='$gray11'
                            textAlign='center'
                          >
                            {searchQuery
                              ? 'Try adjusting your search criteria'
                              : 'No roles have been created yet'}
                          </Text>
                        </YStack>
                      </Card.Header>
                    </Card>
                  )}
                </>
              ) : (
                <>
                  {filteredPermissions.map((permission: any) => (
                    <PermissionCard
                      key={permission.id}
                      permission={permission}
                    />
                  ))}

                  {filteredPermissions.length === 0 && (
                    <Card elevate size='$4' bordered>
                      <Card.Header padded>
                        <YStack alignItems='center' space='$3'>
                          <Text fontSize='$5' color='$gray10'>
                            No permissions found
                          </Text>
                          <Text
                            fontSize='$3'
                            color='$gray11'
                            textAlign='center'
                          >
                            {searchQuery
                              ? 'Try adjusting your search criteria'
                              : 'No permissions have been created yet'}
                          </Text>
                        </YStack>
                      </Card.Header>
                    </Card>
                  )}
                </>
              )}
            </YStack>
          </ScrollView>

          {/* Info Card */}
          <Card elevate size='$3' bordered>
            <Card.Header padded>
              <YStack space='$2'>
                <Text fontSize='$4' fontWeight='bold' color='$color'>
                  {activeTab === 'roles' ? 'About Roles' : 'About Permissions'}
                </Text>
                <Text fontSize='$3' color='$gray10'>
                  {activeTab === 'roles'
                    ? 'Roles define sets of permissions that can be assigned to organization members. Admin roles have elevated privileges.'
                    : 'Permissions define specific actions that can be performed on resources within the organization.'}
                </Text>
              </YStack>
            </Card.Header>
          </Card>
        </YStack>
      </View>
    </AuthGuard>
  );
}
