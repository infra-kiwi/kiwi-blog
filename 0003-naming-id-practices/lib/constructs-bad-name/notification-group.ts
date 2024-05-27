/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { Construct } from 'constructs';
import { SNSTopicWrapper } from './sns-topic-wrapper';

export class NotificationGroup extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new SNSTopicWrapper(this, 'InfraNotifications');
    new SNSTopicWrapper(this, 'SlackMessages');
  }
}
