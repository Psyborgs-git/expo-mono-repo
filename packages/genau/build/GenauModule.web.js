"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Web implementation of Genau module
 * On-device LLMs are not available on web, so this provides stub implementations
 */
class GenauWeb {
    async initialize(_config) {
        console.warn('Genau: On-device LLMs are not available on web platform');
        throw new Error('On-device LLMs are not available on web platform');
    }
    async isModelAvailable(_modelId) {
        return false;
    }
    async downloadModel(_modelId) {
        throw new Error('Model download not available on web platform');
    }
    async cancelDownload(_modelId) {
        throw new Error('Model download not available on web platform');
    }
    async deleteModel(_modelId) {
        throw new Error('Model management not available on web platform');
    }
    async getAvailableModels() {
        return [];
    }
    async generate(_messages, _config) {
        throw new Error('Text generation not available on web platform');
    }
    async generateStream(_messages, _config) {
        throw new Error('Streaming generation not available on web platform');
    }
    async stopGeneration() {
        // No-op on web
    }
    async clearConversation() {
        // No-op on web
    }
    on(_eventType, _listener) {
        // Return a dummy subscription
        return {
            remove: () => { },
        };
    }
    getIsInitialized() {
        return false;
    }
    getCurrentConfig() {
        return null;
    }
}
exports.default = new GenauWeb();
//# sourceMappingURL=GenauModule.web.js.map