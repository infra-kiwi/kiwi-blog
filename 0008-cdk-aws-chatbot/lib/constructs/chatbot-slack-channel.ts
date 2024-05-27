/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { Construct } from 'constructs';
import {
  Arn,
  aws_chatbot,
  aws_logs,
  aws_sns,
  CfnOutput,
  Stack
} from 'aws-cdk-lib';

export interface ChatBotSlackChannelProps {
  /**
   The id of the Slack workspace: you can find it in
   the AWS ChatBot console page, in the list of
   "Configured clients", by opening the page relative
   to your configured Slack workspace.

   https://console.aws.amazon.com/chatbot/home
   */
  slackWorkspaceId: string;

  /**
   The id of the Slack channel, which you can find by
   right-clicking in Slack, on a channel name and
   copying its link. The channel id will be at the end
   of the link.

   E.g. https://myworkspace.slack.com/archives/C6V5ZGZ60 -> C6V5ZGZ60
   */
  slackChannelId: string;
}

export class ChatBotSlackChannel extends Construct {
  // Create and export an SNS topic we can use to send messages
  // to the Slack channel using the AWS ChatBot native payload
  readonly topicArn: string;
  readonly topic: aws_sns.Topic;

  constructor(scope: Construct, id: string, props: ChatBotSlackChannelProps) {
    super(scope, `${ChatBotSlackChannel.name}-${id}`);

    const topicName = `${Stack.of(this).stackName}-chatbot-raw-${props.slackWorkspaceId}-${props.slackChannelId}`;
    // Pre-define the topic ARN in a way that doesn't tie us to the
    // generated CDK resource
    this.topicArn = Arn.format(
      {
        service: 'sns',
        resource: topicName
      },
      Stack.of(this)
    );
    this.topic = new aws_sns.Topic(this, 'SNSTopic', {
      topicName
    });
    new CfnOutput(this, 'TopicArn', {
      value: this.topicArn
    });

    const channelConfig = new aws_chatbot.SlackChannelConfiguration(
      this,
      'SlackChannel',
      {
        slackChannelConfigurationName: `slack-${props.slackWorkspaceId}-${props.slackChannelId}`,

        slackWorkspaceId: props.slackWorkspaceId,
        slackChannelId: props.slackChannelId,

        notificationTopics: [this.topic],

        // It's always good to have logs!
        loggingLevel: aws_chatbot.LoggingLevel.INFO,
        logRetention: aws_logs.RetentionDays.ONE_MONTH
      }
    );
    new CfnOutput(this, 'ConfigurationUrl', {
      value: [
        `https://console.aws.amazon.com/chatbot/home?`,
        `#/chat-clients/slack/workspaces/${props.slackWorkspaceId}`,
        `/configurations/${channelConfig.slackChannelConfigurationName}`
      ].join('')
    });
  }
}
