/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import { aws_kms, aws_sns, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class KiwiStack extends cdk.Stack {
  readonly topic: aws_sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use the default AWS-provided SNS KMS key
    const awsSNSKey = aws_kms.Alias.fromAliasName(
      this,
      'AWSManagedSNSKey',
      'alias/aws/sns'
    );

    this.topic = new aws_sns.Topic(this, 'MyTopic', {
      masterKey: awsSNSKey
    });
    new CfnOutput(this, 'MyTopicArn', {
      value: this.topic.topicArn
    });
  }
}
