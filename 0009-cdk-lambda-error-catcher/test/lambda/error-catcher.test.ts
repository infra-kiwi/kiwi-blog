import { mockClient } from 'aws-sdk-client-mock';
import {
  PublishCommand,
  PublishCommandInput,
  PublishCommandOutput,
  SNSClient
} from '@aws-sdk/client-sns';
import { CloudWatchLogsLogEvent } from 'aws-lambda';

const snsMock = mockClient(SNSClient);

describe('error-catcher.ts Lambda', () => {
  // Prepare the environment for the Lambda function
  beforeEach(() => {
    // Fake ARN
    process.env.ERRORS_SNS_TOPIC_ARN =
      'arn:aws:sns:my-region:123456789012:chatbot-my-channel';
    process.env.AWS_REGION = 'us-east-1';

    snsMock.reset();
  });

  test('accepts a CloudWatch log message', async () => {
    const payload = require('../assets/cloudwatch_log.json');

    let snsInput: PublishCommandInput | undefined;
    snsMock.on(PublishCommand).callsFakeOnce((input: PublishCommandInput) => {
      snsInput = input;
      const result: PublishCommandOutput = {
        MessageId: 'fake',
        $metadata: {}
      };
      return result;
    });

    await require('../../lib/lambda/error-catcher').handler(payload);

    {
      expect(snsInput?.Message).not.toBeUndefined();
      expect(JSON.parse(snsInput!.Message!)).toMatchSnapshot();
    }
  });

  const prettifyCases: {
    event: CloudWatchLogsLogEvent;
    expected: string;
  }[] = [
    {
      event: require('../assets/cloudwatch_event_text.json').logEvents[0],
      expected: ''
    },
    {
      event: require('../assets/cloudwatch_event_json.json').logEvents[0],
      expected: ''
    }
  ];

  test.each(prettifyCases)('prettifies correctly the messages (%#)', (t) => {
    expect(
      require('../../lib/lambda/error-catcher').prettifyError(
        t.event,
        'https://mylogs.com'
      )
    ).toMatchSnapshot();
  });
});
