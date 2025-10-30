// Jest setup file

// Mock expo modules
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

jest.mock('expo-location', () => ({
  getForegroundPermissionsAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
}));

jest.mock('expo-contacts', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
}));

jest.mock('expo-media-library', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
}));

jest.mock('react-native-vision-camera', () => ({
  Camera: {
    getCameraPermissionStatus: jest.fn(),
    requestCameraPermission: jest.fn(),
  },
}));

// Mock Tamagui icons
jest.mock('@tamagui/lucide-icons', () => ({
  MessageCircle: 'MessageCircle',
  Compass: 'Compass',
  User: 'User',
  MapPin: 'MapPin',
  Heart: 'Heart',
  X: 'X',
  Edit3: 'Edit3',
  Settings: 'Settings',
  LogOut: 'LogOut',
  Send: 'Send',
  Wand2: 'Wand2',
  Save: 'Save',
  Video: 'Video',
  VideoOff: 'VideoOff',
  Mic: 'Mic',
  MicOff: 'MicOff',
  PhoneOff: 'PhoneOff',
}));

