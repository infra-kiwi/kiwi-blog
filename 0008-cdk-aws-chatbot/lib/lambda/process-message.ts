import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import * as util from 'node:util';
import {
  ChatBotPayload,
  SlackMessagePayload,
  SNSEvent
} from './process-message.types';

const { SNS_TOPIC_ARN } = process.env;
if (!SNS_TOPIC_ARN) {
  throw new Error('Missing SNS_TOPIC_ARN env var');
}

const snsClient = new SNSClient({
  region: SNS_TOPIC_ARN.split(':')[3]
});

export const handler = async (event: SNSEvent) => {
  console.log(`Received event: ${util.inspect(event, { depth: null })}`);

  // https://aws.amazon.com/sns/faqs/
  // Q: Will a notification contain more than one message?
  // No, all notification messages will contain a single published message.
  const record = event.Records[0];

  return await processSNSRecord(record);
};

async function processSNSRecord(record: SNSEvent['Records'][number]) {
  // If we have a subject, expect a plan subject/message string pair
  if (record.Sns.Subject) {
    return await sendMessage({
      title: record.Sns.Subject,
      body: record.Sns.Message
    });
  }

  // Map the SNS message to our custom payload
  let payload: SlackMessagePayload;

  // Try to treat the SNS message as a JSON-encoded string,
  // otherwise treat it as a plain message
  try {
    const parsed = JSON.parse(record.Sns.Message);
    if (!('body' in parsed)) {
      throw new Error('Not a valid message payload');
    }
    payload = parsed;
  } catch (err) {
    console.debug('Failed to JSON-parse SNS message', err);
    payload = {
      body: record.Sns.Message
    };
  }

  return await sendMessage(payload);
}

async function sendMessage(payload: SlackMessagePayload) {
  const { title, body } = payload;

  const message: ChatBotPayload = {
    version: '1.0',
    source: 'custom',
    content: {
      title,
      description: body
    }
  };

  console.log(
    `Publishing message to ${SNS_TOPIC_ARN}: ${util.inspect(message, { depth: null })}`
  );

  return await snsClient.send(
    new PublishCommand({
      TopicArn: SNS_TOPIC_ARN,
      Message: JSON.stringify(message)
    })
  );
}
