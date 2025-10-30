import React, { useState, useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { 
  YStack, 
  XStack, 
  Text, 
  Button, 
  Input,
  Card,
  Avatar,
  Separator,
  Spinner,
  H4,
  H6,
  Badge,
} from 'tamagui';
import { 
  Search, 
  MessageCircle, 
  ArrowLeft, 
  Users, 
  User, 
  Star,
  Plus,
  Filter,
} from '@tamagui/lucide-icons';
import { useCreateChatMutation } from '../../src/graphql/chats/chats.generated';
import { useAuth } from '../../contexts/AuthContext';
import { useContactManagement, type Contact } from '../../hooks/useContactManagement';



interface ContactListItemProps {
  contact: Contact;
  onPress: (contact: Contact) => void;
  onProfilePress: (contact: Contact) => void;
  onFavoritePress: (contact: Contact) => void;
  isLoading?: boolean;
}

function ContactListItem({ 
  contact, 
  onPress, 
  onProfilePress, 
  onFavoritePress, 
  isLoading 
}: ContactListItemProps) {
  const handlePress = () => {
    if (!isLoading) {
      onPress(contact);
    }
  };

  return (
    <Card
      pressStyle={{ scale: 0.98 }}
      onPress={handlePress}
      padding="$3"
      marginHorizontal="$3"
      marginVertical="$1"
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColor"
      opacity={isLoading ? 0.6 : 1}
    >
      <XStack alignItems="center" space="$3">
        {/* Avatar with online status */}
        <YStack>
          <Avatar circular size="$5">
            <Avatar.Image 
              source={{ 
                uri: `https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}` 
              }} 
            />
            <Avatar.Fallback backgroundColor="$blue10">
              <Text color="white" fontSize="$4" fontWeight="600">
                {contact.name.charAt(0).toUpperCase()}
              </Text>
            </Avatar.Fallback>
          </Avatar>
          
          {/* Online status indicator */}
          <YStack
            position="absolute"
            bottom={-2}
            right={-2}
            width={16}
            height={16}
            borderRadius={8}
            backgroundColor={contact.isOnline ? '$green10' : '$gray8'}
            borderWidth={2}
            borderColor="$background"
          />
        </YStack>

        {/* Contact Info */}
        <YStack flex={1} space="$1">
          <XStack alignItems="center" justifyContent="space-between">
            <XStack alignItems="center" space="$2" flex={1}>
              <Text 
                fontSize="$4" 
                fontWeight="600" 
                color="$color"
                numberOfLines={1}
                flex={1}
                onPress={() => onProfilePress(contact)}
              >
                {contact.name}
              </Text>
              
              {contact.isFavorite && (
                <Star size={16} color="$yellow10" fill="$yellow10" />
              )}
            </XStack>
            
            {isLoading && <Spinner size="small" color="$blue10" />}
          </XStack>

          <Text 
            fontSize="$3" 
            color="$color" 
            numberOfLines={1}
          >
            {contact.email}
          </Text>

          <XStack alignItems="center" space="$2" flexWrap="wrap">
            <Text fontSize="$2" color="$color">
              {contact.role} • {contact.organizationName}
            </Text>
            <Text fontSize="$2" color={contact.isOnline ? '$green11' : '$color11'}>
              {contact.isOnline ? 'Online' : contact.lastSeen || 'Offline'}
            </Text>
          </XStack>

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <XStack space="$1" flexWrap="wrap">
              {contact.tags.slice(0, 3).map(tag => (
                <Badge key={tag} size="$1" backgroundColor="$blue5" color="$blue11">
                  {tag}
                </Badge>
              ))}
              {contact.tags.length > 3 && (
                <Badge size="$1" backgroundColor="$gray5" color="$gray11">
                  +{contact.tags.length - 3}
                </Badge>
              )}
            </XStack>
          )}
        </YStack>

        {/* Action buttons */}
        <XStack space="$2">
          <Button
            size="$3"
            circular
            icon={Star}
            onPress={() => onFavoritePress(contact)}
            color={contact.isFavorite ? '$yellow10' : '$color11'}
            chromeless
          />
          
          <Button
            size="$3"
            circular
            icon={MessageCircle}
            backgroundColor="$primary"
            disabled={isLoading}
          />
        </XStack>
      </XStack>
    </Card>
  );
}

