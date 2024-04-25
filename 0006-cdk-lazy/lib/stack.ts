import * as cdk from 'aws-cdk-lib';
import { aws_sns, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { MultiLineParameter } from './multi-line-parameter';

export class KiwiStack extends cdk.Stack {
  readonly topic: aws_sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myParameter = new MultiLineParameter(this, 'MyParameter', {
      parameterName: Stack.of(this).stackName + '-my-parameter'
    });

    // Populate the lines of our multi-line parameter
    myParameter.addLine("It's not DNS");
    myParameter.addLine("There's no way it's DNS");
    myParameter.addLine('It was DNS');

    // Add a dynamic line that depends on another CDK resource's value
    const aTopicAboutDNS = new aws_sns.Topic(this, 'ATopicAboutDNS');
    myParameter.addLine(
      `Here is a topic about DNS: ${aTopicAboutDNS.topicArn}`
    );
    this.topic = aTopicAboutDNS;
  }
}
