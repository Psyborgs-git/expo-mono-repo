// API switch - toggle between mock and real GraphQL
import { mockApi } from './mockApi';

// Environment flag to switch between mock and real API
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK_API !== 'false';

// In the future, this will be replaced with the real GraphQL adapter
// const graphqlAdapter = {
//   getCurrentUser: async () => { /* GraphQL implementation */ },
//   getChats: async () => { /* GraphQL implementation */ },
//   // ... other methods
// };

// Export the active API implementation
export const api = USE_MOCK ? mockApi : mockApi; // Replace second mockApi with graphqlAdapter when ready

export { USE_MOCK };
