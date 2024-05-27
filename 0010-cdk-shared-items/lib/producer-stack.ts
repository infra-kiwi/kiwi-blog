/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import { aws_lambda, aws_lambda_nodejs, CfnOutput, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'node:path';
import { getSharedItem } from './util/shared';

/*
Defines a Lambda function that generates an EventBridge event on demand
 */
export class ProducerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Use the shared EventBus as a destination for new events
    const eventBus = getSharedItem('eventBusShared');

    // https://medium.com/infrakiwi/aws-cdk-the-easy-node-js-lambda-ec4dc0d60807
    const lambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'ProducerLambda',
      {
        functionName: `${Stack.of(this).stackName}-lambda`,
        entry: path.join(__dirname, './lambda/producer.ts'),
        runtime: aws_lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        bundling: {
          externalModules: ['@aws-sdk/*']
        },
        environment: {
          // Pass the EventBus name to the function, so that
          // the function can put events to it
          EVENT_BUS_NAME: eventBus.eventBusName
        }
      }
    );
    new CfnOutput(this, 'ProducerLambdaName', {
      value: lambda.functionName
    });

    // Add the right IAM perms for the Lambda function to put events
    // to the core EventBus
    eventBus.grantPutEventsTo(lambda);
  }
}
