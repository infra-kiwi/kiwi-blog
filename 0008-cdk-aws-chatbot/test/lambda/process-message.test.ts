import { ChatBotPayload } from '../../lib/lambda/process-message.types';
import { mockClient } from 'aws-sdk-client-mock';
import {
  PublishCommand,
  PublishCommandOutput,
  SNSClient
} from '@aws-sdk/client-sns';
import { PublishCommandInput } from '@aws-sdk/client-sns/dist-types/commands/PublishCommand';

const snsMock = mockClient(SNSClient);

describe('process-message.ts Lambda', () => {
  // Prepare the environment for the Lambda function
  beforeEach(() => {
    // Fake ARN
    process.env.SNS_TOPIC_ARN =
      'arn:aws:sns:my-region:123456789012:chatbot-my-channel';

    snsMock.reset();
  });

  test('accepts an SNS payload with a plain text message', async () => {
    const snsPayload = require('../assets/sns_event_message_subject.json');

    let chatBotSNSInput: PublishCommandInput | undefined;
    snsMock.on(PublishCommand).callsFakeOnce((input: PublishCommandInput) => {
      chatBotSNSInput = input;
      const result: PublishCommandOutput = {
        MessageId: 'fake',
        $metadata: {}
      };
      return result;
    });

    const result = await require('../../lib/lambda/process-message').handler(
      snsPayload
    );
    expect(result.MessageId).toEqual('fake');

    {
      expect(chatBotSNSInput?.Message).not.toBeUndefined();
      const parsed = JSON.parse(chatBotSNSInput!.Message!) as ChatBotPayload;
      expect(parsed.content.title).toEqual('Hello world!');
      expect(parsed.content.description).toEqual('What a pretty day 🌻');
    }
  });

  test('accepts an SNS payload with a JSON-formatted message', async () => {
    const snsPayload = require('../assets/sns_event_message_json.json');

    let chatBotSNSInput: PublishCommandInput | undefined;
    snsMock.on(PublishCommand).callsFakeOnce((input: PublishCommandInput) => {
      chatBotSNSInput = input;
      const result: PublishCommandOutput = {
        MessageId: 'fake',
        $metadata: {}
      };
      return result;
    });

    const result = await require('../../lib/lambda/process-message').handler(
      snsPayload
    );
    expect(result.MessageId).toEqual('fake');

    {
      expect(chatBotSNSInput?.Message).not.toBeUndefined();
      const parsed = JSON.parse(chatBotSNSInput!.Message!) as ChatBotPayload;
      expect(parsed.content.title).toEqual('Hello world!');
      expect(parsed.content.description).toEqual('What a pretty day 🌻');
    }
  });
});
