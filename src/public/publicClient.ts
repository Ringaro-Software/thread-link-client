import { Configuration, CreateMessageDTO, CreateTopicDTO, PublicMessageTemplatesApi, PublicMessagesApi, PublicQueueApi, PublicThreadsApi, PublicTopicThreadsApi, PublicTopicsApi, ThreadFilterDto, TopicFilterDTO } from '../oas';

export class PublicClient {
  private messagesApi: PublicMessagesApi;
  private threadsApi: PublicThreadsApi;
  private topicThreadsApi: PublicTopicThreadsApi;
  private topicsApi: PublicTopicsApi;
  private messageTemplatesApi: PublicMessageTemplatesApi;
  private queueApi: PublicQueueApi;

  constructor(basePath: string = '', publicToken: string = '') {
    const config = new Configuration({
      basePath,
      accessToken: publicToken,
    });
    this.messagesApi = new PublicMessagesApi(config);
    this.threadsApi = new PublicThreadsApi(config);
    this.topicsApi = new PublicTopicsApi(config);
    this.topicThreadsApi = new PublicTopicThreadsApi(config);
    this.queueApi = new PublicQueueApi(config);
    this.messageTemplatesApi = new PublicMessageTemplatesApi(config);
  }

  // Messages-related methods
  async replyInThread(topicID: string, threadId: string, messageData: CreateMessageDTO) {
    return (await this.messagesApi.messagesControllerReplyInThread(topicID, threadId, messageData)).data;
  }

  // Threads-related methods
  async createTopicThread(topicID: string, threadData: any) {
    return (await this.topicThreadsApi.topicThreadsControllerCreate(topicID, threadData)).data;
  }

  async findAllTopicThreads(topicID: string) {
    return (await this.topicThreadsApi.topicThreadsControllerFindAll(topicID)).data;
  }

  async findTopicThreadById(topicID: string, threadId: string) {
    return (await this.topicThreadsApi.topicThreadsControllerFindById(threadId, topicID)).data;
  }

  async findAllThreads(filter?: ThreadFilterDto) {
    return (await this.threadsApi.threadsControllerFindAll(filter)).data;
  }

  async getTopicMessages(threadID: string, topicID: string) {
    return (await this.topicThreadsApi.topicThreadsControllerGetTopicMessages(threadID, topicID)).data;
  }

  // Topics-related methods
  async createTopic(topicData: CreateTopicDTO) {
    return (await this.topicsApi.topicsControllerCreate(topicData)).data;
  }

  async findAllTopics(filter?: TopicFilterDTO) {
    return (await this.topicsApi.topicsControllerFindAll(filter)).data;
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

  // Queue-related methods

  async findAllQueueMessages(status?: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped' | 'ignored' | 'deleted' | 'archived' | 'spam' | 'ham' | 'bounce' | 'complaint' | 'unsubscribed' | 'other') {
    return (await this.queueApi.queueControllerFindAll(status)).data;
  }

  async updateQueueMessageStatus(id: string, status: 'pending' | 'ignored') {
    return (await this.queueApi.queueControllerUpdateStatus(id, status)).data;
  }
}
