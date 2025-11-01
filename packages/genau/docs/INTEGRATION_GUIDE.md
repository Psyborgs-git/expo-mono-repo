# Integrating Genau into an Expo App

This guide shows how to integrate the genau library into one of the monorepo apps (e.g., carat-central, vloop, or parallax).

## Step 1: Add Dependency

The genau package is already part of the workspace, so you can import it directly.

Update the app's `package.json`:

```json
{
  "dependencies": {
    "@bdt/genau": "workspace:*",
    // ... other dependencies
  }
}
```

Then run:
```bash
pnpm install
```

## Step 2: Configure Native Modules

### For iOS

1. Navigate to the app's `ios` directory:
```bash
cd apps/carat-central/ios
```

2. Update the Podfile to include genau:
```ruby
require File.join(File.dirname(`node --print "require.resolve('expo/package.json')"`), "scripts/autolinking")

platform :ios, '15.0'

target 'CaratCentral' do
  use_expo_modules!
  config = use_native_modules!
  
  # Add genau module
  pod 'Genau', :path => '../../../packages/genau'
  
  # ... rest of configuration
end
```

3. Install pods:
```bash
pod install
```

### For Android

The Expo autolinking should automatically detect and link the genau module. If needed, you can manually add to `android/settings.gradle`:

```gradle
include ':expo-modules-core'
project(':expo-modules-core').projectDir = new File(rootProject.projectDir, '../../node_modules/expo-modules-core/android')

// Add genau module
include ':genau'
project(':genau').projectDir = new File(rootProject.projectDir, '../../packages/genau/android')
```

## Step 3: Create a Chat Screen

Create a new screen in your app, for example `app/chat.tsx`:

```typescript
import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { YStack, XStack, Text, Input, Button } from 'tamagui';
import Genau, { GenauMessage, GenauConfig } from '@bdt/genau';

export default function ChatScreen() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [messages, setMessages] = useState<GenauMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeGenau();
  }, []);

  const initializeGenau = async () => {
    try {
      const config: GenauConfig = {
        // Choose model based on platform
        modelId: Platform.OS === 'ios' 
          ? 'mlx-community/Llama-3.2-1B-Instruct-4bit'
          : 'gemini-nano',
        maxTokens: 512,
        temperature: 0.7,
        topP: 0.9,
      };

      await Genau.initialize(config);
      setIsInitialized(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !isInitialized) return;

    const userMessage: GenauMessage = {
      role: 'user',
      content: input.trim(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await Genau.generate([...messages, userMessage]);
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.text,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
        <Text marginTop="$4">Initializing LLM...</Text>
        {error && <Text color="$red10" marginTop="$2">{error}</Text>}
      </YStack>
    );
  }

  return (
    <YStack flex={1} padding="$4" backgroundColor="$background">
      <Text fontSize="$8" fontWeight="bold" marginBottom="$4">
        AI Chat
      </Text>

      <ScrollView style={{ flex: 1 }}>
        {messages.map((message, index) => (
          <YStack
            key={index}
            padding="$3"
            marginBottom="$2"
            borderRadius="$4"
            backgroundColor={message.role === 'user' ? '$blue4' : '$gray4'}
          >
            <Text fontWeight="bold" marginBottom="$1">
              {message.role === 'user' ? 'You' : 'AI'}
            </Text>
            <Text>{message.content}</Text>
          </YStack>
        ))}
        
        {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
      </ScrollView>

      {error && (
        <YStack padding="$3" backgroundColor="$red4" borderRadius="$4" marginTop="$2">
          <Text color="$red11">{error}</Text>
        </YStack>
      )}

      <XStack gap="$2" marginTop="$4">
        <Input
          flex={1}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          disabled={loading}
        />
        <Button onPress={handleSend} disabled={loading || !input.trim()}>
          Send
        </Button>
      </XStack>
    </YStack>
  );
}
```

## Step 4: Add Route

Add the chat screen to your app's navigation. For Expo Router, create or update the route file:

```typescript
// app/(tabs)/chat.tsx
export { default } from '../../screens/ChatScreen';
```

## Step 5: Handle Permissions (Android)

For Android, ensure you have the necessary permissions in `app.config.ts` or `app.json`:

```typescript
export default {
  expo: {
    // ... other config
    plugins: [
      // ... other plugins
      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 24,
          },
        },
      ],
    ],
    android: {
      permissions: [
        // Required for Gemini Nano
        "android.permission.INTERNET",
      ],
    },
  },
};
```

## Step 6: Build and Run

### Development

```bash
# iOS
pnpm --filter @bdt/carat-central ios

# Android
pnpm --filter @bdt/carat-central android

# Web (will show "not supported" message)
pnpm --filter @bdt/carat-central web
```

### Production Build

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## Step 7: Test the Integration

1. Launch the app on a simulator/emulator or device
2. Navigate to the chat screen
3. Wait for initialization (you'll see a loading indicator)
4. Type a message and send it
5. You should see a response (currently a placeholder)

## Troubleshooting

### iOS

**Issue:** "Module not found: Genau"
- Solution: Run `pod install` in the ios directory

**Issue:** Build fails with Swift errors
- Solution: Ensure Xcode is up to date (15.0+)

### Android

**Issue:** "Package genau does not exist"
- Solution: Run `./gradlew clean` in the android directory

**Issue:** Gemini Nano not available
- Solution: Gemini Nano requires Android 12+ and specific device support

## Next Steps

Once the actual LLM implementations are added:

1. Download the appropriate model for your platform
2. Test with real inference
3. Optimize for performance
4. Add error handling for edge cases
5. Implement conversation persistence
6. Add UI for model selection and management

## Example with Model Download UI

```typescript
import { useState } from 'react';
import { Button, Progress, Text, YStack } from 'tamagui';
import Genau from '@bdt/genau';

export function ModelManager() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const subscription = Genau.on('modelDownloadProgress', (event) => {
      setProgress(event.data.progress);
    });

    return () => subscription.remove();
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await Genau.downloadModel('gemini-nano');
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <YStack gap="$2">
      {downloading ? (
        <>
          <Progress value={progress * 100} />
          <Text>Downloading: {Math.round(progress * 100)}%</Text>
        </>
      ) : (
        <Button onPress={handleDownload}>Download Model</Button>
      )}
    </YStack>
  );
}
```

## Resources

- [Genau README](../../packages/genau/README.md)
- [iOS Implementation Guide](../../packages/genau/docs/IOS_IMPLEMENTATION.md)
- [Android Implementation Guide](../../packages/genau/docs/ANDROID_IMPLEMENTATION.md)
- [Example Component](../../packages/genau/example/GenauExample.tsx)
