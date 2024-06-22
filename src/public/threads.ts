import { PublicClient } from './publicClient';

export class Threads {
  private client: PublicClient;

  constructor(client: PublicClient) {
    this.client = client;
  }

  async create(topicID: string, threadData: any) {
    return await this.client.createTopicThread(topicID, threadData);
  }

  async findAll(topicID: string) {
    return await this.client.findAllTopicThreads(topicID);
  }

  async findById(topicID: string, threadId: string) {
    return await this.client.findTopicThreadById(topicID, threadId);
  }

  async getTopicMessages(topicID: string, threadId: string) {
    return await this.client.getTopicMessages(topicID, threadId);
  }
}
