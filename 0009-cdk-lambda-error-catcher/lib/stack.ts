import * as cdk from 'aws-cdk-lib';
import { aws_lambda, CfnOutput, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'node:path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ErrorCatcherLambda } from './constructs/error-catcher-lambda';
import { LoggingFormat } from 'aws-cdk-lib/aws-lambda';

export type KiwiStackProps = cdk.StackProps & {
  // Expects an SNS topic that accepts a {title,body} payload, like the one configured in
  // https://blog.infra.kiwi/aws-cdk-a-slack-notification-pipeline-via-aws-chatbot-0e0c76e7f4c3
  errorCatcherSNSTopicArn?: string;
};

export class KiwiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: KiwiStackProps) {
    super(scope, id, props);

    // Define our error catcher Lambda, which will listen
    // for error messages in logs
    const errorCatcherLambda = new ErrorCatcherLambda(this, 'Catch', {
      snsTopicArn: props.errorCatcherSNSTopicArn
    });

    // Define a test Lambda that will generate errors and log
    // them using the default TEXT format (props not specified)
    const lambdaWithTextLogs = new NodejsFunction(this, 'TestLambdaTextLogs', {
      functionName: Stack.of(this).stackName + 'test-lambda-text',
      entry: path.join(__dirname, 'lambda/test.ts'),
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      bundling: {
        externalModules: ['@aws-sdk/*'],
        minify: false
      },
      // The Lambda entrypoint name
      handler: 'index.handler'
    });
    new CfnOutput(this, 'TestLambdaTextLogsFunctionName', {
      value: lambdaWithTextLogs.functionName
    });

    // Creates a subscription filter for the LogGroup of the lambdaWithTextLogs
    // function and forwards all errors to the errorCatcherLambda
    errorCatcherLambda.registerErrorCatcher(lambdaWithTextLogs);

    // Define a test Lambda that will generate errors and log
    // them using the JSON format
    const lambdaWithJSONLogs = new NodejsFunction(this, 'TestLambdaJSONLogs', {
      functionName: Stack.of(this).stackName + 'test-lambda-json',
      entry: path.join(__dirname, 'lambda/test.ts'),
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      bundling: {
        externalModules: ['@aws-sdk/*'],
        minify: false
      },
      // The Lambda entrypoint name
      handler: 'index.handler',
      // Define the JSON format for logs
      loggingFormat: LoggingFormat.JSON
    });
    new CfnOutput(this, 'TestLambdaJSONLogsFunctionName', {
      value: lambdaWithJSONLogs.functionName
    });

    // Creates a subscription filter for the LogGroup of the lambdaWithJSONLogs
    // function and forwards all errors to the errorCatcherLambda
    errorCatcherLambda.registerErrorCatcher(lambdaWithJSONLogs);
  }
}
