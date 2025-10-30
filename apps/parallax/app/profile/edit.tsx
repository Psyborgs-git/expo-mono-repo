import { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { YStack, XStack, Text, Input, Button, Card, TextArea } from 'tamagui';
import { Stack, useRouter } from 'expo-router';
import { Wand2, Save } from '@tamagui/lucide-icons';
import { api } from '../../src/lib/api';
import { generateBio } from '../../src/lib/ai';
import { User, BioTone } from '../../src/lib/types';

export default function EditProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bioSuggestions, setBioSuggestions] = useState<string[]>([]);
  const router = useRouter();

  const loadUser = async () => {
    try {
      const data = await api.getCurrentUser();
      setUser(data);
      setName(data.name);
      setBio(data.bio);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleGenerateBio = async (tone: BioTone = 'sincere') => {
    if (!user) return;

    setIsGenerating(true);
    try {
      const suggestions = await generateBio(user.traits, tone);
      setBioSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to generate bio:', error);
      Alert.alert('Error', 'Failed to generate bio suggestions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setBio(suggestion);
    setBioSuggestions([]);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await api.updateProfile(user.id, {
        name,
        bio,
      });
      
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Text>Loading profile...</Text>
      </YStack>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Profile',
          headerShown: true,
        }}
      />

      <ScrollView style={{ flex: 1, backgroundColor: '$background' }}>
        <YStack padding="$4" space="$4">
          {/* Name */}
          <YStack space="$2">
            <Text fontSize="$4" fontWeight="600">
              Name
            </Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              fontSize="$4"
              backgroundColor="white"
              borderColor="$gray5"
            />
          </YStack>

          {/* Age (read-only for now) */}
          <YStack space="$2">
            <Text fontSize="$4" fontWeight="600">
              Age
            </Text>
            <Input
              value={String(user.age)}
              editable={false}
              fontSize="$4"
              backgroundColor="$gray2"
              borderColor="$gray5"
              color="$gray10"
            />
          </YStack>

          {/* Bio with AI */}
          <YStack space="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$4" fontWeight="600">
                Bio
              </Text>
              <Button
                size="$2"
                icon={<Wand2 size={16} />}
                onPress={() => handleGenerateBio('sincere')}
                backgroundColor="$purple10"
                color="white"
                disabled={isGenerating}
                pressStyle={{ opacity: 0.8 }}
              >
                {isGenerating ? 'Generating...' : 'AI Generate'}
              </Button>
            </XStack>
            
            <TextArea
              value={bio}
              onChangeText={setBio}
              placeholder="Tell others about yourself..."
              fontSize="$4"
              backgroundColor="white"
              borderColor="$gray5"
              minHeight={100}
              numberOfLines={4}
            />
          </YStack>

          {/* AI Bio Suggestions */}
          {bioSuggestions.length > 0 && (
            <YStack space="$2">
              <Text fontSize="$4" fontWeight="600">
                AI Suggestions (tap to use)
              </Text>
              {bioSuggestions.map((suggestion, index) => (
                <Card
                  key={index}
                  bordered
                  padding="$3"
                  backgroundColor="$purple1"
                  borderColor="$purple5"
                  onPress={() => handleSelectSuggestion(suggestion)}
                  pressStyle={{ opacity: 0.7 }}
                >
                  <Text fontSize="$3">{suggestion}</Text>
                </Card>
              ))}
              
              {/* Tone Options */}
              <XStack space="$2" marginTop="$2">
                <Button
                  size="$2"
                  onPress={() => handleGenerateBio('witty')}
                  backgroundColor="$blue10"
                  color="white"
                  flex={1}
                >
                  Witty
                </Button>
                <Button
                  size="$2"
                  onPress={() => handleGenerateBio('sincere')}
                  backgroundColor="$green10"
                  color="white"
                  flex={1}
                >
                  Sincere
                </Button>
                <Button
                  size="$2"
                  onPress={() => handleGenerateBio('short')}
                  backgroundColor="$orange10"
                  color="white"
                  flex={1}
                >
                  Short
                </Button>
              </XStack>
            </YStack>
          )}

          {/* Traits */}
          <YStack space="$2">
            <Text fontSize="$4" fontWeight="600">
              Traits
            </Text>
            <XStack space="$2" flexWrap="wrap">
              {user.traits.map((trait) => (
                <Card
                  key={trait}
                  backgroundColor="$pink2"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$4"
                  marginBottom="$2"
                >
                  <Text color="$pink10" fontSize="$3">
                    {trait}
                  </Text>
                </Card>
              ))}
            </XStack>
          </YStack>

          {/* Save Button */}
          <Button
            icon={<Save size={20} />}
            onPress={handleSave}
            backgroundColor="$pink10"
            color="white"
            size="$5"
            disabled={isSaving}
            pressStyle={{ opacity: 0.8 }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>

          {/* Bottom Padding */}
          <YStack height={40} />
        </YStack>
      </ScrollView>
    </>
  );
}
