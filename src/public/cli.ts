#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { PublicClient } from './publicClient';
import { Messages } from './messages';
import { Threads } from './threads';
import { Topics } from './topics';
import { MessageTemplates } from './messageTemplates';

const program = new Command();
const configPath = path.join(__dirname, 'publicConfig.json');

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
    .name('thread-link')
    .description('CLI to interact with the PublicClient')
    .version('1.0.0');

program
    .command('config-url <url>')
    .description('Set the base URL for the PublicClient')
    .action((url) => {
        config.url = url;
        saveConfig(config);
        console.log(`Base URL set to ${url}`);
    });

program
    .command('config-token <token>')
    .description('Set the public token for the PublicClient')
    .action((token) => {
        config.token = token;
        saveConfig(config);
        console.log(`Public token set to ${token}`);
    });

const publicClient = new PublicClient(config.url, config.token);
const messages = new Messages(publicClient);
const threads = new Threads(publicClient);
const topics = new Topics(publicClient);
const messageTemplates = new MessageTemplates(publicClient);

program
    .command('messages-reply <topicID> <threadId> <actorId>')
    .description('Reply in a thread')
    .option('-m, --message <message>', 'Message content in JSON format')
    .action(async (topicID, threadId, options) => {
        const messageData = JSON.parse(options.message);
        try {
            const res = await messages.replyInThread(topicID, threadId, messageData);
            console.log(`Message replied in thread ${threadId}`);
            parseResponse(res);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('threads-create <topicID>')
    .description('Create a new thread')
    .option('-d, --data <data>', 'Thread data in JSON format')
    .action(async (topicID, options) => {
        const threadData = JSON.parse(options.data);
        try {
            const res = await threads.create(topicID, threadData);
            console.log(`Thread created in topic ${topicID}`);
            parseResponse(res);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('threads-list <topicID>')
    .description('List all threads in a topic')
    .action(async (topicID) => {
        try {
            const res = await threads.findAll(topicID);
            console.log(`Threads in topic ${topicID}`);
            parseResponse(res);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('threads-get <topicID> <threadId>')
    .description('Get a thread by ID')
    .action(async (topicID, threadId) => {
        try {
            const res = await threads.findById(topicID, threadId);
            console.log(`Thread ${threadId} in topic ${topicID}`);
            parseResponse(res);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('threads-messages <topicID> <threadId>')
    .description('Get all messages in a thread')
    .action(async (topicID, threadId) => {
        try {
            const res = await threads.getTopicMessages(topicID, threadId);
            console.log(`Messages in thread ${threadId} in topic ${topicID}`);
            parseResponse(res);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('topics-create')
    .description('Create a new topic')
    .option('-d, --data <data>', 'Topic data in JSON format')
    .action(async (options) => {
        try {
            const topicData = JSON.parse(options.data);
            const res = await topics.create(topicData);
            console.log('Topic created');
            parseResponse(res);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('topics-list')
    .description('List all topics')
    .action(async () => {
        try {
            const res = await topics.findAll();
            console.log('All Topics:');
            parseResponse(res);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('topics-get <id>')
    .description('Get a topic by ID')
    .action(async (id) => {
        try {
            const res = await topics.findById(id);
            console.log(`Topic ${id}:`);
            parseResponse(res);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('templates-create')
    .description('Create a new message template')
    .option('-d, --data <data>', 'Template data in JSON format')
    .action(async (options) => {
        try {
            const templateData = JSON.parse(options.data);
            await messageTemplates.create(templateData);
            console.log('Template created');
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('templates-list')
    .description('List all message templates')
    .action(async () => {
        try {
            const allTemplates = await messageTemplates.findAll();
            console.log('All Templates:');
            parseResponse(allTemplates);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('templates-get <name>')
    .description('Get a message template by name')
    .action(async (name) => {
        try {
            const template = await messageTemplates.findOne(name);
            console.log(`Template ${name}:`);
            parseResponse(template);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('templates-update <name>')
    .description('Update a message template')
    .option('-d, --data <data>', 'Template data in JSON format')
    .action(async (name, options) => {
        try {
            const templateData = JSON.parse(options.data);
            await messageTemplates.update(name, templateData);
            console.log(`Template ${name} updated`);
            parseResponse(templateData);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('templates-delete <name>')
    .description('Delete a message template')
    .action(async (name) => {
        try {
            const res = await messageTemplates.delete(name);
            console.log(`Template ${name} deleted`);
        } catch (error: any) {
            parseError(error);
        }
    });

program
    .command('templates-render <name> <type>')
    .description('Render an email template with parameters')
    .option('-p, --params <params>', 'Template parameters in JSON format')
    .action(async (name, type, options) => {
        try {
            const parameters = JSON.parse(options.params);
            const rendered = await messageTemplates.renderTemplate(name, type, parameters);
            console.log(`Rendered template ${name}:`);
            console.log(rendered);
        } catch (error: any) {
            parseError(error);
        }
    });

program.parse(process.argv);


const parseError = (error: any) => {
    if (error.response && error.response.data && error.response.data.message) {
        console.log("Error:", error.response.data.message);
    } else {
        console.log("Error:", error.message);
    }
}

const parseResponse = (response: any, prefix = '') => {
    if (!response) {
        return;
    }
    if (Array.isArray(response)) {
        response.forEach((item: any) => {
            if ('id' in item) {
                console.log(prefix, `  # ${item.id}`);
                delete item.id;
                parseResponse(item, prefix + '    ');
            } else {
                parseResponse(item, prefix + '  ');
            }
        });
        return;
    }
    // if object and not string or number etc
    if (typeof response === 'object') {
        for (const key in response) {
            if (Array.isArray(response[key])) {
                console.log(prefix, `${key}: []`);
                response[key].forEach((item: any) => {
                    if ('id' in item) {
                        console.log(prefix, `  # ${item.id}`);
                        delete item.id;
                        parseResponse(item, prefix + '    ');
                    } else {
                        parseResponse(item, prefix + '  ');
                    }
                });
                continue;
            }
            if (typeof response[key] === 'object') {
                console.log(prefix, `${key}: {}`);
                parseResponse(response[key], prefix + `  `);
                continue;
            }
            console.log(prefix, `${key}: ${response[key]}`);
        }
        return;
    }
    console.log(prefix, response);
}