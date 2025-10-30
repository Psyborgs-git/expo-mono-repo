// Mock API implementation for Parallax app
import {
  User,
  Message,
  Chat,
  ExploreCard,
  PaginatedResponse,
  GenerateBioResponse,
  BioTone,
} from './types';
import {
  currentUser,
  mockChats,
  mockMessagesByChat,
  mockExploreCards,
  mockBioSuggestions,
} from './mocks';

// Helper to simulate network latency
function withLatency<T>(data: T, ms: number = 300): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
}

// Mock API implementation
export const mockApi = {
  async getCurrentUser(): Promise<User> {
    return withLatency(currentUser);
  },

  async getChats(): Promise<Chat[]> {
    return withLatency(mockChats);
  },

  async getChatMessages(
    chatId: string,
    cursor?: string
  ): Promise<PaginatedResponse<Message>> {
    const messages = mockMessagesByChat[chatId] || [];
    
    // Simple pagination simulation
    const pageSize = 20;
    const startIndex = cursor ? parseInt(cursor, 10) : 0;
    const endIndex = startIndex + pageSize;
    const items = messages.slice(startIndex, endIndex);
    
    return withLatency({
      items,
      nextCursor: endIndex < messages.length ? String(endIndex) : undefined,
    });
  },

  async searchExplore(params?: {
    cursor?: string;
    filters?: any;
  }): Promise<PaginatedResponse<ExploreCard>> {
    const pageSize = 10;
    const startIndex = params?.cursor ? parseInt(params.cursor, 10) : 0;
    const endIndex = startIndex + pageSize;
    const items = mockExploreCards.slice(startIndex, endIndex);

    return withLatency({
      items,
      nextCursor:
        endIndex < mockExploreCards.length ? String(endIndex) : undefined,
    });
  },

  async updateProfile(
    userId: string,
    payload: Partial<User>
  ): Promise<User> {
    // In a real implementation, this would update the user on the server
    const updatedUser = { ...currentUser, ...payload };
    return withLatency(updatedUser);
  },

  async generateBio(
    profileTraits: string[],
    tone: BioTone = 'sincere'
  ): Promise<GenerateBioResponse> {
    const suggestions = mockBioSuggestions[tone] || mockBioSuggestions.sincere;
    return withLatency({ suggestions }, 500);
  },

  async sendMessage(chatId: string, content: string): Promise<Message> {
    const newMessage: Message = {
      id: `msg-${chatId}-${Date.now()}`,
      chatId,
      senderId: 'current-user',
      content,
      type: 'text',
      createdAt: new Date().toISOString(),
    };

    // Add to local mock store
    if (!mockMessagesByChat[chatId]) {
      mockMessagesByChat[chatId] = [];
    }
    mockMessagesByChat[chatId].push(newMessage);

    return withLatency(newMessage);
  },
};

export type MockApi = typeof mockApi;
