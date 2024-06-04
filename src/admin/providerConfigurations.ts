import { ProviderConfigurationDTO } from "../oas";
import { AdminClient } from "./adminClient";

export class ProviderConfigurations {
    private slug: string;
    private client: AdminClient;
  
    constructor(slug: string, client: AdminClient) {
      this.slug = slug;
      this.client = client;
    }
  
    // Fetch a specific provider configuration by name
    async get(name: string): Promise<ProviderConfigurationDTO | undefined> {
      const configs = (await this.client.getProviderConfigurations(this.slug)).data;
      return configs.find((config: any) => config.providerName === name);
    }
  
    // Update a specific provider configuration
    async update(name: string, configData: any): Promise<ProviderConfigurationDTO[]> {
      return (await this.client.updateProviderConfiguration(this.slug, name, configData)).data;
    }
  
    // List all provider configurations for the account
    async list(): Promise<ProviderConfigurationDTO[]> {
      return (await this.client.getProviderConfigurations(this.slug)).data;
    }
  
    // Create a new provider configuration
    async create(configData: any): Promise<ProviderConfigurationDTO[]> {
      return (await this.client.addProviderConfiguration(this.slug, configData)).data;
    }
  }
  