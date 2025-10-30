// import 'react-native-gesture-handler/jestSetup';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      name: 'Carat Central',
      slug: 'carat-central',
    },
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children, ..._props }) => children,
  Stack: {
    Screen: ({ children, ..._props }) => children,
  },
  Tabs: {
    Screen: ({ children, ..._props }) => children,
  },
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Apollo Client
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useSubscription: jest.fn(),
  ApolloProvider: ({ children }) => children,
}));

// Mock Tamagui
jest.mock('tamagui', () => ({
  TamaguiProvider: ({ children }) => children,
  Theme: ({ children }) => children,
  View: 'View',
  Text: 'Text',
  Button: 'Button',
  Input: 'Input',
  Card: 'Card',
  XStack: 'View',
  YStack: 'View',
  H1: 'Text',
  H2: 'Text',
  H3: 'Text',
  Paragraph: 'Text',
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
