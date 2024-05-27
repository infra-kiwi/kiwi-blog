/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { ChatBotStack } from '../lib/stack';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

test('ChatBotStack', async () => {
  const app = new App();

  // Init stack
  const stack = new ChatBotStack(app, 'Test', {
    config: {
      notificationChannels: {
        'my-channel': {
          slackWorkspaceId: 'T1234',
          slackChannelId: 'C1234'
        },
        'my-channel-2': {
          slackWorkspaceId: 'T1234',
          slackChannelId: 'C5678'
        },
        'my-channel-3': {
          // Repeated workspace/channel pair
          slackWorkspaceId: 'T1234',
          slackChannelId: 'C1234'
        }
      }
    }
  });

  // Prepare for assertions
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  template.resourceCountIs(
    'AWS::SNS::Topic',
    // 2 ChatBot + 3 ingestion
    5
  );
  // Own lambda + ChatBot log retention lambda
  template.resourceCountIs(
    'AWS::Lambda::Function',
    // 1 ChatBot log retention + 3 ingestion
    4
  );
});
