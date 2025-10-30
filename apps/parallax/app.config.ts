import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Parallax',
  slug: 'parallax',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'parallax',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.bdt.parallax',
    infoPlist: {
      NSCameraUsageDescription: 'Parallax needs access to your camera to take profile photos and videos.',
      NSMicrophoneUsageDescription: 'Parallax needs access to your microphone for video calls.',
      NSPhotoLibraryUsageDescription: 'Parallax needs access to your photo library to upload profile pictures.',
      NSLocationWhenInUseUsageDescription: 'Parallax uses your location to find matches nearby.',
      NSContactsUsageDescription: 'Parallax can access your contacts to help you connect with friends.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.bdt.parallax',
    permissions: [
      'CAMERA',
      'RECORD_AUDIO',
      'ACCESS_FINE_LOCATION',
      'ACCESS_COARSE_LOCATION',
      'READ_CONTACTS',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'READ_MEDIA_IMAGES',
      'READ_MEDIA_VIDEO',
    ],
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'react-native-vision-camera',
      {
        cameraPermissionText: 'Parallax needs access to your camera to take profile photos and videos.',
        enableMicrophonePermission: true,
        microphonePermissionText: 'Parallax needs access to your microphone for video calls.',
      },
    ],
    '@shopify/react-native-skia',
  ],
});
