import { useEffect, useState } from 'react';
import { Slot, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { TamaguiProvider, Theme } from 'tamagui';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';
import tamaguiConfig from '../tamagui.config';
import '../tamagui-web.css';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    colorScheme || 'light'
  );

  const [loaded, error] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  // Auto-switch theme based on system appearance
  useEffect(() => {
    if (colorScheme) {
      setCurrentTheme(colorScheme);
    }
  }, [colorScheme]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={currentTheme}>
      <Theme name={currentTheme}>
        <Stack
          screenOptions={{
            headerBackVisible: true,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen options={{ headerShown: !true }} name='(tabs)' />
          <Stack.Screen options={{ headerShown: true }} name='chats' />
          <Stack.Screen options={{ headerShown: true }} name='videocall' />
          <Stack.Screen options={{ headerShown: true }} name='profile' />
        </Stack>
      </Theme>
    </TamaguiProvider>
  );
}
