import React, { useState, useCallback } from 'react';
import { ScrollView, Alert, Linking } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { 
  YStack, 
  XStack, 
  Text, 
  Button,
  Card,
  Avatar,
  Separator,
  H4,
  H6,
  Badge,
} from 'tamagui';
import { 
  ArrowLeft, 
  MessageCircle, 
  Phone, 
  Mail, 
  Building, 
  User,
  Star,
  Block,
  MoreVertical,
  Shield,
  Calendar,
  MapPin,
} from '@tamagui/lucide-icons';
import { useCreateChatMutation } from '../../../src/graphql/chats/chats.generated';
import { useAuth } from '../../../contexts/AuthContext';
import { useContactManagement, type Contact } from '../../../hooks/useContactManagement';

// Mock function to get contact by ID
const getContactById = (userId: string): Contact | null => {
  const mockContacts = [
    {
      id: 'user1',
      name: 'John Smith',
      email: 'john@diamondcorp.com',
      mobile: '+1-555-0101',
      organizationId: 'org1',
      organizationName: 'Diamond Corp',
      isOnline: true,
      role: 'Sales Manager',
      department: 'Sales',
      isFavorite: true,
      tags: ['vip', 'sales'],
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=John Smith',
    },
    {
      id: 'user2',
      name: 'Sarah Johnson',
      email: 'sarah@gemtraders.com',
      mobile: '+1-555-0102',
      organizationId: 'org2',
      organizationName: 'Gem Traders',
      isOnline: false,
      lastSeen: '2 hours ago',
      role: 'Buyer',
      department: 'Procurement',
      tags: ['buyer', 'regular'],
    },
  ];

  return mockContacts.find(contact => contact.id === userId) || null;
};

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <YStack space="$3" marginBottom="$4">
      <H6 color="$color" fontWeight="600" paddingHorizontal="$4">
        {title}
      </H6>
      <Card margin="$3" padding="$4" backgroundColor="$background">
        {children}
      </Card>
    </YStack>
  );
}

interface InfoRowProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  onPress?: () => void;
  showSeparator?: boolean;
}

function InfoRow({ icon: Icon, label, value, onPress, showSeparator = true }: InfoRowProps) {
  return (
    <>
      <XStack 
        alignItems="center" 
        space="$3" 
        paddingVertical="$3"
        pressStyle={onPress ? { opacity: 0.7 } : undefined}
        onPress={onPress}
      >
        <Icon size={20} color="$color" />
        <YStack flex={1} space="$1">
          <Text fontSize="$3" color="$color">
            {label}
          </Text>
          <Text fontSize="$4" color="$color" fontWeight="500">
            {value}
          </Text>
        </YStack>
      </XStack>
      {showSeparator && <Separator />}
    </>
  );
}

