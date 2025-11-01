import { GenauConfig, GenauMessage, GenauResponse, GenauModelInfo } from './Genau.types';
/**
 * Web implementation of Genau module
 * On-device LLMs are not available on web, so this provides stub implementations
 */
declare class GenauWeb {
    initialize(_config: GenauConfig): Promise<void>;
    isModelAvailable(_modelId: string): Promise<boolean>;
    downloadModel(_modelId: string): Promise<void>;
    cancelDownload(_modelId: string): Promise<void>;
    deleteModel(_modelId: string): Promise<void>;
    getAvailableModels(): Promise<GenauModelInfo[]>;
    generate(_messages: GenauMessage[], _config?: Partial<GenauConfig>): Promise<GenauResponse>;
    generateStream(_messages: GenauMessage[], _config?: Partial<GenauConfig>): Promise<void>;
    stopGeneration(): Promise<void>;
    clearConversation(): Promise<void>;
    on(_eventType: string, _listener: (event: any) => void): {
        remove: () => void;
    };
    getIsInitialized(): boolean;
    getCurrentConfig(): GenauConfig | null;
}
declare const _default: GenauWeb;
export default _default;
//# sourceMappingURL=GenauModule.web.d.ts.map