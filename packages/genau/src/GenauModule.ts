import { EventEmitter, requireNativeModule } from 'expo-modules-core';
import {
  GenauConfig,
  GenauMessage,
  GenauResponse,
  GenauStreamChunk,
  GenauModelInfo,
  GenauDownloadProgress,
} from './Genau.types';

// Import the native module. On web, it will be resolved to GenauModule.web.ts
const GenauModule: GenauNativeModule = requireNativeModule('Genau');

interface GenauNativeModule {
  initialize(config: GenauConfig): Promise<void>;
  isModelAvailable(modelId: string): Promise<boolean>;
  downloadModel(modelId: string): Promise<void>;
  cancelDownload(modelId: string): Promise<void>;
  deleteModel(modelId: string): Promise<void>;
  getAvailableModels(): Promise<GenauModelInfo[]>;
  generate(messages: GenauMessage[], config?: Partial<GenauConfig>): Promise<GenauResponse>;
  generateStream(messages: GenauMessage[], config?: Partial<GenauConfig>): Promise<void>;
  stopGeneration(): Promise<void>;
  clearConversation(): Promise<void>;
}

/**
 * Genau - On-device LLM interaction module for iOS and Android
 * 
 * This module provides a unified API to interact with on-device Large Language Models:
 * - iOS: Uses Apple MLX framework with local models
 * - Android: Uses Google ML Kit with Gemini Nano or other local models
 */
class Genau {
  private eventEmitter: any;
  private isInitialized: boolean = false;
  private currentConfig: GenauConfig | null = null;

  constructor() {
    this.eventEmitter = new EventEmitter(GenauModule as any);
  }

  /**
   * Initialize the LLM with the specified configuration
   * 
   * @param config - Configuration for the LLM
   * @throws Error if initialization fails
   * 
   * @example
   * ```typescript
   * await genau.initialize({
   *   modelId: 'mlx-community/Llama-3.2-1B-Instruct-4bit',
   *   maxTokens: 512,
   *   temperature: 0.7,
   * });
   * ```
   */
  async initialize(config: GenauConfig): Promise<void> {
    try {
      await GenauModule.initialize(config);
      this.isInitialized = true;
      this.currentConfig = config;
    } catch (error) {
      throw new Error(`Failed to initialize Genau: ${error}`);
    }
  }

  /**
   * Check if a specific model is available on the device
   * 
   * @param modelId - The model identifier to check
   * @returns Promise resolving to true if model is available
   * 
   * @example
   * ```typescript
   * const isAvailable = await genau.isModelAvailable('gemini-nano');
   * ```
   */
  async isModelAvailable(modelId: string): Promise<boolean> {
    return GenauModule.isModelAvailable(modelId);
  }

  /**
   * Download a model to the device
   * 
   * @param modelId - The model identifier to download
   * @throws Error if download fails
   * 
   * @example
   * ```typescript
   * genau.on('modelDownloadProgress', (event) => {
   *   console.log(`Progress: ${event.data.progress * 100}%`);
   * });
   * 
   * await genau.downloadModel('mlx-community/Llama-3.2-1B-Instruct-4bit');
   * ```
   */
  async downloadModel(modelId: string): Promise<void> {
    return GenauModule.downloadModel(modelId);
  }

  /**
   * Cancel an ongoing model download
   * 
   * @param modelId - The model identifier to cancel
   */
  async cancelDownload(modelId: string): Promise<void> {
    return GenauModule.cancelDownload(modelId);
  }

  /**
   * Delete a downloaded model from the device
   * 
   * @param modelId - The model identifier to delete
   */
  async deleteModel(modelId: string): Promise<void> {
    return GenauModule.deleteModel(modelId);
  }

  /**
   * Get list of all available models
   * 
   * @returns Promise resolving to array of model information
   * 
   * @example
   * ```typescript
   * const models = await genau.getAvailableModels();
   * models.forEach(model => {
   *   console.log(`${model.name}: ${model.isDownloaded ? 'Downloaded' : 'Not downloaded'}`);
   * });
   * ```
   */
  async getAvailableModels(): Promise<GenauModelInfo[]> {
    return GenauModule.getAvailableModels();
  }

  /**
   * Generate a response from the LLM
   * 
   * @param messages - Conversation history
   * @param config - Optional configuration overrides
   * @returns Promise resolving to the generated response
   * @throws Error if generation fails or module is not initialized
   * 
   * @example
   * ```typescript
   * const response = await genau.generate([
   *   { role: 'user', content: 'What is the capital of France?' }
   * ]);
   * console.log(response.text); // "The capital of France is Paris."
   * ```
   */
  async generate(
    messages: GenauMessage[],
    config?: Partial<GenauConfig>
  ): Promise<GenauResponse> {
    if (!this.isInitialized) {
      throw new Error('Genau module is not initialized. Call initialize() first.');
    }
    return GenauModule.generate(messages, config);
  }

  /**
   * Generate a streaming response from the LLM
   * 
   * Listen to 'streamChunk' events to receive response chunks
   * 
   * @param messages - Conversation history
   * @param config - Optional configuration overrides
   * @throws Error if generation fails or module is not initialized
   * 
   * @example
   * ```typescript
   * genau.on('streamChunk', (event) => {
   *   console.log(event.data.text);
   *   if (event.data.isComplete) {
   *     console.log('Generation complete!');
   *   }
   * });
   * 
   * await genau.generateStream([
   *   { role: 'user', content: 'Tell me a story' }
   * ]);
   * ```
   */
  async generateStream(
    messages: GenauMessage[],
    config?: Partial<GenauConfig>
  ): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Genau module is not initialized. Call initialize() first.');
    }
    return GenauModule.generateStream(messages, config);
  }

  /**
   * Stop ongoing generation
   */
  async stopGeneration(): Promise<void> {
    return GenauModule.stopGeneration();
  }

  /**
   * Clear conversation history (if maintained by native module)
   */
  async clearConversation(): Promise<void> {
    return GenauModule.clearConversation();
  }

  /**
   * Subscribe to events from the native module
   * 
   * @param eventType - Type of event to listen for
   * @param listener - Callback function
   * @returns Subscription object with remove() method
   * 
   * @example
   * ```typescript
   * const subscription = genau.on('streamChunk', (event) => {
   *   console.log(event.data.text);
   * });
   * 
   * // Later, unsubscribe
   * subscription.remove();
   * ```
   */
  on(
    eventType: 'modelDownloadProgress',
    listener: (event: { data: GenauDownloadProgress }) => void
  ): { remove: () => void };
  on(
    eventType: 'streamChunk',
    listener: (event: { data: GenauStreamChunk }) => void
  ): { remove: () => void };
  on(
    eventType: 'modelDownloadComplete',
    listener: (event: { modelId: string }) => void
  ): { remove: () => void };
  on(
    eventType: 'streamComplete',
    listener: () => void
  ): { remove: () => void };
  on(
    eventType: 'modelDownloadError' | 'streamError',
    listener: (event: { error: string }) => void
  ): { remove: () => void };
  on(eventType: string, listener: (event: any) => void): { remove: () => void } {
    return this.eventEmitter.addListener(eventType, listener);
  }

  /**
   * Get current initialization status
   */
  getIsInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get current configuration
   */
  getCurrentConfig(): GenauConfig | null {
    return this.currentConfig;
  }
}

// Export a singleton instance
export default new Genau();
