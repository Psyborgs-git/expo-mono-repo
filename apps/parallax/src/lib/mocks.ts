// Mock data for Parallax app
import { User, Message, Chat, ExploreCard } from './types';

// Sample users for mock data
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Chen',
    age: 28,
    bio: 'Adventure seeker, coffee enthusiast, and aspiring chef. Love hiking and trying new restaurants.',
    images: [
      'https://picsum.photos/seed/user1-1/400/600',
      'https://picsum.photos/seed/user1-2/400/600',
      'https://picsum.photos/seed/user1-3/400/600',
    ],
    video: 'https://example.com/videos/user1.mp4',
    distanceKm: 3.2,
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    traits: ['adventurous', 'foodie', 'active', 'creative'],
  },
  {
    id: 'user-2',
    name: 'Jordan Smith',
    age: 32,
    bio: 'Software engineer by day, musician by night. Looking for someone to share concerts and code reviews.',
    images: [
      'https://picsum.photos/seed/user2-1/400/600',
      'https://picsum.photos/seed/user2-2/400/600',
    ],
    distanceKm: 5.8,
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    traits: ['tech-savvy', 'musical', 'introverted', 'thoughtful'],
  },
  {
    id: 'user-3',
    name: 'Sam Rivera',
    age: 26,
    bio: 'Artist and yoga instructor. Seeking meaningful connections and deep conversations.',
    images: [
      'https://picsum.photos/seed/user3-1/400/600',
      'https://picsum.photos/seed/user3-2/400/600',
      'https://picsum.photos/seed/user3-3/400/600',
      'https://picsum.photos/seed/user3-4/400/600',
    ],
    video: 'https://example.com/videos/user3.mp4',
    distanceKm: 2.1,
    lastActive: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    traits: ['artistic', 'spiritual', 'empathetic', 'calm'],
  },
  {
    id: 'user-4',
    name: 'Morgan Taylor',
    age: 30,
    bio: 'Entrepreneur and travel blogger. Always planning the next adventure!',
    images: [
      'https://picsum.photos/seed/user4-1/400/600',
      'https://picsum.photos/seed/user4-2/400/600',
      'https://picsum.photos/seed/user4-3/400/600',
    ],
    distanceKm: 7.5,
    lastActive: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    traits: ['adventurous', 'ambitious', 'social', 'energetic'],
  },
];

export const currentUser: User = {
  id: 'current-user',
  name: 'You',
  age: 27,
  bio: 'Tech enthusiast, bookworm, and weekend hiker.',
  images: [
    'https://picsum.photos/seed/current-1/400/600',
    'https://picsum.photos/seed/current-2/400/600',
  ],
  lastActive: new Date().toISOString(),
  traits: ['curious', 'thoughtful', 'active', 'creative'],
};

// Generate mock messages
function generateMessages(chatId: string, participantId: string): Message[] {
  const baseTime = Date.now() - 1000 * 60 * 60 * 24; // 24 hours ago
  return [
    {
      id: `msg-${chatId}-1`,
      chatId,
      senderId: participantId,
      content: "Hey! I saw we matched. How's it going?",
      type: 'text' as const,
      createdAt: new Date(baseTime).toISOString(),
    },
    {
      id: `msg-${chatId}-2`,
      chatId,
      senderId: 'current-user',
      content: "Hi! Doing well, thanks! I loved your profile.",
      type: 'text' as const,
      createdAt: new Date(baseTime + 1000 * 60 * 10).toISOString(),
    },
    {
      id: `msg-${chatId}-3`,
      chatId,
      senderId: participantId,
      content: "Thanks! I noticed you're into hiking. Have you tried the trails near Mt. Wilson?",
      type: 'text' as const,
      createdAt: new Date(baseTime + 1000 * 60 * 25).toISOString(),
    },
    {
      id: `msg-${chatId}-4`,
      chatId,
      senderId: 'current-user',
      content: "Not yet, but it's on my list! Would you want to check it out together sometime?",
      type: 'text' as const,
      createdAt: new Date(baseTime + 1000 * 60 * 30).toISOString(),
    },
  ];
}

// Generate mock chats
export const mockChats: Chat[] = mockUsers.slice(0, 3).map((user, index) => {
  const chatId = `chat-${index + 1}`;
  const messages = generateMessages(chatId, user.id);
  
  return {
    id: chatId,
    participants: [currentUser, user],
    lastMessage: messages[messages.length - 1],
    unreadCount: index === 0 ? 2 : 0,
  };
});

// Store messages by chat ID
export const mockMessagesByChat: Record<string, Message[]> = {};
mockChats.forEach((chat) => {
  mockMessagesByChat[chat.id] = generateMessages(chat.id, chat.participants[1].id);
});

// Generate explore cards
export const mockExploreCards: ExploreCard[] = mockUsers.map((user, index) => ({
  user,
  compatibilityScore: 0.75 + Math.random() * 0.2, // 0.75 - 0.95
  tags: user.traits.slice(0, 3),
}));

// Bio suggestions for AI feature
export const mockBioSuggestions: Record<string, string[]> = {
  witty: [
    "Professional over-thinker and amateur chef. I promise not to burn your dinner... probably.",
    "I put the 'pro' in procrastination and the 'fun' in dysfunctional relationships. Just kidding... mostly.",
    "Swipe right if you can handle terrible puns and spontaneous dance parties in the kitchen.",
  ],
  sincere: [
    "Looking for genuine connection with someone who values deep conversations and shared adventures.",
    "I believe in authentic relationships, personal growth, and finding joy in life's simple moments.",
    "Seeking someone to explore life with - someone who's not afraid to be real and vulnerable.",
  ],
  short: [
    "Coffee, hiking, good conversations.",
    "Tech enthusiast. Weekend adventurer.",
    "Live music. New experiences. Real connections.",
  ],
};
