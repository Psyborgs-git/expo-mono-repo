import React, { useState } from 'react';
import { Alert, FlatList } from 'react-native';
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
  Sheet,
} from 'tamagui';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { useAuth } from '../../contexts/AuthContext';
import {
  useGetOrganizationQuery,
  useGetOrganizationRolesQuery,
  useRemoveUserFromOrganizationMutation,
  useAssignRoleMutation,
  OrganizationMemberFragment,
} from '../../src/generated/graphql';
import { Loading } from '../../components/atoms/Loading';

interface MemberCardProps {
  member: OrganizationMemberFragment;
  onRemove: (memberId: string) => void;
  onChangeRole: (member: OrganizationMemberFragment) => void;
  currentUserId?: string;
}

function MemberCard({
  member,
  onRemove,
  onChangeRole,
  currentUserId,
}: MemberCardProps) {
  const isCurrentUser = member.userId === currentUserId;
  const isOwner = member.isOwner;

  return (
    <Card elevate size='$3' bordered marginBottom='$3'>
      <Card.Header padded>
        <YStack space='$3'>
          <XStack justifyContent='space-between' alignItems='flex-start'>
            <YStack flex={1} space='$1'>
              <Text fontSize='$4' fontWeight='bold' color='$color'>
                {member.user.name}
              </Text>
              <Text fontSize='$3' color='$gray10'>
                {member.user.email}
              </Text>
              <XStack space='$2' alignItems='center'>
                <Text fontSize='$2' color='$gray11'>
                  Role: {member.role?.name || 'No Role'}
                </Text>
                {isOwner && (
                  <Text fontSize='$2' color='$blue10' fontWeight='600'>
                    (Owner)
                  </Text>
                )}
              </XStack>
              <Text fontSize='$2' color='$gray11'>
                Joined: {new Date(member.joinedAt).toLocaleDateString()}
              </Text>
            </YStack>

            <XStack space='$2'>
              {!isOwner && (
                <Button
                  size='$2'
                  variant='outlined'
                  onPress={() => onChangeRole(member)}
                >
                  Change Role
                </Button>
              )}
              {!isCurrentUser && !isOwner && (
                <Button
                  size='$2'
                  backgroundColor='$red10'
                  color='white'
                  onPress={() => onRemove(member.userId)}
                >
                  Remove
                </Button>
              )}
            </XStack>
          </XStack>

          <XStack justifyContent='space-between' alignItems='center'>
            <Text fontSize='$2' color={member.isActive ? '$green10' : '$red10'}>
              {member.isActive ? 'Active' : 'Inactive'}
            </Text>
            <Text fontSize='$2' color='$gray11'>
              ID: {member.id}
            </Text>
          </XStack>
        </YStack>
      </Card.Header>
    </Card>
  );
}

