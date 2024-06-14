import { PublicClient } from './publicClient';

export class Queue {
  private client: PublicClient;

  constructor(client: PublicClient) {
    this.client = client;
  }

  async findAll(status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped' | 'ignored' | 'deleted' | 'archived' | 'spam' | 'ham' | 'bounce' | 'complaint' | 'unsubscribed' | 'other') {
    return await this.client.findAllQueueMessages(status);
  }

  async updateStatus(id: string, status: 'pending' | 'ignored') {
    return await this.client.updateQueueMessageStatus(id, status);
  }
}
