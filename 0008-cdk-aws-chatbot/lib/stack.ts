/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ChatBotSlackChannel } from './constructs/chatbot-slack-channel';
import { PostToSlack } from './constructs/post-to-slack';
import { Config } from './util/config';

export type ChatBotStackProps = cdk.StackProps & {
  config: Config;
};

export class ChatBotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ChatBotStackProps) {
    super(scope, id, props);

    const chatBotSlackChannels: Record<string, ChatBotSlackChannel> = {};

    // Create all the possible ChatBot channel configurations. To do so,
    // extract all available Slack workspace/channel pairs, deduplicate them,
    // and create a ChatBotSlackChannel for each
    const slackChannelEntries = Array.from(
      new Set(
        Object.entries(props.config.notificationChannels).map(([, v]) =>
          JSON.stringify([v.slackWorkspaceId, v.slackChannelId])
        )
      )
    ).map((e) => JSON.parse(e)) as [string, string][];

    for (const entry of slackChannelEntries) {
      const [slackWorkspaceId, slackChannelId] = entry;

      // Configure the channel
      const channel = new ChatBotSlackChannel(
        this,
        `ChatBotSlackChannel-${slackWorkspaceId}-${slackChannelId}`,
        {
          slackWorkspaceId,
          slackChannelId
        }
      );
      chatBotSlackChannels[JSON.stringify(entry)] = channel;
    }

    // Create all the PostToSlack instances, which will accept our custom payloads
    // and translate them into ChatBot-formatted ones
    for (const notificationChannelName in props.config.notificationChannels) {
      const config = props.config.notificationChannels[notificationChannelName];

      // Use the previously-generated Slack channel configuration
      const chatBotSlackChannel =
        chatBotSlackChannels[
          JSON.stringify([config.slackWorkspaceId, config.slackChannelId])
        ];

      new PostToSlack(this, `SlackLambda-${notificationChannelName}`, {
        chatbotSNSTopicArn: chatBotSlackChannel.topicArn,
        notificationChannelName
      });
    }
  }
}
