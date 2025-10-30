// Mock API Types for Parallax App

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  images: string[];
  video?: string;
  distanceKm?: number;
  lastActive: string;
  traits: string[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video';
  createdAt: string;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
}

export interface ExploreCard {
  user: User;
  compatibilityScore: number;
  tags: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
}

export interface GenerateBioResponse {
  suggestions: string[];
}

export type BioTone = 'witty' | 'sincere' | 'short';
