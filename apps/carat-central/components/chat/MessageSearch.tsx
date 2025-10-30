import React, { useState, useCallback, useMemo } from 'react';
import { FlatList } from 'react-native';
import { 
  YStack, 
  XStack, 
  Text, 
  Input,
  Button,
  Card,
  Separator,
  Spinner,
  H6,
} from 'tamagui';
import { Search, X, ArrowUp, ArrowDown, MessageCircle } from '@tamagui/lucide-icons';
import { useMessageSearch } from '../../hooks/useMessageManagement';
import type { Chat_MessageFragment } from '../../src/graphql/chats/chats.generated';

interface MessageSearchProps {
  chatId: string;
  messages: Chat_MessageFragment[];
  onMessageSelect?: (message: Chat_MessageFragment) => void;
  onClose?: () => void;
  visible?: boolean;
}

interface SearchResultItemProps {
  message: Chat_MessageFragment;
  searchQuery: string;
  onPress: (message: Chat_MessageFragment) => void;
}

function SearchResultItem({ message, searchQuery, onPress }: SearchResultItemProps) {
  // Highlight search terms in message content
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => (
      <Text
        key={index}
        color={regex.test(part) ? '$blue10' : '$color'}
        fontWeight={regex.test(part) ? '600' : '400'}
      >
        {part}
      </Text>
    ));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePress = () => {
    onPress(message);
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
    >
      <YStack space="$2">
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize="$3" fontWeight="600" color="$color">
            {message.senderId}
          </Text>
          <Text fontSize="$2" color="$color">
            {formatTime(message.createdAt)}
          </Text>
        </XStack>
        
        <Text fontSize="$4" color="$color" numberOfLines={3}>
          {message.content ? 
            highlightText(message.content, searchQuery) : 
            <Text fontStyle="italic" color="$color">Attachment</Text>
          }
        </Text>
      </YStack>
    </Card>
  );
}

export function MessageSearch({ 
  chatId, 
  messages, 
  onMessageSelect, 
  onClose, 
  visible = true 
}: MessageSearchProps) {
  const [localQuery, setLocalQuery] = useState('');
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  // Filter messages based on search query
  const searchResults = useMemo(() => {
    if (!localQuery.trim()) return [];
    
    const query = localQuery.toLowerCase();
    return messages.filter(message => 
      message.content?.toLowerCase().includes(query) ||
      message.senderId.toLowerCase().includes(query)
    ).reverse(); // Show newest first
  }, [messages, localQuery]);

  const handleSearch = useCallback((query: string) => {
    setLocalQuery(query);
    setCurrentResultIndex(0);
  }, []);

  const handleClear = useCallback(() => {
    setLocalQuery('');
    setCurrentResultIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    handleClear();
    if (onClose) {
      onClose();
    }
  }, [handleClear, onClose]);

  const handleMessageSelect = useCallback((message: Chat_MessageFragment) => {
    if (onMessageSelect) {
      onMessageSelect(message);
    }
  }, [onMessageSelect]);

  const handlePreviousResult = useCallback(() => {
    setCurrentResultIndex(prev => 
      prev > 0 ? prev - 1 : searchResults.length - 1
    );
  }, [searchResults.length]);

  const handleNextResult = useCallback(() => {
    setCurrentResultIndex(prev => 
      prev < searchResults.length - 1 ? prev + 1 : 0
    );
  }, [searchResults.length]);

  const renderSearchResult = useCallback(({ item }: { item: Chat_MessageFragment }) => (
    <SearchResultItem
      message={item}
      searchQuery={localQuery}
      onPress={handleMessageSelect}
    />
  ), [localQuery, handleMessageSelect]);

  const renderEmptyState = () => (
    <YStack alignItems="center" justifyContent="center" padding="$6" space="$4">
      <MessageCircle size={48} color="$color" />
      <YStack alignItems="center" space="$2">
        <H6 color="$color">
          {localQuery.trim() ? 'No messages found' : 'Search messages'}
        </H6>
        <Text color="$color" textAlign="center" fontSize="$3">
          {localQuery.trim() ? 
            'Try different keywords or check spelling' :
            'Enter keywords to search through chat history'
          }
        </Text>
      </YStack>
    </YStack>
  );

  if (!visible) return null;

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Search Header */}
      <XStack 
        padding="$3" 
        space="$2" 
        alignItems="center"
        backgroundColor="$background"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Input
          flex={1}
          placeholder="Search in this chat..."
          value={localQuery}
          onChangeText={handleSearch}
          size="$4"
          autoFocus
        />
        
        {localQuery.trim() && (
          <Button size="$3" circular icon={X} onPress={handleClear} chromeless />
        )}
        
        <Button size="$3" circular icon={X} onPress={handleClose} chromeless />
      </XStack>

      {/* Search Results Navigation */}
      {searchResults.length > 0 && (
        <XStack 
          padding="$3" 
          alignItems="center" 
          justifyContent="space-between"
          backgroundColor="$gray2"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <Text fontSize="$3" color="$color">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            {searchResults.length > 1 && ` (${currentResultIndex + 1} of ${searchResults.length})`}
          </Text>
          
          {searchResults.length > 1 && (
            <XStack space="$2">
              <Button 
                size="$3" 
                circular 
                icon={ArrowUp} 
                onPress={handlePreviousResult}
                chromeless
              />
              <Button 
                size="$3" 
                circular 
                icon={ArrowDown} 
                onPress={handleNextResult}
                chromeless
              />
            </XStack>
          )}
        </XStack>
      )}

      {/* Search Results */}
      <YStack flex={1}>
        {searchResults.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <Separator marginHorizontal="$3" />}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            initialScrollIndex={currentResultIndex}
            getItemLayout={(data, index) => ({
              length: 80, // Approximate item height
              offset: 80 * index,
              index,
            })}
          />
        )}
      </YStack>
    </YStack>
  );
}

// Compact search bar that can be embedded in chat screens
interface CompactMessageSearchProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
  value?: string;
}

export function CompactMessageSearch({ 
  onSearch, 
  onClear, 
  placeholder = "Search messages...",
  value = ""
}: CompactMessageSearchProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = useCallback((text: string) => {
    setLocalValue(text);
    onSearch(text);
  }, [onSearch]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    onClear();
  }, [onClear]);

  return (
    <XStack space="$2" alignItems="center" padding="$2">
      <Input
        flex={1}
        placeholder={placeholder}
        value={localValue}
        onChangeText={handleChange}
        size="$3"
      />
      
      {localValue.trim() && (
        <Button size="$3" circular icon={X} onPress={handleClear} chromeless />
      )}
      
      <Button size="$3" circular icon={Search} chromeless />
    </XStack>
  );
}