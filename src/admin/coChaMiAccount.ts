import { AccountDto, CreateAccountDto } from "../oas";
import { AdminClient } from "./adminClient";
import { ProviderConfigurations } from "./providerConfigurations";

export class CoChaMiAccount {
    private slug: string;
    private client: AdminClient;
    public providers: ProviderConfigurations;

    constructor(slug: string, client: AdminClient) {
      this.slug = slug;
      this.client = client;
      this.providers = new ProviderConfigurations(slug, client);
    }
  
    // Initialize the account if it does not exist, otherwise get the account info
    async init(accountData: any): Promise<AccountDto> {
      try {
        const account = await this.client.getAccountById(this.slug);
        return account.data;
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          return (await this.client.createAccount(accountData)).data;
        }
        throw error;
      }
    }
  
    // Get account information
    async get(): Promise<AccountDto> {
      return (await this.client.getAccountById(this.slug)).data;
    }

    async list(): Promise<AccountDto[]> {
      return (await this.client.getAllAccounts()).data;
    }
  
    // Update account information
    async update(accountData: CreateAccountDto): Promise<AccountDto> {
      return (await this.client.createAccount({ ...accountData, accountSlug: this.slug })).data;
    }
  }