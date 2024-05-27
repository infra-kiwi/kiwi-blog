/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  aws_iam,
  aws_lambda,
  aws_logs,
  aws_logs_destinations,
  CfnOutput,
  Stack
} from 'aws-cdk-lib';
import path from 'node:path';
import { CfnFunction } from 'aws-cdk-lib/aws-lambda';
import { Effect } from 'aws-cdk-lib/aws-iam';

export interface ErrorCatcherLambdaProps {
  // The SNS topic where to send notifications about errors
  // Expects an SNS topic that accepts a {title,body} payload,
  // like the one configured in
  // https://blog.infra.kiwi/aws-cdk-a-slack-notification-pipeline-via-aws-chatbot-0e0c76e7f4c3
  snsTopicArn?: string;
}

export class ErrorCatcherLambda extends Construct {
  readonly errorCatcherLambda: aws_lambda.Function;

  constructor(scope: Construct, id: string, props?: ErrorCatcherLambdaProps) {
    super(scope, `${ErrorCatcherLambda.name}-${id}`);

    // Define our error catcher Lambda, which will listen
    // for errors-in-logs events
    this.errorCatcherLambda = new NodejsFunction(this, 'ErrorCatcherLambda', {
      functionName: Stack.of(this).stackName + '-' + this.node.id,
      entry: path.join(__dirname, '../lambda/error-catcher.ts'),
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      bundling: {
        externalModules: ['@aws-sdk/*'],
        minify: false
      },
      // The Lambda entrypoint name
      handler: 'index.handler',
      environment: {
        // If provided, pass the SNS topic arn
        ...(props?.snsTopicArn
          ? { ERRORS_SNS_TOPIC_ARN: props?.snsTopicArn }
          : {})
      }
    });

    // If an SNS topic is configured, allow publishing messages to it
    if (props?.snsTopicArn) {
      this.errorCatcherLambda.addToRolePolicy(
        new aws_iam.PolicyStatement({
          actions: ['sns:Publish'],
          effect: Effect.ALLOW,
          resources: [props.snsTopicArn]
        })
      );
    }

    new CfnOutput(this, 'ErrorCatcherLambdaFunctionName', {
      value: this.errorCatcherLambda.functionName
    });
    new CfnOutput(this, 'ErrorCatcherLambdaLogGroupName', {
      value: this.errorCatcherLambda.logGroup.logGroupName
    });
  }

  /**
   * Registers an error-catching filter on the specified LogGroup, which will
   * generate notifications containing details about the various errors being
   * thrown.
   *
   * @param lambda The Lambda function for which to enable error catching
   */
  registerErrorCatcher(lambda: aws_lambda.Function) {
    // https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatchlogs.html
    // Define the right filter pattern, depending on which logging format
    // the Lambda function uses.
    let filterPattern: aws_logs.IFilterPattern;

    // Evaluate the logging configuration of the Lambda function.
    // This is guaranteed to work only for Lambda functions defined using the
    // standard AWS CDK Lambda constructs. It may break with custom ones.
    if (
      (
        (lambda.node.findChild('Resource') as CfnFunction)
          ?.loggingConfig as CfnFunction.LoggingConfigProperty
      )?.logFormat === 'JSON'
    ) {
      // The filter will expect a JSON format, and will look for the
      // ERROR level
      filterPattern = aws_logs.FilterPattern.stringValue(
        '$.level',
        '=',
        'ERROR'
      );
    } else {
      // (DEFAULT) The filter will check for a line to have this format:
      // ISO_TIME	REQUEST_UUID	ERROR	The error message
      // 2024-05-03T02:58:35.334Z	00120b31-9948-4b45-a6fb-8b967e7153ec	ERROR I failed!
      filterPattern = aws_logs.FilterPattern.literal(
        '%^[T:Z\\d.-]+\\t[\\w-]+\\tERROR%'
      );
    }

    // Create the log group subscription, which will intercept all ERROR values being thrown
    lambda.logGroup.addSubscriptionFilter('ErrorCatcher', {
      filterPattern,
      destination: new aws_logs_destinations.LambdaDestination(
        this.errorCatcherLambda
      )
    });
  }
}
