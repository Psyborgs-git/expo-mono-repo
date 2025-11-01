/**
 * Configuration options for initializing the LLM
 */
export interface GenauConfig {
  /**
   * Model identifier (platform-specific)
   * iOS: e.g., "mlx-community/Llama-3.2-1B-Instruct-4bit"
   * Android: e.g., "gemini-nano", "gemini-1.5-flash-lite"
   */
  modelId: string;
  
  /**
   * Maximum number of tokens to generate
   * @default 256
   */
  maxTokens?: number;
  
  /**
   * Temperature for response generation (0.0 - 2.0)
   * @default 0.7
   */
  temperature?: number;
  
  /**
   * Top-p sampling parameter (0.0 - 1.0)
   * @default 0.9
   */
  topP?: number;
  
  /**
   * Top-k sampling parameter
   * @default 40
   */
  topK?: number;
  
  /**
   * System prompt for the conversation
   */
  systemPrompt?: string;
}

/**
 * Message in a conversation
 */
export interface GenauMessage {
  /**
   * Role of the message sender
   */
  role: 'system' | 'user' | 'assistant';
  
  /**
   * Content of the message
   */
  content: string;
  
  /**
   * Timestamp of the message
   */
  timestamp?: number;
}

/**
 * Response from the LLM
 */
export interface GenauResponse {
  /**
   * Generated text
   */
  text: string;
  
  /**
   * Number of tokens generated
   */
  tokensGenerated?: number;
  
  /**
   * Time taken to generate response (in milliseconds)
   */
  generationTime?: number;
  
  /**
   * Whether generation was stopped early
   */
  stopReason?: 'complete' | 'maxTokens' | 'stopped';
}

/**
 * Streaming response chunk
 */
export interface GenauStreamChunk {
  /**
   * Chunk of generated text
   */
  text: string;
  
  /**
   * Whether this is the final chunk
   */
  isComplete: boolean;
  
  /**
   * Current token count
   */
  tokenCount?: number;
}

/**
 * Model information
 */
export interface GenauModelInfo {
  /**
   * Model identifier
   */
  id: string;
  
  /**
   * Human-readable model name
   */
  name: string;
  
  /**
   * Model size in bytes
   */
  size?: number;
  
  /**
   * Whether the model is currently downloaded
   */
  isDownloaded: boolean;
  
  /**
   * Model capabilities
   */
  capabilities?: string[];
}

/**
 * Download progress information
 */
export interface GenauDownloadProgress {
  /**
   * Model being downloaded
   */
  modelId: string;
  
  /**
   * Current progress (0.0 - 1.0)
   */
  progress: number;
  
  /**
   * Bytes downloaded
   */
  bytesDownloaded: number;
  
  /**
   * Total bytes to download
   */
  totalBytes: number;
  
  /**
   * Download status
   */
  status: 'downloading' | 'paused' | 'completed' | 'failed';
  
  /**
   * Error message if status is 'failed'
   */
  error?: string;
}

/**
 * Event types for the Genau module
 */
export type GenauEventType = 
  | 'modelDownloadProgress'
  | 'modelDownloadComplete'
  | 'modelDownloadError'
  | 'streamChunk'
  | 'streamComplete'
  | 'streamError';

/**
 * Event payload for download progress
 */
export interface GenauDownloadProgressEvent {
  type: 'modelDownloadProgress';
  data: GenauDownloadProgress;
}

/**
 * Event payload for stream chunk
 */
export interface GenauStreamChunkEvent {
  type: 'streamChunk';
  data: GenauStreamChunk;
}

/**
 * Event payload for errors
 */
export interface GenauErrorEvent {
  type: 'modelDownloadError' | 'streamError';
  error: string;
}

/**
 * Union type for all events
 */
export type GenauEvent = 
  | GenauDownloadProgressEvent
  | GenauStreamChunkEvent
  | GenauErrorEvent
  | { type: 'modelDownloadComplete'; modelId: string }
  | { type: 'streamComplete'; };
