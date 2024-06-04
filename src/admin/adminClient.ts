import { Configuration, CreateAccountDto, InternalAccountsApi, InternalAccountsProviderConfigurationApi } from './../oas';

export class AdminClient {
    private accountsApi: InternalAccountsApi;
    private providerConfigApi: InternalAccountsProviderConfigurationApi;
  
    constructor(basePath: string, adminToken: string) {
      const config = new Configuration({
        basePath,
        accessToken: adminToken,
      });
      this.accountsApi = new InternalAccountsApi(config);
      this.providerConfigApi = new InternalAccountsProviderConfigurationApi(config);
    }
  
    // Implement admin methods
    public async getAllAccounts() {
      return await this.accountsApi.accountsControllerFindAll();
    }
  
    public async createAccount(accountData: CreateAccountDto) {
      return await this.accountsApi.accountsControllerCreate(accountData);
    }
  
    public async getAccountById(accountSlug: string) {
      return await this.accountsApi.accountsControllerFindOne(accountSlug);
    }
  
    public async deleteAccount(accountSlug: string) {
      return await this.accountsApi.accountsControllerRemove(accountSlug);
    }
  
    public async addProviderConfiguration(accountSlug: string, configData: any) {
      return await this.providerConfigApi.providerConfigurationControllerAddProviderConfiguration(accountSlug, configData);
    }
  
    public async getProviderConfigurations(accountSlug: string) {
      return await this.providerConfigApi.providerConfigurationControllerGetProviderConfigurations(accountSlug);
    }
  
    public async updateProviderConfiguration(accountSlug: string, providerName: string, configData: any) {
      return await this.providerConfigApi.providerConfigurationControllerUpdateProviderConfiguration(accountSlug, providerName, configData);
    }
  
    public async deleteProviderConfiguration(accountSlug: string, providerName: string) {
      return await this.providerConfigApi.providerConfigurationControllerDeleteProviderConfiguration(accountSlug, providerName);
    }
  }