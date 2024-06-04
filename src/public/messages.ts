import { PublicClient } from './publicClient';

export class Messages {
  private client: PublicClient;

  constructor(client: PublicClient) {
    this.client = client;
  }

  async replyInThread(topicID: string, threadId: string, messageData: any) {
    return await this.client.replyInThread(topicID, threadId, messageData);
  }
}
