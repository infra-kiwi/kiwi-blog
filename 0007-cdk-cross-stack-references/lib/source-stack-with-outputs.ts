import * as cdk from 'aws-cdk-lib';
import { aws_sns } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class SourceStackWithOutputs extends cdk.Stack {
  readonly topic: aws_sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.topic = new aws_sns.Topic(this, 'MyTopic');
  }
}
