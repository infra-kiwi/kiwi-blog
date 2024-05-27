/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NotificationGroup } from './constructs-bad-name/notification-group';
import { SNSTopicWrapper } from './constructs-bad-name/sns-topic-wrapper';

export class StackBadName extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new SNSTopicWrapper(this, 'NotificationsFunFacts');

    new NotificationGroup(this, 'Default');
    new NotificationGroup(this, 'TeamInfra');
  }
}
