// Video provider interface and mock implementation

export type VideoEvent = 'joined' | 'left' | 'error' | 'stream';
export type VideoEventCallback = (data?: any) => void;

export interface VideoProvider {
  init(config: VideoConfig): Promise<void>;
  join(roomId: string): Promise<void>;
  leave(): Promise<void>;
  on(event: VideoEvent, callback: VideoEventCallback): void;
  off(event: VideoEvent, callback: VideoEventCallback): void;
}

export interface VideoConfig {
  apiKey?: string;
  userId?: string;
  [key: string]: any;
}

/**
 * Mock video provider for development
 * Simulates video call lifecycle with artificial delays
 */
export class MockVideoProvider implements VideoProvider {
  private listeners: Map<VideoEvent, Set<VideoEventCallback>> = new Map();
  private isInitialized = false;
  private isInCall = false;

  async init(config: VideoConfig): Promise<void> {
    console.log('[MockVideoProvider] Initializing with config:', config);
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.isInitialized = true;
    console.log('[MockVideoProvider] Initialized');
  }

  async join(roomId: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('VideoProvider not initialized. Call init() first.');
    }

    console.log('[MockVideoProvider] Joining room:', roomId);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.isInCall = true;
    this.emit('joined', { roomId });

    // Simulate remote stream arriving after 2 seconds
    setTimeout(() => {
      this.emit('stream', {
        streamId: 'mock-remote-stream',
        userId: 'remote-user-123',
      });
    }, 2000);

    console.log('[MockVideoProvider] Joined room successfully');
  }

  async leave(): Promise<void> {
    console.log('[MockVideoProvider] Leaving call');
    await new Promise((resolve) => setTimeout(resolve, 300));

    this.isInCall = false;
    this.emit('left', {});
    console.log('[MockVideoProvider] Left call');
  }

  on(event: VideoEvent, callback: VideoEventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: VideoEvent, callback: VideoEventCallback): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  private emit(event: VideoEvent, data?: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((callback) => callback(data));
    }
  }
}

/**
 * Factory function to get video provider based on environment variable
 * 
 * @param name - Provider name (defaults to EXPO_PUBLIC_VIDEO_PROVIDER env var or 'mock')
 * @returns VideoProvider instance
 */
export function getVideoProvider(
  name?: string
): VideoProvider {
  const providerName = name || process.env.EXPO_PUBLIC_VIDEO_PROVIDER || 'mock';

  switch (providerName) {
    case 'mock':
      return new MockVideoProvider();
    
    // Future providers can be added here:
    // case 'agora':
    //   return new AgoraVideoProvider();
    // case 'twilio':
    //   return new TwilioVideoProvider();
    
    default:
      console.warn(
        `Unknown video provider: ${providerName}. Falling back to mock.`
      );
      return new MockVideoProvider();
  }
}
