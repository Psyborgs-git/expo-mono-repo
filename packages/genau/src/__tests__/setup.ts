import { NativeModules } from 'react-native';

// Mock the native module
const mockNativeModule = {
  initialize: jest.fn().mockResolvedValue(undefined),
  isModelAvailable: jest.fn().mockResolvedValue(false),
  downloadModel: jest.fn().mockResolvedValue(undefined),
  cancelDownload: jest.fn().mockResolvedValue(undefined),
  deleteModel: jest.fn().mockResolvedValue(undefined),
  getAvailableModels: jest.fn().mockResolvedValue([]),
  generate: jest.fn().mockResolvedValue({
    text: 'Test response',
    tokensGenerated: 10,
    generationTime: 100,
    stopReason: 'complete',
  }),
  generateStream: jest.fn().mockResolvedValue(undefined),
  stopGeneration: jest.fn().mockResolvedValue(undefined),
  clearConversation: jest.fn().mockResolvedValue(undefined),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

// Mock expo-modules-core
jest.mock('expo-modules-core', () => ({
  requireNativeModule: jest.fn(() => mockNativeModule),
  NativeModule: class {},
  EventEmitter: class {
    addListener = jest.fn().mockReturnValue({ remove: jest.fn() });
  },
}));

export { mockNativeModule };