export default function ContactProfileScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user } = useAuth();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const {
    addToFavorites,
    removeFromFavorites,
    blockContact,
    unblockContact,
  } = useContactManagement();

  const [createChat] = useCreateChatMutation({
    onCompleted: (data) => {
      setIsCreatingChat(false);
      router.replace(`/chat/${data.createChat.id}`);
    },
    onError: (error) => {
      setIsCreatingChat(false);
      Alert.alert('Error', 'Failed to start chat. Please try again.');
      console.error('Create chat error:', error);
    },
  });

  const contact = getContactById(userId!);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleStartChat = useCallback(async () => {
    if (!contact || isCreatingChat) return;

    setIsCreatingChat(true);
    try {
      await createChat({
        variables: {
          participantIds: [contact.id],
          isGroup: false,
        },
      });
    } catch (error) {
      console.error('Failed to create chat:', error);
      setIsCreatingChat(false);
    }
  }, [contact, createChat, isCreatingChat]);

  const handleCall = useCallback(() => {
    if (!contact?.mobile) return;

    Alert.alert(
      'Call Contact',
      `Call ${contact.name} at ${contact.mobile}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${contact.mobile}`);
          },
        },
      ]
    );
  }, [contact]);

  const handleEmail = useCallback(() => {
    if (!contact?.email) return;

    Linking.openURL(`mailto:${contact.email}`);
  }, [contact]);

  const handleToggleFavorite = useCallback(() => {
    if (!contact) return;

    if (contact.isFavorite) {
      removeFromFavorites(contact.id);
    } else {
      addToFavorites(contact.id);
    }
  }, [contact, addToFavorites, removeFromFavorites]);

  const handleBlock = useCallback(() => {
    if (!contact) return;

    if (contact.isBlocked) {
      unblockContact(contact.id);
    } else {
      blockContact(contact.id);
    }
  }, [contact, blockContact, unblockContact]);

  const handleMoreOptions = useCallback(() => {
    if (!contact) return;

    const options = [
      'View Organization Profile',
      'Share Contact',
      'Export Contact',
    ];

    if (contact.isBlocked) {
      options.push('Unblock Contact');
    } else {
      options.push('Block Contact');
    }

    options.push('Cancel');

    Alert.alert(
      'Contact Options',
      `Options for ${contact.name}`,
      options.map((option, index) => ({
        text: option,
        style: option === 'Cancel' ? 'cancel' : 
               option.includes('Block') ? 'destructive' : 'default',
        onPress: () => {
          switch (option) {
            case 'View Organization Profile':
              router.push(`/profile/organization/${contact.organizationId}`);
              break;
            case 'Share Contact':
              Alert.alert('Share', 'Share contact feature coming soon!');
              break;
            case 'Export Contact':
              Alert.alert('Export', 'Export contact feature coming soon!');
              break;
            case 'Block Contact':
            case 'Unblock Contact':
              handleBlock();
              break;
          }
        },
      }))
    );
  }, [contact, router, handleBlock]);

  if (!contact) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" space="$4" padding="$4">
        <User size={64} color="$color" />
        <YStack alignItems="center" space="$2">
          <H4 color="$color">Contact not found</H4>
          <Text color="$color" textAlign="center">
            The contact you're looking for doesn't exist or has been removed.
          </Text>
        </YStack>
        <Button onPress={handleBack} backgroundColor="$primary">
          Go Back
        </Button>
      </YStack>
    );
  }

  const isOwnProfile = contact.id === user?.id;

  return (
    <YStack flex={1} backgroundColor="$background">
      <Stack.Screen 
        options={{
          title: contact.name,
          headerLeft: () => (
            <Button 
              size="$3" 
              circular 
              icon={ArrowLeft} 
              onPress={handleBack}
              chromeless
            />
          ),
          headerRight: () => (
            <Button 
              size="$3" 
              circular 
              icon={MoreVertical} 
              onPress={handleMoreOptions}
              chromeless
            />
          ),
        }} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <YStack alignItems="center" padding="$6" space="$4">
          <YStack alignItems="center" space="$3">
            <Avatar circular size="$10">
              <Avatar.Image source={{ uri: contact.avatar }} />
              <Avatar.Fallback backgroundColor="$blue10">
                <Text color="white" fontSize="$8" fontWeight="600">
                  {contact.name.charAt(0).toUpperCase()}
                </Text>
              </Avatar.Fallback>
            </Avatar>

            {/* Online status indicator */}
            <YStack
              position="absolute"
              bottom={10}
              right={10}
              width={24}
              height={24}
              borderRadius={12}
              backgroundColor={contact.isOnline ? '$green10' : '$gray8'}
              borderWidth={3}
              borderColor="$background"
            />
          </YStack>

          <YStack alignItems="center" space="$2">
            <XStack alignItems="center" space="$2">
              <H4 color="$color" textAlign="center">
                {contact.name}
              </H4>
              {contact.isFavorite && (
                <Star size={20} color="$yellow10" fill="$yellow10" />
              )}
            </XStack>

            <Text fontSize="$4" color="$color" textAlign="center">
              {contact.role} • {contact.organizationName}
            </Text>

            <Text fontSize="$3" color={contact.isOnline ? '$green11' : '$color11'}>
              {contact.isOnline ? 'Online' : contact.lastSeen || 'Offline'}
            </Text>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
              <XStack space="$2" flexWrap="wrap" justifyContent="center">
                {contact.tags.map(tag => (
                  <Badge key={tag} size="$2" backgroundColor="$blue5" color="$blue11">
                    {tag}
                  </Badge>
                ))}
              </XStack>
            )}
          </YStack>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <XStack space="$3">
              <Button
                size="$4"
                backgroundColor="$primary"
                icon={MessageCircle}
                onPress={handleStartChat}
                disabled={isCreatingChat || contact.isBlocked}
                flex={1}
              >
                {isCreatingChat ? 'Starting...' : 'Message'}
              </Button>

              {contact.mobile && (
                <Button
                  size="$4"
                  icon={Phone}
                  onPress={handleCall}
                  disabled={contact.isBlocked}
                  chromeless
                />
              )}

              <Button
                size="$4"
                icon={Star}
                onPress={handleToggleFavorite}
                color={contact.isFavorite ? '$yellow10' : '$color11'}
                chromeless
              />
            </XStack>
          )}

          {contact.isBlocked && (
            <XStack alignItems="center" space="$2" padding="$3" backgroundColor="$red2" borderRadius="$4">
              <Block size={16} color="$red10" />
              <Text fontSize="$3" color="$red10" fontWeight="500">
                This contact is blocked
              </Text>
            </XStack>
          )}
        </YStack>

        {/* Contact Information */}
        <ProfileSection title="Contact Information">
          <YStack>
            {contact.email && (
              <InfoRow
                icon={Mail}
                label="Email"
                value={contact.email}
                onPress={handleEmail}
              />
            )}

            {contact.mobile && (
              <InfoRow
                icon={Phone}
                label="Phone"
                value={contact.mobile}
                onPress={handleCall}
              />
            )}

            <InfoRow
              icon={Building}
              label="Organization"
              value={contact.organizationName}
              onPress={() => router.push(`/profile/organization/${contact.organizationId}`)}
              showSeparator={false}
            />
          </YStack>
        </ProfileSection>

        {/* Professional Information */}
        <ProfileSection title="Professional Information">
          <YStack>
            <InfoRow
              icon={User}
              label="Role"
              value={contact.role || 'Not specified'}
            />

            <InfoRow
              icon={Building}
              label="Department"
              value={contact.department || 'Not specified'}
              showSeparator={false}
            />
          </YStack>
        </ProfileSection>

        {/* Activity Status */}
        <ProfileSection title="Activity">
          <YStack>
            <InfoRow
              icon={Calendar}
              label="Status"
              value={contact.isOnline ? 'Online now' : contact.lastSeen || 'Last seen unknown'}
              showSeparator={false}
            />
          </YStack>
        </ProfileSection>

        {/* Security Actions */}
        {!isOwnProfile && (
          <ProfileSection title="Privacy & Security">
            <YStack>
              <XStack 
                alignItems="center" 
                space="$3" 
                paddingVertical="$3"
                pressStyle={{ opacity: 0.7 }}
                onPress={handleBlock}
              >
                <Block size={20} color={contact.isBlocked ? '$green10' : '$red10'} />
                <Text 
                  fontSize="$4" 
                  color={contact.isBlocked ? '$green10' : '$red10'} 
                  fontWeight="500"
                >
                  {contact.isBlocked ? 'Unblock Contact' : 'Block Contact'}
                </Text>
              </XStack>
            </YStack>
          </ProfileSection>
        )}

        {/* Bottom spacing */}
        <YStack height="$6" />
      </ScrollView>
    </YStack>
  );
}