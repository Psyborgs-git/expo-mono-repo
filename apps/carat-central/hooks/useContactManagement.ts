import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

// Mock contact data - in a real app, this would come from GraphQL queries
export interface Contact {
  id: string;
  name: string;
  email?: string;
  mobile?: string;
  organizationId: string;
  organizationName: string;
  isOnline: boolean;
  lastSeen?: string;
  avatar?: string;
  role?: string;
  department?: string;
  isBlocked?: boolean;
  isFavorite?: boolean;
  tags?: string[];
}

export interface ContactGroup {
  id: string;
  name: string;
  description?: string;
  contacts: Contact[];
  isExpanded?: boolean;
}

// Mock data
const mockContacts: Contact[] = [
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
  {
    id: 'user3',
    name: 'Mike Wilson',
    email: 'mike@diamondcorp.com',
    mobile: '+1-555-0103',
    organizationId: 'org1',
    organizationName: 'Diamond Corp',
    isOnline: true,
    role: 'Appraiser',
    department: 'Quality Control',
    isFavorite: false,
    tags: ['expert', 'appraiser'],
  },
  {
    id: 'user4',
    name: 'Lisa Chen',
    email: 'lisa@preciousstones.com',
    mobile: '+1-555-0104',
    organizationId: 'org3',
    organizationName: 'Precious Stones Ltd',
    isOnline: false,
    lastSeen: '1 day ago',
    role: 'Director',
    department: 'Management',
    tags: ['management', 'decision-maker'],
  },
  {
    id: 'user5',
    name: 'David Brown',
    email: 'david@diamondcorp.com',
    mobile: '+1-555-0105',
    organizationId: 'org1',
    organizationName: 'Diamond Corp',
    isOnline: true,
    role: 'Trader',
    department: 'Trading',
    isBlocked: true,
    tags: ['blocked'],
  },
];

export interface ContactManagementOptions {
  enableGrouping?: boolean;
  enableSearch?: boolean;
  enableFavorites?: boolean;
  enableBlocking?: boolean;
}

export interface ContactManagementState {
  contacts: Contact[];
  filteredContacts: Contact[];
  contactGroups: ContactGroup[];
  searchQuery: string;
  selectedContacts: Set<string>;
  favoriteContacts: Contact[];
  blockedContacts: Contact[];
  isLoading: boolean;
  error: string | null;
}

export interface ContactManagementActions {
  searchContacts: (query: string) => void;
  clearSearch: () => void;
  selectContact: (contactId: string) => void;
  deselectContact: (contactId: string) => void;
  selectAllContacts: () => void;
  clearSelection: () => void;
  addToFavorites: (contactId: string) => void;
  removeFromFavorites: (contactId: string) => void;
  blockContact: (contactId: string) => void;
  unblockContact: (contactId: string) => void;
  inviteContact: (email: string, organizationId?: string) => Promise<void>;
  updateContact: (contactId: string, updates: Partial<Contact>) => void;
  deleteContact: (contactId: string) => void;
  createGroup: (name: string, contactIds: string[]) => void;
  addToGroup: (groupId: string, contactIds: string[]) => void;
  removeFromGroup: (groupId: string, contactIds: string[]) => void;
  toggleGroupExpansion: (groupId: string) => void;
  refreshContacts: () => Promise<void>;
}

export interface ContactManagement extends ContactManagementState, ContactManagementActions {}

