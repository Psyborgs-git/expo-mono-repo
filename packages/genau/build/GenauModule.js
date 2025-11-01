"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expo_modules_core_1 = require("expo-modules-core");
// Import the native module. On web, it will be resolved to GenauModule.web.ts
const GenauModule = (0, expo_modules_core_1.requireNativeModule)('Genau');
/**
 * Genau - On-device LLM interaction module for iOS and Android
 *
 * This module provides a unified API to interact with on-device Large Language Models:
 * - iOS: Uses Apple MLX framework with local models
 * - Android: Uses Google ML Kit with Gemini Nano or other local models
 */
class Genau {
    constructor() {
        this.isInitialized = false;
        this.currentConfig = null;
        this.eventEmitter = new expo_modules_core_1.EventEmitter(GenauModule);
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
    async initialize(config) {
        try {
            await GenauModule.initialize(config);
            this.isInitialized = true;
            this.currentConfig = config;
        }
        catch (error) {
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
    async isModelAvailable(modelId) {
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
    async downloadModel(modelId) {
        return GenauModule.downloadModel(modelId);
    }
    /**
     * Cancel an ongoing model download
     *
     * @param modelId - The model identifier to cancel
     */
    async cancelDownload(modelId) {
        return GenauModule.cancelDownload(modelId);
    }
    /**
     * Delete a downloaded model from the device
     *
     * @param modelId - The model identifier to delete
     */
    async deleteModel(modelId) {
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
    async getAvailableModels() {
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
    async generate(messages, config) {
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
    async generateStream(messages, config) {
        if (!this.isInitialized) {
            throw new Error('Genau module is not initialized. Call initialize() first.');
        }
        return GenauModule.generateStream(messages, config);
    }
    /**
     * Stop ongoing generation
     */
    async stopGeneration() {
        return GenauModule.stopGeneration();
    }
    /**
     * Clear conversation history (if maintained by native module)
     */
    async clearConversation() {
        return GenauModule.clearConversation();
    }
    on(eventType, listener) {
        return this.eventEmitter.addListener(eventType, listener);
    }
    /**
     * Get current initialization status
     */
    getIsInitialized() {
        return this.isInitialized;
    }
    /**
     * Get current configuration
     */
    getCurrentConfig() {
        return this.currentConfig;
    }
}
// Export a singleton instance
exports.default = new Genau();
//# sourceMappingURL=GenauModule.js.map