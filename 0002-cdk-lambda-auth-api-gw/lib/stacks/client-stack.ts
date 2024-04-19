import * as cdk from 'aws-cdk-lib';
import { aws_iam, aws_lambda, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'node:path';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect } from 'aws-cdk-lib/aws-iam';

export type ClientStackProps = cdk.StackProps & {
  serverGatewayUrl: string;
  serverGatewayRegion: string;
};

/**
 * This Stack defines the API Gateway and the Client Lambda
 */
export class ClientStack extends cdk.Stack {
  readonly props: ClientStackProps;

  constructor(scope: Construct, id: string, props: ClientStackProps) {
    super(scope, id, props);
    this.props = props;

    // Define the Client Lambda function
    const lambda = new NodejsFunction(this, 'ClientLambda', {
      functionName: `${id}-client-lambda`,
      entry: path.join(__dirname, '..', 'lambda', 'client.ts'),
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      bundling: {
        externalModules: ['@aws-sdk/*'],
        minify: false
      },
      // The Lambda entrypoint name
      handler: 'index.handler',

      // Pass the server gateway info as env vars
      environment: {
        SERVER_GATEWAY_URL: props.serverGatewayUrl,
        SERVER_GATEWAY_REGION: props.serverGatewayRegion
      }
    });
    // Allow the lambda to make API Gateway calls in general
    // NOTE: This should be scoped more properly for any production deployment!
    lambda.addToRolePolicy(
      new aws_iam.PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['execute-api:Invoke'],
        resources: ['*']
      })
    );

    // Record the name for ease of usage of the example
    new CfnOutput(this, 'ClientLambdaFunctionName', {
      value: lambda.functionName
    });
  }
}
