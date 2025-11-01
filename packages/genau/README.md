# @bdt/genau

On-device LLM interaction module for iOS and Android using Expo modules.

## Overview

Genau provides a unified API to interact with on-device Large Language Models across iOS and Android platforms:

- **iOS**: Supports Apple MLX framework and local models
- **Android**: Supports Google ML Kit with Gemini Nano and other local models

## Installation

```bash
pnpm add @bdt/genau
# or
npm install @bdt/genau
# or
yarn add @bdt/genau
```

## Features

✅ **Unified API** - Same interface for iOS and Android  
✅ **Type-safe** - Full TypeScript support  
✅ **Streaming** - Real-time token generation  
✅ **Model Management** - Download, delete, and list models  
✅ **Event-driven** - Subscribe to progress and completion events  
✅ **Configurable** - Fine-tune generation parameters  

## Quick Start

### 1. Initialize the Module

```typescript
import Genau from '@bdt/genau';

await Genau.initialize({
  modelId: 'mlx-community/Llama-3.2-1B-Instruct-4bit', // iOS
  // modelId: 'gemini-nano', // Android
  maxTokens: 512,
  temperature: 0.7,
  topP: 0.9,
});
```

### 2. Generate a Response

```typescript
const response = await Genau.generate([
  { role: 'user', content: 'What is the capital of France?' }
]);

console.log(response.text); // "The capital of France is Paris."
```

### 3. Stream a Response

```typescript
Genau.on('streamChunk', (event) => {
  console.log(event.data.text);
  if (event.data.isComplete) {
    console.log('Generation complete!');
  }
});

await Genau.generateStream([
  { role: 'user', content: 'Tell me a short story' }
]);
```

## API Reference

### Configuration

```typescript
interface GenauConfig {
  modelId: string;           // Model identifier (platform-specific)
  maxTokens?: number;        // Default: 256
  temperature?: number;      // Default: 0.7 (range: 0.0 - 2.0)
  topP?: number;             // Default: 0.9 (range: 0.0 - 1.0)
  topK?: number;             // Default: 40
  systemPrompt?: string;     // System prompt for conversation
}
```

### Methods

#### `initialize(config: GenauConfig): Promise<void>`

Initialize the LLM with the specified configuration.

```typescript
await Genau.initialize({
  modelId: 'gemini-nano',
  maxTokens: 512,
  temperature: 0.7,
});
```

#### `isModelAvailable(modelId: string): Promise<boolean>`

Check if a model is available on the device.

```typescript
const available = await Genau.isModelAvailable('gemini-nano');
```

#### `downloadModel(modelId: string): Promise<void>`

Download a model to the device. Listen to `modelDownloadProgress` events for progress updates.

```typescript
Genau.on('modelDownloadProgress', (event) => {
  console.log(`Progress: ${event.data.progress * 100}%`);
});

await Genau.downloadModel('mlx-community/Llama-3.2-1B-Instruct-4bit');
```

#### `cancelDownload(modelId: string): Promise<void>`

Cancel an ongoing model download.

```typescript
await Genau.cancelDownload('gemini-nano');
```

#### `deleteModel(modelId: string): Promise<void>`

Delete a downloaded model from the device.

```typescript
await Genau.deleteModel('gemini-nano');
```

#### `getAvailableModels(): Promise<GenauModelInfo[]>`

Get list of all available models.

```typescript
const models = await Genau.getAvailableModels();
models.forEach(model => {
  console.log(`${model.name}: ${model.isDownloaded ? 'Downloaded' : 'Available'}`);
});
```

#### `generate(messages: GenauMessage[], config?: Partial<GenauConfig>): Promise<GenauResponse>`

Generate a response from the LLM.

```typescript
const response = await Genau.generate([
  { role: 'user', content: 'Hello!' }
], {
  temperature: 0.9, // Override default temperature
});
```

#### `generateStream(messages: GenauMessage[], config?: Partial<GenauConfig>): Promise<void>`

Generate a streaming response. Listen to `streamChunk` events for chunks.

```typescript
Genau.on('streamChunk', (event) => {
  console.log(event.data.text);
});

await Genau.generateStream([
  { role: 'user', content: 'Write a poem' }
]);
```

#### `stopGeneration(): Promise<void>`

Stop ongoing generation.

```typescript
await Genau.stopGeneration();
```

#### `clearConversation(): Promise<void>`

Clear conversation history.

```typescript
await Genau.clearConversation();
```

### Events

Subscribe to events using the `on()` method:

```typescript
const subscription = Genau.on('eventName', (event) => {
  // Handle event
});

// Later, unsubscribe
subscription.remove();
```

#### Available Events

- `modelDownloadProgress` - Model download progress updates
- `modelDownloadComplete` - Model download completed
- `modelDownloadError` - Model download failed
- `streamChunk` - Streaming response chunk received
- `streamComplete` - Streaming response completed
- `streamError` - Streaming response failed

## Platform-Specific Notes

### iOS

The iOS implementation uses the MLX framework for running local LLMs. Models must be in MLX format.

**Recommended Models:**
- `mlx-community/Llama-3.2-1B-Instruct-4bit`
- `mlx-community/Llama-3.2-3B-Instruct-4bit`
- `mlx-community/Phi-3.5-mini-instruct-4bit`

### Android

The Android implementation uses Google ML Kit with Gemini Nano or other compatible models.

**Recommended Models:**
- `gemini-nano`
- `gemini-1.5-flash-lite`

## Example: Chat Interface

```typescript
import { useState, useEffect } from 'react';
import Genau, { GenauMessage } from '@bdt/genau';

function ChatScreen() {
  const [messages, setMessages] = useState<GenauMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize on mount
    Genau.initialize({
      modelId: 'gemini-nano',
      maxTokens: 512,
    });
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: GenauMessage = {
      role: 'user',
      content: input,
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await Genau.generate([...messages, userMessage]);
      
      setMessages([
        ...messages,
        userMessage,
        {
          role: 'assistant',
          content: response.text,
        },
      ]);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your UI here
  );
}
```

## Development Status

⚠️ **Note**: This is a template/framework for on-device LLM integration. The actual LLM implementations need to be completed:

### iOS (Swift)
- [ ] Integrate MLX framework
- [ ] Implement model loading and initialization
- [ ] Implement text generation
- [ ] Implement streaming generation
- [ ] Add model download functionality

### Android (Kotlin)
- [ ] Integrate Google ML Kit / Gemini Nano
- [ ] Implement model loading and initialization
- [ ] Implement text generation
- [ ] Implement streaming generation
- [ ] Add model download functionality

## Testing

Run tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Generate coverage report:

```bash
pnpm test:coverage
```

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for contribution guidelines.

## License

MIT