export default function OrganizationMembersScreen() {
  const { organization, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] =
    useState<OrganizationMemberFragment | null>(null);
  const [showRoleSheet, setShowRoleSheet] = useState(false);

  const { data, loading, refetch } = useGetOrganizationQuery({
    variables: { id: organization?.id || '' },
    skip: !organization?.id,
  });

  const { data: rolesData } = useGetOrganizationRolesQuery({
    variables: { organizationId: organization?.id || '' },
    skip: !organization?.id,
  });

  const [removeUser, { loading: removing }] =
    useRemoveUserFromOrganizationMutation();
  const [assignRole, { loading: assigning }] = useAssignRoleMutation();

  const members = data?.organization?.organizationUsers || [];
  const roles = rolesData?.roles || [];

  const filteredMembers = members.filter(
    member =>
      member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveMember = async (userId: string) => {
    if (!organization?.id) return;

    Alert.alert(
      'Remove Member',
      'Are you sure you want to remove this member from the organization?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeUser({
                variables: {
                  organizationId: organization.id,
                  userId,
                },
              });
              Alert.alert('Success', 'Member removed successfully');
              refetch();
            } catch (error) {
              console.error('Remove member error:', error);
              Alert.alert('Error', 'Failed to remove member');
            }
          },
        },
      ]
    );
  };

  const handleChangeRole = (member: OrganizationMemberFragment) => {
    setSelectedMember(member);
    setShowRoleSheet(true);
  };

  const handleAssignRole = async (roleId: string) => {
    if (!organization?.id || !selectedMember) return;

    try {
      await assignRole({
        variables: {
          organizationId: organization.id,
          userId: selectedMember.userId,
          roleId,
        },
      });
      Alert.alert('Success', 'Role assigned successfully');
      setShowRoleSheet(false);
      setSelectedMember(null);
      refetch();
    } catch (error) {
      console.error('Assign role error:', error);
      Alert.alert('Error', 'Failed to assign role');
    }
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

  return (
    <AuthGuard>
      <View flex={1} backgroundColor='$background'>
        <YStack flex={1} padding='$4' space='$4'>
          {/* Header */}
          <YStack space='$2'>
            <XStack justifyContent='space-between' alignItems='center'>
              <Text fontSize='$7' fontWeight='bold' color='$color'>
                Organization Members
              </Text>
              <Button
                size='$3'
                variant='outlined'
                onPress={() => router.push('/organization/invite')}
              >
                Invite Member
              </Button>
            </XStack>
            <Text fontSize='$4' color='$gray10'>
              Manage organization members and their roles
            </Text>
          </YStack>

          {/* Search */}
          <Input
            placeholder='Search members by name or email...'
            value={searchQuery}
            onChangeText={setSearchQuery}
            size='$4'
          />

          {/* Stats */}
          <Card elevate size='$3' bordered>
            <Card.Header padded>
              <XStack justifyContent='space-around'>
                <YStack alignItems='center'>
                  <Text fontSize='$6' fontWeight='bold' color='$blue10'>
                    {members.length}
                  </Text>
                  <Text fontSize='$3' color='$gray10'>
                    Total Members
                  </Text>
                </YStack>
                <Separator vertical />
                <YStack alignItems='center'>
                  <Text fontSize='$6' fontWeight='bold' color='$green10'>
                    {members.filter(m => m.isActive).length}
                  </Text>
                  <Text fontSize='$3' color='$gray10'>
                    Active Members
                  </Text>
                </YStack>
                <Separator vertical />
                <YStack alignItems='center'>
                  <Text fontSize='$6' fontWeight='bold' color='$orange10'>
                    {members.filter(m => m.isOwner).length}
                  </Text>
                  <Text fontSize='$3' color='$gray10'>
                    Owners
                  </Text>
                </YStack>
              </XStack>
            </Card.Header>
          </Card>

          {/* Members List */}
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <YStack space='$3'>
              {filteredMembers.map(member => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onRemove={handleRemoveMember}
                  onChangeRole={handleChangeRole}
                  currentUserId={user?.id}
                />
              ))}

              {filteredMembers.length === 0 && (
                <Card elevate size='$4' bordered>
                  <Card.Header padded>
                    <YStack alignItems='center' space='$3'>
                      <Text fontSize='$5' color='$gray10'>
                        No members found
                      </Text>
                      <Text fontSize='$3' color='$gray11' textAlign='center'>
                        {searchQuery
                          ? 'Try adjusting your search criteria'
                          : 'Invite members to get started'}
                      </Text>
                    </YStack>
                  </Card.Header>
                </Card>
              )}
            </YStack>
          </ScrollView>
        </YStack>

        {/* Role Assignment Sheet */}
        <Sheet
          modal
          open={showRoleSheet}
          onOpenChange={setShowRoleSheet}
          snapPoints={[50]}
          dismissOnSnapToBottom
        >
          <Sheet.Overlay />
          <Sheet.Handle />
          <Sheet.Frame padding='$4'>
            <YStack space='$4'>
              <Text fontSize='$5' fontWeight='bold' color='$color'>
                Assign Role to {selectedMember?.user.name}
              </Text>

              <YStack space='$3'>
                {roles.map(role => (
                  <Button
                    key={role.id}
                    size='$4'
                    variant={
                      selectedMember?.roleId === role.id ? 'outlined' : 'ghost'
                    }
                    onPress={() => handleAssignRole(role.id)}
                    disabled={assigning}
                    justifyContent='flex-start'
                  >
                    <YStack alignItems='flex-start'>
                      <Text fontSize='$4' fontWeight='600'>
                        {role.name}
                      </Text>
                      {role.description && (
                        <Text fontSize='$3' color='$gray10'>
                          {role.description}
                        </Text>
                      )}
                    </YStack>
                  </Button>
                ))}
              </YStack>

              <Button
                size='$4'
                variant='outlined'
                onPress={() => setShowRoleSheet(false)}
              >
                Cancel
              </Button>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </View>
    </AuthGuard>
  );
}
