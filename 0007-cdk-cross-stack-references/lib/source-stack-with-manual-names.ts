/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_sns, Stack } from 'aws-cdk-lib';

export class SourceStackWithManualNames extends cdk.Stack {
  readonly topicName: string;

  // Expose for testing
  readonly topic: aws_sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a topic with a name of our choice and export the name
    this.topicName = Stack.of(this).stackName + '-topic-with-a-name';

    this.topic = new aws_sns.Topic(this, 'TopicWithAName', {
      topicName: this.topicName
    });
  }
}