export default function ContactsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loadingContactId, setLoadingContactId] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const {
    filteredContacts,
    favoriteContacts,
    searchQuery,
    searchContacts,
    clearSearch,
    addToFavorites,
    removeFromFavorites,
    refreshContacts,
    isLoading,
  } = useContactManagement();

  const [createChat] = useCreateChatMutation({
    onCompleted: (data) => {
      setLoadingContactId(null);
      // Navigate to the new chat
      router.replace(`/chat/${data.createChat.id}`);
    },
    onError: (error) => {
      setLoadingContactId(null);
      console.error('Failed to create chat:', error);
      // TODO: Show error toast
    },
  });

  // Get contacts to display based on filter
  const contactsToShow = useMemo(() => {
    const contacts = showFavoritesOnly ? favoriteContacts : filteredContacts;
    return contacts.filter(contact => contact.id !== user?.id);
  }, [showFavoritesOnly, favoriteContacts, filteredContacts, user?.id]);

  // Group contacts by organization
  const groupedContacts = useMemo(() => {
    const groups: { [key: string]: Contact[] } = {};
    
    filteredContacts.forEach(contact => {
      if (!groups[contact.organizationName]) {
        groups[contact.organizationName] = [];
      }
      groups[contact.organizationName].push(contact);
    });

    return Object.entries(groups).map(([orgName, contacts]) => ({
      organizationName: orgName,
      contacts: contacts.sort((a, b) => {
        // Sort by online status first, then by name
        if (a.isOnline !== b.isOnline) {
          return a.isOnline ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      }),
    }));
  }, [filteredContacts]);

  const handleContactPress = useCallback(async (contact: Contact) => {
    setLoadingContactId(contact.id);
    
    try {
      await createChat({
        variables: {
          participantIds: [contact.id],
          isGroup: false,
        },
      });
    } catch (error) {
      console.error('Failed to create chat:', error);
      setLoadingContactId(null);
    }
  }, [createChat]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const renderSectionHeader = ({ section }: { section: { organizationName: string } }) => (
    <XStack 
      padding="$3" 
      paddingBottom="$2"
      alignItems="center" 
      space="$2"
      backgroundColor="$background"
    >
      <Users size={16} color="$color" />
      <H6 color="$color" fontWeight="600">
        {section.organizationName}
      </H6>
    </XStack>
  );

  const renderContactItem = useCallback(({ item }: { item: Contact }) => (
    <ContactListItem 
      contact={item} 
      onPress={handleContactPress}
      isLoading={loadingContactId === item.id}
    />
  ), [handleContactPress, loadingContactId]);

  const renderEmptyState = () => (
    <YStack alignItems="center" justifyContent="center" padding="$6" space="$4">
      <User size={64} color="$color" />
      <YStack alignItems="center" space="$2">
        <H4 color="$color">No contacts found</H4>
        <Text color="$color" textAlign="center">
          {searchQuery ? 
            'Try adjusting your search terms' : 
            'No contacts available at the moment'
          }
        </Text>
      </YStack>
    </YStack>
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      <Stack.Screen 
        options={{
          title: 'New Chat',
          headerLeft: () => (
            <Button 
              size="$3" 
              circular 
              icon={ArrowLeft} 
              onPress={handleBack}
              chromeless
            />
          ),
        }} 
      />
      
      {/* Search Bar */}
      <XStack padding="$3" space="$2">
        <Input
          flex={1}
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          size="$4"
        />
        <Button size="$4" icon={Search} chromeless />
      </XStack>

      {/* Contacts List */}
      <YStack flex={1}>
        {groupedContacts.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={groupedContacts.flatMap(group => [
              { type: 'header', organizationName: group.organizationName },
              ...group.contacts.map(contact => ({ type: 'contact', ...contact }))
            ])}
            renderItem={({ item }) => {
              if (item.type === 'header') {
                return renderSectionHeader({ section: { organizationName: item.organizationName } });
              }
              return renderContactItem({ item: item as Contact });
            }}
            keyExtractor={(item, index) => 
              item.type === 'header' ? `header-${item.organizationName}` : `contact-${item.id}`
            }
            ItemSeparatorComponent={() => <Separator marginHorizontal="$3" />}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </YStack>
    </YStack>
  );
}