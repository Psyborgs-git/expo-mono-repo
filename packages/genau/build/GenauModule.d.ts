import { GenauConfig, GenauMessage, GenauResponse, GenauStreamChunk, GenauModelInfo, GenauDownloadProgress } from './Genau.types';
/**
 * Genau - On-device LLM interaction module for iOS and Android
 *
 * This module provides a unified API to interact with on-device Large Language Models:
 * - iOS: Uses Apple MLX framework with local models
 * - Android: Uses Google ML Kit with Gemini Nano or other local models
 */
declare class Genau {
    private eventEmitter;
    private isInitialized;
    private currentConfig;
    constructor();
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
    initialize(config: GenauConfig): Promise<void>;
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
    isModelAvailable(modelId: string): Promise<boolean>;
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
    downloadModel(modelId: string): Promise<void>;
    /**
     * Cancel an ongoing model download
     *
     * @param modelId - The model identifier to cancel
     */
    cancelDownload(modelId: string): Promise<void>;
    /**
     * Delete a downloaded model from the device
     *
     * @param modelId - The model identifier to delete
     */
    deleteModel(modelId: string): Promise<void>;
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
    getAvailableModels(): Promise<GenauModelInfo[]>;
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
    generate(messages: GenauMessage[], config?: Partial<GenauConfig>): Promise<GenauResponse>;
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
    generateStream(messages: GenauMessage[], config?: Partial<GenauConfig>): Promise<void>;
    /**
     * Stop ongoing generation
     */
    stopGeneration(): Promise<void>;
    /**
     * Clear conversation history (if maintained by native module)
     */
    clearConversation(): Promise<void>;
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
    on(eventType: 'modelDownloadProgress', listener: (event: {
        data: GenauDownloadProgress;
    }) => void): {
        remove: () => void;
    };
    on(eventType: 'streamChunk', listener: (event: {
        data: GenauStreamChunk;
    }) => void): {
        remove: () => void;
    };
    on(eventType: 'modelDownloadComplete', listener: (event: {
        modelId: string;
    }) => void): {
        remove: () => void;
    };
    on(eventType: 'streamComplete', listener: () => void): {
        remove: () => void;
    };
    on(eventType: 'modelDownloadError' | 'streamError', listener: (event: {
        error: string;
    }) => void): {
        remove: () => void;
    };
    /**
     * Get current initialization status
     */
    getIsInitialized(): boolean;
    /**
     * Get current configuration
     */
    getCurrentConfig(): GenauConfig | null;
}
declare const _default: Genau;
export default _default;
//# sourceMappingURL=GenauModule.d.ts.map