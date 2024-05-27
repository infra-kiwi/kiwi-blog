/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import { aws_sns, aws_ssm, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class SourceStackWithParameters extends cdk.Stack {
  readonly parameterName: string;

  // Expose for testing
  readonly topic: aws_sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an SNS topic with a randomly generate name, and store
    // the name in the SSM parameter
    this.topic = new aws_sns.Topic(this, 'Topic', {});

    // Create a SSM parameter name of our choice and export the SNS topic ARN
    // This will become: SourceStackWithParameters-topic-arn
    this.parameterName = Stack.of(this).stackName + '-topic-arn';
    new aws_ssm.StringParameter(this, 'TopicForAlarms', {
      parameterName: this.parameterName,
      stringValue: this.topic.topicArn
    });
  }
}
