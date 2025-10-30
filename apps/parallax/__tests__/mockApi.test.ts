// Mock API tests
import { mockApi } from '../src/lib/mockApi';
import { Chat, Message, ExploreCard, User } from '../src/lib/types';

describe('mockApi', () => {
  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const user = await mockApi.getCurrentUser();
      
      expect(user).toBeDefined();
      expect(user.id).toBe('current-user');
      expect(user.name).toBe('You');
      expect(user.age).toBe(27);
      expect(user.bio).toBeDefined();
      expect(user.images).toBeInstanceOf(Array);
      expect(user.traits).toBeInstanceOf(Array);
    });
  });

  describe('getChats', () => {
    it('should return array of chats', async () => {
      const chats = await mockApi.getChats();
      
      expect(chats).toBeInstanceOf(Array);
      expect(chats.length).toBeGreaterThan(0);
      
      const chat = chats[0];
      expect(chat.id).toBeDefined();
      expect(chat.participants).toBeInstanceOf(Array);
      expect(chat.participants.length).toBe(2);
      expect(chat.lastMessage).toBeDefined();
      expect(chat.unreadCount).toBeGreaterThanOrEqual(0);
    });

    it('should include current user in participants', async () => {
      const chats = await mockApi.getChats();
      
      chats.forEach((chat) => {
        const hasCurrentUser = chat.participants.some(
          (p) => p.id === 'current-user'
        );
        expect(hasCurrentUser).toBe(true);
      });
    });
  });

  describe('getChatMessages', () => {
    it('should return messages for a chat', async () => {
      const chats = await mockApi.getChats();
      const chatId = chats[0].id;
      
      const response = await mockApi.getChatMessages(chatId);
      
      expect(response.items).toBeInstanceOf(Array);
      expect(response.items.length).toBeGreaterThan(0);
      
      const message = response.items[0];
      expect(message.id).toBeDefined();
      expect(message.chatId).toBe(chatId);
      expect(message.senderId).toBeDefined();
      expect(message.content).toBeDefined();
      expect(message.type).toMatch(/text|image|video/);
      expect(message.createdAt).toBeDefined();
    });

    it('should support pagination', async () => {
      const chats = await mockApi.getChats();
      const chatId = chats[0].id;
      
      const firstPage = await mockApi.getChatMessages(chatId);
      
      expect(firstPage.items).toBeInstanceOf(Array);
      // For small datasets, nextCursor might be undefined
      if (firstPage.nextCursor) {
        const secondPage = await mockApi.getChatMessages(
          chatId,
          firstPage.nextCursor
        );
        expect(secondPage.items).toBeInstanceOf(Array);
      }
    });
  });

  describe('searchExplore', () => {
    it('should return explore cards', async () => {
      const response = await mockApi.searchExplore();
      
      expect(response.items).toBeInstanceOf(Array);
      expect(response.items.length).toBeGreaterThan(0);
      
      const card = response.items[0];
      expect(card.user).toBeDefined();
      expect(card.compatibilityScore).toBeGreaterThanOrEqual(0);
      expect(card.compatibilityScore).toBeLessThanOrEqual(1);
      expect(card.tags).toBeInstanceOf(Array);
    });

    it('should support pagination', async () => {
      const firstPage = await mockApi.searchExplore();
      
      expect(firstPage.items).toBeInstanceOf(Array);
      
      if (firstPage.nextCursor) {
        const secondPage = await mockApi.searchExplore({
          cursor: firstPage.nextCursor,
        });
        expect(secondPage.items).toBeInstanceOf(Array);
      }
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const userId = 'current-user';
      const updates = {
        name: 'New Name',
        bio: 'New bio text',
      };
      
      const updatedUser = await mockApi.updateProfile(userId, updates);
      
      expect(updatedUser.name).toBe(updates.name);
      expect(updatedUser.bio).toBe(updates.bio);
    });

    it('should preserve unchanged fields', async () => {
      const userId = 'current-user';
      const currentUser = await mockApi.getCurrentUser();
      const updates = { name: 'Different Name' };
      
      const updatedUser = await mockApi.updateProfile(userId, updates);
      
      expect(updatedUser.name).toBe(updates.name);
      expect(updatedUser.age).toBe(currentUser.age);
      expect(updatedUser.images).toEqual(currentUser.images);
    });
  });

  describe('generateBio', () => {
    it('should generate bio suggestions', async () => {
      const traits = ['adventurous', 'foodie'];
      const response = await mockApi.generateBio(traits, 'sincere');
      
      expect(response.suggestions).toBeInstanceOf(Array);
      expect(response.suggestions.length).toBeGreaterThan(0);
      
      response.suggestions.forEach((suggestion) => {
        expect(typeof suggestion).toBe('string');
        expect(suggestion.length).toBeGreaterThan(0);
      });
    });

    it('should support different tones', async () => {
      const traits = ['creative', 'thoughtful'];
      
      const witty = await mockApi.generateBio(traits, 'witty');
      const sincere = await mockApi.generateBio(traits, 'sincere');
      const short = await mockApi.generateBio(traits, 'short');
      
      expect(witty.suggestions).toBeInstanceOf(Array);
      expect(sincere.suggestions).toBeInstanceOf(Array);
      expect(short.suggestions).toBeInstanceOf(Array);
      
      // Short suggestions should generally be shorter
      const avgShortLength =
        short.suggestions.reduce((sum, s) => sum + s.length, 0) /
        short.suggestions.length;
      const avgSincereLength =
        sincere.suggestions.reduce((sum, s) => sum + s.length, 0) /
        sincere.suggestions.length;
      
      expect(avgShortLength).toBeLessThan(avgSincereLength);
    });
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const chats = await mockApi.getChats();
      const chatId = chats[0].id;
      const content = 'Test message';
      
      const message = await mockApi.sendMessage(chatId, content);
      
      expect(message.id).toBeDefined();
      expect(message.chatId).toBe(chatId);
      expect(message.senderId).toBe('current-user');
      expect(message.content).toBe(content);
      expect(message.type).toBe('text');
      expect(message.createdAt).toBeDefined();
    });

    it('should add message to chat history', async () => {
      const chats = await mockApi.getChats();
      const chatId = chats[0].id;
      const content = 'Another test message';
      
      const beforeMessages = await mockApi.getChatMessages(chatId);
      const sentMessage = await mockApi.sendMessage(chatId, content);
      const afterMessages = await mockApi.getChatMessages(chatId);
      
      expect(afterMessages.items.length).toBe(beforeMessages.items.length + 1);
      
      const lastMessage = afterMessages.items[afterMessages.items.length - 1];
      expect(lastMessage.id).toBe(sentMessage.id);
      expect(lastMessage.content).toBe(content);
    });
  });

  describe('latency simulation', () => {
    it('should simulate network delay', async () => {
      const start = Date.now();
      await mockApi.getCurrentUser();
      const duration = Date.now() - start;
      
      // Should take at least 250ms (with some margin for execution)
      expect(duration).toBeGreaterThan(200);
    });
  });
});
