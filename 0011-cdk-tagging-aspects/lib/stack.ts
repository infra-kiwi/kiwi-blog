/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import { aws_sns, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class KiwiStack extends cdk.Stack {
  readonly topic: aws_sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.topic = new aws_sns.Topic(this, 'MyTopic');

    // Define an output for debugging purposes
    new CfnOutput(this, 'MyTopicArnOutput', {
      value: this.topic.topicArn
    });
  }
}
