import {
  GenauConfig,
  GenauMessage,
  GenauResponse,
  GenauModelInfo,
} from './Genau.types';

/**
 * Web implementation of Genau module
 * On-device LLMs are not available on web, so this provides stub implementations
 */
class GenauWeb {
  async initialize(_config: GenauConfig): Promise<void> {
    console.warn('Genau: On-device LLMs are not available on web platform');
    throw new Error('On-device LLMs are not available on web platform');
  }

  async isModelAvailable(_modelId: string): Promise<boolean> {
    return false;
  }

  async downloadModel(_modelId: string): Promise<void> {
    throw new Error('Model download not available on web platform');
  }

  async cancelDownload(_modelId: string): Promise<void> {
    throw new Error('Model download not available on web platform');
  }

  async deleteModel(_modelId: string): Promise<void> {
    throw new Error('Model management not available on web platform');
  }

  async getAvailableModels(): Promise<GenauModelInfo[]> {
    return [];
  }

  async generate(
    _messages: GenauMessage[],
    _config?: Partial<GenauConfig>
  ): Promise<GenauResponse> {
    throw new Error('Text generation not available on web platform');
  }

  async generateStream(
    _messages: GenauMessage[],
    _config?: Partial<GenauConfig>
  ): Promise<void> {
    throw new Error('Streaming generation not available on web platform');
  }

  async stopGeneration(): Promise<void> {
    // No-op on web
  }

  async clearConversation(): Promise<void> {
    // No-op on web
  }

  on(_eventType: string, _listener: (event: any) => void): { remove: () => void } {
    // Return a dummy subscription
    return {
      remove: () => {},
    };
  }

  getIsInitialized(): boolean {
    return false;
  }

  getCurrentConfig(): GenauConfig | null {
    return null;
  }
}

export default new GenauWeb();
