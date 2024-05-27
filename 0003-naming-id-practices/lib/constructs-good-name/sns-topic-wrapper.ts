/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { Construct } from 'constructs';
import { Topic } from 'aws-cdk-lib/aws-sns';

export class SNSTopicWrapper extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, `${SNSTopicWrapper.name}-${id}`);

    new Topic(this, 'Topic');
  }
}
