import * as cdk from 'aws-cdk-lib';
import { Aws, aws_iam, aws_lambda, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'node:path';
import {
  AuthorizationType,
  EndpointType,
  LambdaIntegration,
  RestApi
} from 'aws-cdk-lib/aws-apigateway';
import {
  AccountPrincipal,
  PolicyDocument,
  PolicyStatement
} from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export type ServerStackProps = cdk.StackProps & {
  // The AWS account id of the client account
  allowedPrincipals: aws_iam.IPrincipal[];
};

/**
 * This Stack defines the API Gateway and the Server Lambda
 */
export class ServerStack extends cdk.Stack {
  readonly id: string;
  readonly props: ServerStackProps;
  readonly apiGatewayPolicy: PolicyDocument;
  readonly apiGateway: RestApi;

  constructor(scope: Construct, id: string, props: ServerStackProps) {
    super(scope, id, props);
    this.id = id;
    this.props = props;

    // Define the IAM policy that will allow clients to send
    // requests to this API Gateway via IAM
    this.apiGatewayPolicy = new PolicyDocument({
      statements: [
        new PolicyStatement({
          actions: ['execute-api:Invoke'],
          // By default, allow all invocations from inside the Server account
          principals: [new AccountPrincipal(Aws.ACCOUNT_ID)]
        })
      ]
    });

    // Define the API Gateway resource
    this.apiGateway = new RestApi(this, 'Gateway', {
      endpointTypes: [EndpointType.REGIONAL],
      policy: this.apiGatewayPolicy
    });

    // Export the API Gateway url and region, which we can then
    // use in the client function
    new CfnOutput(this, 'ServerGatewayUrl', {
      value: this.apiGateway.url
    });
    new CfnOutput(this, 'ServerGatewayRegion', {
      value: Aws.REGION
    });

    // Define all the routes
    this.#renderLambdaRoute();
  }

  #renderLambdaRoute() {
    // Define the Server Lambda function
    const lambda = new NodejsFunction(this, 'ServerLambda', {
      functionName: `${this.id}-server-lambda`,
      entry: path.join(__dirname, '..', 'lambda', 'server.ts'),
      runtime: aws_lambda.Runtime.NODEJS_20_X,
      // The Lambda entrypoint name
      handler: 'index.handler',
      bundling: {
        externalModules: ['@aws-sdk/*'],
        minify: false
      }
    });

    const routePath = 'my-lambda';

    // Add the Server Lambda function as a target in the API Gateway, exposed under
    // the `/my-lambda` path with a GET method
    const resource = this.apiGateway.root.addResource(routePath);
    resource.addMethod('POST', new LambdaIntegration(lambda), {
      // Require the HTTP calls to be IAM-authorized
      authorizationType: AuthorizationType.IAM
    });

    // Compose the ARN of the Server Lambda route
    // See https://docs.aws.amazon.com/apigateway/latest/developerguide/arn-format-reference.html
    const routeArn = `arn:aws:execute-api:${Aws.REGION}:${Aws.ACCOUNT_ID}:*/*/POST/${routePath}`;
    // Alternatively, if you want to allow access to ALL API Gateway routes
    // const routeArn = `arn:aws:execute-api:${Aws.REGION}:${Aws.ACCOUNT_ID}:*`;

    // Allow the access to this route from the desired principals
    // (e.g., the client account or organization)
    this.apiGatewayPolicy.addStatements(
      new PolicyStatement({
        principals: this.props.allowedPrincipals,
        actions: ['execute-api:Invoke'],
        resources: [routeArn]
      })
    );
  }
}
