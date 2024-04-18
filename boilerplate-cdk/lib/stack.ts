import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_sns } from 'aws-cdk-lib';

export class KiwiStack extends cdk.Stack {
  readonly topic: aws_sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.topic = new aws_sns.Topic(this, 'MyTopic');
  }
}
