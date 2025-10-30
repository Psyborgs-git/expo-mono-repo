// Simple test utilities for now
export const createMockFunction = () => jest.fn();

export const createMockData = (overrides = {}) => ({
  id: '1',
  name: 'Test Item',
  ...overrides,
});

export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Basic test helper functions
export const testHelpers = {
  createMockFunction,
  createMockData,
  waitFor,
};