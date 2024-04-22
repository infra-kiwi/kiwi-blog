import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NotificationGroup } from './constructs-good-name/notification-group';
import { SNSTopicWrapper } from './constructs-good-name/sns-topic-wrapper';

export class StackGoodName extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new SNSTopicWrapper(this, 'NotificationsFunFacts');

    new NotificationGroup(this, 'Default');
    new NotificationGroup(this, 'TeamInfra');
  }
}
