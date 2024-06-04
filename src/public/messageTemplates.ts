import { PublicClient } from './publicClient';

export class MessageTemplates {
  private client: PublicClient;

  constructor(client: PublicClient) {
    this.client = client;
  }

  async create(templateData: any) {
    return await this.client.createMessageTemplate(templateData);
  }

  async findAll() {
    return await this.client.findAllMessageTemplates();
  }

  async findOne(name: string) {
    return await this.client.findMessageTemplateByName(name);
  }

  async update(name: string, templateData: any) {
    return await this.client.updateMessageTemplate(name, templateData);
  }

  async delete(name: string) {
    return await this.client.deleteMessageTemplate(name);
  }

  async renderTemplate(name: string, type: 'text' | 'html', parameters: any) {
    return await this.client.renderMessageTemplate(name, type, parameters);
  }
}
