import { ApolloClient } from '@apollo/client';

export class CacheManager {
  constructor(private client: ApolloClient) {}

  async clearCache() {
    await this.client.clearStore();
  }

  async resetCache() {
    await this.client.resetStore();
  }

  evict(id: string, fieldName?: string) {
    this.client.cache.evict({ id, fieldName });
  }

  gc() {
    this.client.cache.gc();
  }
}
