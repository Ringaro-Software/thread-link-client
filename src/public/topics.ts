import { PublicClient } from './publicClient';

export class Topics {
  private client: PublicClient;

  constructor(client: PublicClient) {
    this.client = client;
  }

  async create(topicData: any) {
    return await this.client.createTopic(topicData);
  }

  async findAll() {
    return await this.client.findAllTopics();
  }

  async findById(id: string) {
    return await this.client.findTopicById(id);
  }
}