export function useContactManagement(
  options: ContactManagementOptions = {}
): ContactManagement {
  const {
    enableGrouping = true,
    enableSearch = true,
    enableFavorites = true,
    enableBlocking = true,
  } = options;

  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!enableSearch || !searchQuery.trim()) {
      return contacts.filter(contact => !contact.isBlocked);
    }

    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => 
      !contact.isBlocked &&
      (contact.name.toLowerCase().includes(query) ||
       contact.email?.toLowerCase().includes(query) ||
       contact.organizationName.toLowerCase().includes(query) ||
       contact.role?.toLowerCase().includes(query) ||
       contact.department?.toLowerCase().includes(query) ||
       contact.tags?.some(tag => tag.toLowerCase().includes(query)))
    );
  }, [contacts, searchQuery, enableSearch]);

  // Get favorite contacts
  const favoriteContacts = useMemo(() => {
    if (!enableFavorites) return [];
    return contacts.filter(contact => contact.isFavorite && !contact.isBlocked);
  }, [contacts, enableFavorites]);

  // Get blocked contacts
  const blockedContacts = useMemo(() => {
    if (!enableBlocking) return [];
    return contacts.filter(contact => contact.isBlocked);
  }, [contacts, enableBlocking]);

  // Search contacts
  const searchContacts = useCallback((query: string) => {
    if (enableSearch) {
      setSearchQuery(query);
    }
  }, [enableSearch]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Contact selection
  const selectContact = useCallback((contactId: string) => {
    setSelectedContacts(prev => new Set(prev).add(contactId));
  }, []);

  const deselectContact = useCallback((contactId: string) => {
    setSelectedContacts(prev => {
      const newSet = new Set(prev);
      newSet.delete(contactId);
      return newSet;
    });
  }, []);

  const selectAllContacts = useCallback(() => {
    setSelectedContacts(new Set(filteredContacts.map(contact => contact.id)));
  }, [filteredContacts]);

  const clearSelection = useCallback(() => {
    setSelectedContacts(new Set());
  }, []);

  // Favorites management
  const addToFavorites = useCallback((contactId: string) => {
    if (!enableFavorites) return;
    
    setContacts(prev => prev.map(contact =>
      contact.id === contactId ? { ...contact, isFavorite: true } : contact
    ));
  }, [enableFavorites]);

  const removeFromFavorites = useCallback((contactId: string) => {
    if (!enableFavorites) return;
    
    setContacts(prev => prev.map(contact =>
      contact.id === contactId ? { ...contact, isFavorite: false } : contact
    ));
  }, [enableFavorites]);

  // Blocking management
  const blockContact = useCallback((contactId: string) => {
    if (!enableBlocking) return;

    Alert.alert(
      'Block Contact',
      'Are you sure you want to block this contact? They will not be able to send you messages.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            setContacts(prev => prev.map(contact =>
              contact.id === contactId ? { ...contact, isBlocked: true } : contact
            ));
          },
        },
      ]
    );
  }, [enableBlocking]);

  const unblockContact = useCallback((contactId: string) => {
    if (!enableBlocking) return;
    
    setContacts(prev => prev.map(contact =>
      contact.id === contactId ? { ...contact, isBlocked: false } : contact
    ));
  }, [enableBlocking]);

  // Contact invitation
  const inviteContact = useCallback(async (email: string, organizationId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be a GraphQL mutation
      Alert.alert('Invitation Sent', `Invitation sent to ${email}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send invitation';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update contact
  const updateContact = useCallback((contactId: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(contact =>
      contact.id === contactId ? { ...contact, ...updates } : contact
    ));
  }, []);

  // Delete contact
  const deleteContact = useCallback((contactId: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to remove this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setContacts(prev => prev.filter(contact => contact.id !== contactId));
            deselectContact(contactId);
          },
        },
      ]
    );
  }, [deselectContact]);

  // Group management
  const createGroup = useCallback((name: string, contactIds: string[]) => {
    if (!enableGrouping) return;

    const newGroup: ContactGroup = {
      id: `group-${Date.now()}`,
      name,
      contacts: contacts.filter(contact => contactIds.includes(contact.id)),
      isExpanded: true,
    };

    setContactGroups(prev => [...prev, newGroup]);
  }, [enableGrouping, contacts]);

  const addToGroup = useCallback((groupId: string, contactIds: string[]) => {
    if (!enableGrouping) return;

    setContactGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const newContacts = contacts.filter(contact => 
          contactIds.includes(contact.id) && 
          !group.contacts.some(gc => gc.id === contact.id)
        );
        return {
          ...group,
          contacts: [...group.contacts, ...newContacts],
        };
      }
      return group;
    }));
  }, [enableGrouping, contacts]);

  const removeFromGroup = useCallback((groupId: string, contactIds: string[]) => {
    if (!enableGrouping) return;

    setContactGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          contacts: group.contacts.filter(contact => !contactIds.includes(contact.id)),
        };
      }
      return group;
    }));
  }, [enableGrouping]);

  const toggleGroupExpansion = useCallback((groupId: string) => {
    if (!enableGrouping) return;

    setContactGroups(prev => prev.map(group =>
      group.id === groupId ? { ...group, isExpanded: !group.isExpanded } : group
    ));
  }, [enableGrouping]);

  // Refresh contacts
  const refreshContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would refetch from GraphQL
      setContacts(mockContacts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh contacts';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    contacts,
    filteredContacts,
    contactGroups,
    searchQuery,
    selectedContacts,
    favoriteContacts,
    blockedContacts,
    isLoading,
    error,

    // Actions
    searchContacts,
    clearSearch,
    selectContact,
    deselectContact,
    selectAllContacts,
    clearSelection,
    addToFavorites,
    removeFromFavorites,
    blockContact,
    unblockContact,
    inviteContact,
    updateContact,
    deleteContact,
    createGroup,
    addToGroup,
    removeFromGroup,
    toggleGroupExpansion,
    refreshContacts,
  };
}