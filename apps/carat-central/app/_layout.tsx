import { useEffect } from 'react';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { TamaguiProvider } from 'tamagui';
import { useFonts } from 'expo-font';
import tamaguiConfig from '../tamagui.config';
import { AuthProvider } from '../contexts/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete
// Call this at module scope (without awaiting) as recommended by the docs so
// the native splash stays visible until we explicitly hide it after assets load.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

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
    <TamaguiProvider config={tamaguiConfig}>
      <AuthProvider graphqlEndpoint='http://jae.local:8003/graphql'>
        <Slot />
      </AuthProvider>
    </TamaguiProvider>
  );
}
