import { Construct } from 'constructs';
import { Topic } from 'aws-cdk-lib/aws-sns';

export class SNSTopicWrapper extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new Topic(this, 'Topic');
  }
}
