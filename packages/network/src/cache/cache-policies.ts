import type { TypePolicies } from '@apollo/client';

// Pagination merge function for DiamondConnection types
function mergeDiamondConnection(existing: any, incoming: any, { args }: any) {
  if (!existing) {
    return incoming;
  }

  const merged = { ...incoming };
  
  if (args?.after) {
    // Pagination: append new edges
    merged.edges = [...(existing.edges || []), ...(incoming.edges || [])];
  } else {
    // Fresh query: replace edges
    merged.edges = incoming.edges || [];
  }
  
  return merged;
}

// Message merge function for chat messages
function mergeChatMessages(existing: any[] = [], incoming: any[], { args }: any) {
  if (args?.cursor) {
    // Load more messages: prepend to existing (older messages)
    return [...incoming, ...existing];
  } else {
    // Fresh load: replace all
    return incoming;
  }
}

// Optimistic response generators
export const optimisticResponses = {
  createDiamond: (input: any) => ({
    __typename: 'Mutation',
    createDiamond: {
      __typename: 'Diamond',
      id: `temp-${Date.now()}`,
      ...input,
      status: 'AVAILABLE',
      isPublic: input.isPublic || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      organizationId: 'temp-org',
      ownerId: 'temp-user',
    },
  }),
  
  updateDiamond: (id: string, input: any) => ({
    __typename: 'Mutation',
    updateDiamond: {
      __typename: 'Diamond',
      id,
      ...input,
      updatedAt: new Date().toISOString(),
    },
  }),
  
  deleteDiamond: (id: string) => ({
    __typename: 'Mutation',
    deleteDiamond: {
      __typename: 'DeleteResult',
      success: true,
      message: 'Diamond deleted successfully',
    },
  }),
  
  sendMessage: (chatId: string, content: string, senderId: string) => ({
    __typename: 'Mutation',
    sendMessage: {
      __typename: 'Message',
      id: `temp-${Date.now()}`,
      chatId,
      content,
      senderId,
      isRead: false,
      createdAt: new Date().toISOString(),
      readAt: null,
      s3Key: null,
    },
  }),
  
  markMessageAsRead: (messageId: string) => ({
    __typename: 'Mutation',
    markMessageAsRead: {
      __typename: 'Message',
      id: messageId,
      isRead: true,
      readAt: new Date().toISOString(),
    },
  }),
};

// Cache update functions for mutations
// Note: These operations reference app-specific GraphQL files that are not available in the network package.
// Cache updates for app-specific queries should be handled at the app level.
export const cacheUpdates = {
  // Placeholder implementations - apps should define their own cache update handlers
  createDiamond: (cache: any, { data }: any) => {
    if (!data?.createDiamond) return;
    // Cache eviction by typename to refresh on next query
    cache.evict({ broadcast: false });
  },
  
  deleteDiamond: (cache: any, { data }: any, { variables }: any) => {
    if (!data?.deleteDiamond?.success) return;
    
    // Remove from cache by ID
    cache.evict({
      id: cache.identify({ __typename: 'Diamond', id: variables.id }),
    });
  },
  
  sendMessage: (cache: any, { data }: any) => {
    if (!data?.sendMessage) return;
    // Cache will auto-update through normalization
    // Additional updates should be handled by app's Apollo link or query updates
  },
};

// Type policies for Apollo Client cache
export const typePolicies: TypePolicies = {
  Query: {
    fields: {
      diamonds: {
        keyArgs: false,
        merge: mergeDiamondConnection,
      },
      publicDiamonds: {
        keyArgs: false,
        merge: mergeDiamondConnection,
      },
      chatMessages: {
        keyArgs: ['chatId'],
        merge: mergeChatMessages,
      },
      myChats: {
        merge(existing = [], incoming) {
          // Always replace with fresh data for chat list
          return incoming;
        },
      },
      myOrders: {
        merge(existing = [], incoming) {
          return incoming;
        },
      },
      myRequests: {
        merge(existing = [], incoming) {
          return incoming;
        },
      },
      myOrgRequests: {
        merge(existing = [], incoming) {
          return incoming;
        },
      },
      publicRequests: {
        merge(existing = [], incoming) {
          return incoming;
        },
      },
      findSimilarDiamonds: {
        keyArgs: ['diamondId'],
        merge(existing = [], incoming) {
          return incoming;
        },
      },
      searchDiamonds: {
        keyArgs: ['filters'],
        merge(existing = [], incoming) {
          return incoming;
        },
      },
    },
  },
  Diamond: {
    keyFields: ['id'],
    fields: {
      // Enable optimistic updates for diamond fields
      status: {
        merge(existing, incoming) {
          return incoming;
        },
      },
      isPublic: {
        merge(existing, incoming) {
          return incoming;
        },
      },
      pricePerCarat: {
        merge(existing, incoming) {
          return incoming;
        },
      },
      totalPrice: {
        merge(existing, incoming) {
          return incoming;
        },
      },
    },
  },
  Chat: {
    keyFields: ['id'],
    fields: {
      messages: {
        merge(existing = [], incoming) {
          // Merge messages by ID to avoid duplicates
          const existingIds = new Set(existing.map((msg: any) => msg.id));
          const newMessages = incoming.filter((msg: any) => !existingIds.has(msg.id));
          return [...existing, ...newMessages].sort(
            (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        },
      },
      participants: {
        merge(existing = [], incoming) {
          return incoming;
        },
      },
    },
  },
  Message: {
    keyFields: ['id'],
    fields: {
      isRead: {
        merge(existing, incoming) {
          return incoming;
        },
      },
      readAt: {
        merge(existing, incoming) {
          return incoming;
        },
      },
    },
  },
  Order: {
    keyFields: ['id'],
    fields: {
      status: {
        merge(existing, incoming) {
          return incoming;
        },
      },
      paymentStatus: {
        merge(existing, incoming) {
          return incoming;
        },
      },
    },
  },
  DiamondRequest: {
    keyFields: ['id'],
    fields: {
      status: {
        merge(existing, incoming) {
          return incoming;
        },
      },
      responseCount: {
        merge(existing, incoming) {
          return incoming;
        },
      },
      responses: {
        merge(existing = [], incoming) {
          return incoming;
        },
      },
    },
  },
  RequestResponse: {
    keyFields: ['id'],
    fields: {
      status: {
        merge(existing, incoming) {
          return incoming;
        },
      },
    },
  },
  Organization: {
    keyFields: ['id'],
  },
  User: {
    keyFields: ['id'],
  },
  CaratUserType: {
    keyFields: ['id'],
  },
  UserBasic: {
    keyFields: ['id'],
  },
  UserBasicInfo: {
    keyFields: ['id'],
  },
  OrganizationBasic: {
    keyFields: ['id'],
  },
  OrgBasicInfo: {
    keyFields: ['id'],
  },
};