import { Configuration, CreateMessageDTO, CreateTopicDTO, PublicMessageTemplatesApi, PublicMessagesApi, PublicThreadsApi, PublicTopicsApi } from '../oas';

export class PublicClient {
  private messagesApi: PublicMessagesApi;
  private threadsApi: PublicThreadsApi;
  private topicsApi: PublicTopicsApi;
  private messageTemplatesApi: PublicMessageTemplatesApi;

  constructor(basePath: string = '', publicToken: string = '') {
    const config = new Configuration({
      basePath,
      accessToken: publicToken,
    });
    this.messagesApi = new PublicMessagesApi(config);
    this.threadsApi = new PublicThreadsApi(config);
    this.topicsApi = new PublicTopicsApi(config);
    this.messageTemplatesApi = new PublicMessageTemplatesApi(config);
  }

  // Messages-related methods
  async replyInThread(topicID: string, threadId: string, messageData: CreateMessageDTO) {
    return (await this.messagesApi.messagesControllerReplyInThread(topicID, threadId, messageData)).data;
  }

  // Threads-related methods
  async createThread(topicID: string, threadData: any) {
    return (await this.threadsApi.threadsControllerCreate(topicID, threadData)).data;
  }

  async findAllThreads(topicID: string) {
    return (await this.threadsApi.threadsControllerFindAll(topicID)).data;
  }

  async findThreadById(topicID: string, threadId: string) {
    return (await this.threadsApi.threadsControllerFindById(threadId, topicID)).data;
  }

  async getTopicMessages(threadID: string, topicID: string) {
    return (await this.threadsApi.threadsControllerGetTopicMessages(threadID, topicID)).data;
  }

  // Topics-related methods
  async createTopic(topicData: CreateTopicDTO) {
    return (await this.topicsApi.topicsControllerCreate(topicData)).data;
  }

  async findAllTopics() {
    return (await this.topicsApi.topicsControllerFindAll()).data;
  }

  async findTopicById(id: string) {
    return (await this.topicsApi.topicsControllerFindById(id)).data;
  }

  // MessageTemplates-related methods
  async createMessageTemplate(templateData: any) {
    return (await this.messageTemplatesApi.messageTemplatesControllerCreate(templateData)).data;
  }

  async findAllMessageTemplates() {
    return (await this.messageTemplatesApi.messageTemplatesControllerFindAllByAccountId()).data;
  }

  async findMessageTemplateByName(name: string) {
    return (await this.messageTemplatesApi.messageTemplatesControllerFindOne(name)).data;
  }

  async updateMessageTemplate(name: string, templateData: any) {
    return (await this.messageTemplatesApi.messageTemplatesControllerUpdate(name, templateData)).data;
  }

  async deleteMessageTemplate(name: string) {
    return (await this.messageTemplatesApi.messageTemplatesControllerDelete(name)).data;
  }

  async renderMessageTemplate(name: string, type: 'text' | 'html', parameters: any) {
    return (await this.messageTemplatesApi.messageTemplatesControllerRenderTemplate(name, type, parameters)).data;
  }
}
