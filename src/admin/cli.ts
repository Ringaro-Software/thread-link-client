#!/usr/bin/env node

import { Command } from 'commander';
import { AdminClient } from './adminClient';
import { ThreadLinkAccount } from './threadLinkAccount';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();
const configPath = path.join(__dirname, 'config.json');

program
    .name('thread-link-admin')
    .description('CLI to interact with the AdminClient and ThreadLinkAccount')
    .version('1.0.0');

interface Config {
    url: string;
    token: string;
}

// Load configuration from file
const loadConfig = (): Config => {
    if (fs.existsSync(configPath)) {
        const rawData = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(rawData);
    }
    return { url: '', token: '' };
};

// Save configuration to file
const saveConfig = (config: Config) => {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
};

const config = loadConfig();

program
    .command('config-url <url>')
    .description('Set the base URL for the AdminClient')
    .action((url) => {
        config.url = url;
        saveConfig(config);
        console.log(`Base URL set to ${url}`);
    });

program
    .command('config-token <token>')
    .description('Set the admin token for the AdminClient')
    .action((token) => {
        config.token = token;
        saveConfig(config);
        console.log(`Admin token set to ${token}`);
    });

const getClient = () => {
    return new AdminClient(config.url, config.token);
}

program
    .command('init <slug>')
    .description('Initialize an account if it does not exist')
    .option('-n, --name <name>', 'Account name')
    .action(async (slug, options) => {
        const account = new ThreadLinkAccount(slug, getClient());
        const accountData = { accountSlug: slug, accountName: options.name};
        try {
            await account.init(accountData);
        } catch (e: any) {
            return parseError(e);
        }
        console.log(`Account ${slug} initialized`);
    });

program
    .command('account <slug>')
    .description('Get account information')
    .action(async (slug) => {
        const account = new ThreadLinkAccount(slug, getClient());
        let info;
        try {
            info = await account.get();
        } catch (e: any) {
            return parseError(e);
        }
        parseResponse(info);
    });

program
    .command('accounts')
    .description('Get all accounts')
    .action(async (slug) => {
        const account = new ThreadLinkAccount(slug, getClient());
        let info;
        try {
            info = await account.list();
        } catch (e: any) {
            return parseError(e);
        }
        parseResponse(info.map((account: any) => account.accountSlug));
    });

program
    .command('account-update <slug>')
    .description('Update account information')
    .option('-n, --name <name>', 'Account name')
    .action(async (slug, options) => {
        const account = new ThreadLinkAccount(slug, getClient());
        const accountData = { accountSlug: slug, accountName: options.name };
        const res = await account.update(accountData);
        console.log(`Account ${slug} updated`);
        parseResponse(res);
    });

program
    .command('provider <slug> <name>')
    .description('Get a provider configuration by name')
    .action(async (slug, name) => {
        const account = new ThreadLinkAccount(slug, getClient());
        const providerConfig = await account.providers.get(name);
        parseResponse(providerConfig);
    });

program
    .command('provider-update <slug> <name>')
    .description('Update a provider configuration')
    .option('-c, --config <config>', 'Provider configuration in JSON format')
    .action(async (slug, name, options) => {
        const account = new ThreadLinkAccount(slug, getClient());
        const configData = JSON.parse(options.config);
        const res = await account.providers.update(name, configData);
        console.log(`Provider ${name} updated`);
        parseResponse(res);
    });

program
    .command('providers <slug>')
    .description('List all provider configurations')
    .action(async (slug) => {
        const account = new ThreadLinkAccount(slug, getClient());
        const res = await account.providers.list();
        parseResponse(res);
    });

program
    .command('provider-create <slug>')
    .description('Create a new provider configuration')
    .option('-n, --name <name>', 'Provider name')
    .option('-c, --config <config>', 'Provider configuration in JSON format')
    .action(async (slug, options) => {
        const account = new ThreadLinkAccount(slug, getClient());
        const configData = { providerName: options.name, providerConfig: JSON.parse(options.config) };
        const res = await account.providers.create(configData);
        console.log(`Provider ${options.name} created`);
        parseResponse(res);
    });

program.parse(process.argv);

const parseError = (error: any) => {
    if (error.response && error.response.data && error.response.data.message) {
        console.log("Error:", error.response.data.message);
    } else {
        console.log("Error:", error.message);
    }
}

const parseResponse = (response: any) => {
    if (!response) {
        return;
    }
    if (Array.isArray(response)) {
        response.forEach((item: any) => {
            parseResponse(item);
        });
        return;
    }
    // if object and not string or number etc
    if (typeof response === 'object') {
        for (const key in response) {
            console.log(`${key}: ${response[key]}`);
        }
        return;
    }
    console.log(response);
}