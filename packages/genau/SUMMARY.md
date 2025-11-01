# Genau Library - On-Device LLM Module for Expo

## Overview

The **Genau** library is a comprehensive Expo module that provides a unified API for interacting with on-device Large Language Models (LLMs) on both iOS and Android platforms. This library enables developers to integrate powerful AI capabilities directly into their Expo applications without relying on cloud services.

## What Has Been Created

### 1. Package Structure (`packages/genau/`)

A complete Expo module package with:
- TypeScript API layer
- iOS native module (Swift)
- Android native module (Kotlin)
- Web fallback implementation
- Comprehensive test suite
- Documentation and examples

### 2. Core Features

✅ **Unified API** - Same interface across iOS, Android, and Web  
✅ **Type-Safe** - Full TypeScript support with comprehensive type definitions  
✅ **Streaming Support** - Real-time token generation for responsive UIs  
✅ **Model Management** - Download, delete, and query available models  
✅ **Event-Driven** - Subscribe to progress updates and events  
✅ **Configurable** - Fine-tune temperature, top-p, top-k, and more  
✅ **Platform-Specific Optimizations** - Leverages native frameworks  

### 3. API Contracts

The library exports a complete set of TypeScript interfaces and types:

- `GenauConfig` - Configuration for LLM initialization
- `GenauMessage` - Message format for conversations
- `GenauResponse` - Response structure from the LLM
- `GenauStreamChunk` - Streaming response chunks
- `GenauModelInfo` - Model metadata
- `GenauDownloadProgress` - Download progress tracking
- Event types for all async operations

### 4. Platform Implementations

#### iOS (Swift)
- Located in `ios/GenauModule.swift`
- Designed to work with MLX framework for Apple Silicon
- Placeholder implementations ready for actual LLM integration
- Support for CoreML as alternative

#### Android (Kotlin)
- Located in `android/src/main/java/expo/modules/genau/GenauModule.kt`
- Designed to work with Google ML Kit and Gemini Nano
- Coroutine-based async operations
- Placeholder implementations ready for actual LLM integration

#### Web (TypeScript)
- Located in `src/GenauModule.web.ts`
- Stub implementation that explains on-device LLMs aren't available on web
- Maintains API compatibility

### 5. JavaScript/TypeScript API

Main module (`src/GenauModule.ts`) provides:

```typescript
// Initialize the LLM
await Genau.initialize({
  modelId: 'gemini-nano',
  maxTokens: 512,
  temperature: 0.7,
});

// Generate text
const response = await Genau.generate([
  { role: 'user', content: 'What is AI?' }
]);

// Stream responses
Genau.on('streamChunk', (event) => {
  console.log(event.data.text);
});
await Genau.generateStream([
  { role: 'user', content: 'Tell me a story' }
]);

// Manage models
const models = await Genau.getAvailableModels();
await Genau.downloadModel('gemini-nano');
```

### 6. Testing

Comprehensive Jest test suite with:
- ✅ 18 tests passing
- ✅ Initialization tests
- ✅ Model management tests
- ✅ Text generation tests
- ✅ Streaming tests
- ✅ Event handling tests
- ✅ State management tests
- ✅ Coverage for all public APIs

Located in `src/__tests__/GenauModule.test.ts`

### 7. Documentation

#### README.md
- Quick start guide
- API reference
- Usage examples
- Platform-specific notes
- Development status

#### iOS Implementation Guide (`docs/IOS_IMPLEMENTATION.md`)
- Prerequisites and setup
- MLX framework integration
- Model loading implementation
- Text generation implementation
- Streaming implementation
- Testing with XCTest
- Performance optimization tips

#### Android Implementation Guide (`docs/ANDROID_IMPLEMENTATION.md`)
- Prerequisites and setup
- Google ML Kit / Gemini Nano integration
- Model initialization
- Text generation implementation
- Streaming implementation
- Testing with JUnit
- Troubleshooting common issues

### 8. Example Integration

`example/GenauExample.tsx` provides a complete example React component demonstrating:
- Module initialization
- Chat interface
- Message handling
- Streaming responses
- Error handling
- Loading states

## How to Use

### Installation

The package is part of the monorepo workspace. To use it in an app:

```typescript
import Genau, { GenauConfig, GenauMessage } from '@bdt/genau';
```

### Basic Usage

```typescript
// Initialize
await Genau.initialize({
  modelId: Platform.OS === 'ios' 
    ? 'mlx-community/Llama-3.2-1B-Instruct-4bit'
    : 'gemini-nano',
  maxTokens: 512,
  temperature: 0.7,
});

// Generate
const response = await Genau.generate([
  { role: 'user', content: 'Hello!' }
]);
```

## Next Steps for Complete Implementation

The framework is complete, but the actual LLM integrations need to be implemented:

### For iOS:
1. Add MLX Swift package dependency
2. Implement model loading from local storage
3. Implement tokenization
4. Implement inference loop with MLX
5. Add model download functionality
6. Create XCTest unit tests

### For Android:
1. Add Google AI Client SDK dependency
2. Integrate Gemini Nano API
3. Implement model initialization
4. Implement text generation with Gemini
5. Add model availability checks
6. Create JUnit unit tests

## File Structure

```
packages/genau/
├── src/
│   ├── Genau.types.ts           # TypeScript type definitions
│   ├── GenauModule.ts            # Main JavaScript/TypeScript API
│   ├── GenauModule.web.ts        # Web fallback implementation
│   ├── index.ts                  # Package entry point
│   └── __tests__/
│       ├── setup.ts              # Test mocks
│       └── GenauModule.test.ts   # Jest tests (18 passing)
├── ios/
│   └── GenauModule.swift         # iOS native module (Swift)
├── android/
│   ├── build.gradle              # Android build configuration
│   └── src/main/java/expo/modules/genau/
│       └── GenauModule.kt        # Android native module (Kotlin)
├── docs/
│   ├── IOS_IMPLEMENTATION.md     # iOS implementation guide
│   └── ANDROID_IMPLEMENTATION.md # Android implementation guide
├── example/
│   └── GenauExample.tsx          # Example React component
├── expo-module.config.json       # Expo module configuration
├── package.json                  # Package metadata
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── .eslintrc.js                  # ESLint configuration
├── .gitignore                    # Git ignore rules
├── .npmignore                    # NPM ignore rules
├── Genau.podspec                 # iOS CocoaPods spec
└── README.md                     # User documentation
```

## Testing Commands

```bash
# Run tests
pnpm --filter @bdt/genau test

# Watch mode
pnpm --filter @bdt/genau test:watch

# Coverage
pnpm --filter @bdt/genau test:coverage

# Type check
pnpm --filter @bdt/genau type-check

# Lint
pnpm --filter @bdt/genau lint

# Build
pnpm --filter @bdt/genau build
```

## Integration with Monorepo

The package is properly integrated into the monorepo:
- ✅ Added to pnpm workspace
- ✅ Follows monorepo conventions
- ✅ Compatible with existing packages (@bdt/ui, @bdt/components, etc.)
- ✅ Can be imported by apps (carat-central, vloop, parallax)

## Platform Support

| Platform | Status | Framework |
|----------|--------|-----------|
| iOS      | 🟡 Framework Ready | MLX / CoreML |
| Android  | 🟡 Framework Ready | Gemini Nano / ML Kit |
| Web      | ✅ Fallback (not supported) | N/A |

🟡 = Framework complete, LLM integration pending

## License

MIT

---

**Created by:** GitHub Copilot  
**Date:** 2025-11-01  
**Version:** 0.1.0
