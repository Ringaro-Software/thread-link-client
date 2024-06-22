// E2E tests 

import { AdminClient, ThreadLinkAccount } from "../admin";
import { PublicClient } from "../public/publicClient";
import { generateThread } from "./data";

async function testE2E() {
  const adminClient = new AdminClient('http://localhost:3000', '34asD%^&$U675ruytfh');
  const adminAccount1 = new ThreadLinkAccount('cuzzea_test', adminClient);
  await adminAccount1.init({
    accountSlug: 'cuzzea_test',
    accountName: 'Cuzzea Test',
  });

  const account1Info = await adminAccount1.get();
  const account1Token = account1Info.token;

  const adminAccount2 = new ThreadLinkAccount('cuzzea_test2', adminClient);
  await adminAccount2.init({
    accountSlug: 'cuzzea_test2',
    accountName: 'Cuzzea Test 2',
  });

  const account2Info = await adminAccount2.get();
  const account2Token = account2Info.token;

  // test so that tokens are different
  if (account1Token === account2Token) {
    throw new Error('Tokens are the same');
  }

  const account1PublicClient = new PublicClient('http://localhost:3000', account1Token);

  const topic1a1 = await account1PublicClient.createTopic({
    externalId: 'topic1a1',
    tags: [],
  });
  const topic1a1Id = topic1a1.id;

  const thread1a1 = await account1PublicClient.createTopicThread(topic1a1Id, generateThread());
  const thread1a1Id = thread1a1.id;

  const actors1a1 = thread1a1.actors;

  // send messages
  await account1PublicClient.replyInThread(topic1a1Id, thread1a1Id, {
    text: 'Hello',
    actorId: actors1a1[0].id,
    providerId: actors1a1[0].providers[0].id,
    templateName: "",
    templateParams: {},
  });
  await account1PublicClient.replyInThread(topic1a1Id, thread1a1Id, {
    text: 'Hello there',
    actorId: actors1a1[1].id,
    providerId: actors1a1[1].providers[0].id,
    templateName: "",
    templateParams: {},
  });

  const messages1a1 = await account1PublicClient.getTopicMessages(thread1a1Id, topic1a1Id);
  if (messages1a1.length !== 2) {
    throw new Error('Expected 2 messages');
  }

}

testE2E().then(() => {
  console.log('E2E tests passed');
});