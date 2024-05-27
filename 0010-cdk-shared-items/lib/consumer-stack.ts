/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import {
  aws_events,
  aws_events_targets,
  aws_lambda,
  aws_lambda_nodejs,
  CfnOutput,
  Stack
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'node:path';
import { getSharedItem } from './util/shared';
import { LoggingFormat } from 'aws-cdk-lib/aws-lambda';

export class ConsumerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // https://medium.com/infrakiwi/aws-cdk-the-easy-node-js-lambda-ec4dc0d60807
    const lambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'ConsumerLambda',
      {
        functionName: `${Stack.of(this).stackName}-lambda`,
        entry: path.join(__dirname, './lambda/consumer.ts'),
        runtime: aws_lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        bundling: {
          externalModules: ['@aws-sdk/*']
        },
        loggingFormat: LoggingFormat.JSON
      }
    );
    new CfnOutput(this, 'ConsumerLambdaName', {
      value: lambda.functionName
    });
    new CfnOutput(this, 'ConsumerLambdaLogGroupName', {
      value: lambda.logGroup.logGroupName
    });

    // Define a rule that forwards all events created by the ProducerLambda
    // to the ConsumerLambda
    const rule = new aws_events.Rule(this, 'RuleConsumer', {
      // Use the shared EventBus
      eventBus: getSharedItem('eventBusShared'),
      eventPattern: {
        source: ['ProducerLambda']
      }
    });
    rule.addTarget(new aws_events_targets.LambdaFunction(lambda));
  }
}
