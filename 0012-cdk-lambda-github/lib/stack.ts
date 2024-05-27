/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from "aws-cdk-lib";
import {
  aws_apigateway,
  aws_lambda,
  aws_lambda_nodejs,
  aws_secretsmanager,
  CfnOutput,
  Duration,
  Stack,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import path from "node:path";
import {
  secretNameGitHubAppId,
  secretNameGitHubAppInstallationId,
  secretNameGitHubPrivateKey,
} from "./lambda/common-secret";

export class KiwiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a GitHub webhook token. This secret will be automatically
    // filled by Secrets Manager with a random string
    const webhookToken = new aws_secretsmanager.Secret(
      this,
      "GitHubWebhookToken",
      {
        secretName: `${Stack.of(this).stackName}-webhook-token`,
      },
    );
    new CfnOutput(this, "GitHubWebHookTokenSecretName", {
      value: webhookToken.secretName,
    });

    // Define the webhook handler lambda function
    const webhookLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      "GitHubWebHookLambda",
      {
        functionName: `${Stack.of(this).stackName}-webhook-lambda`,
        entry: path.join(__dirname, "lambda/pr-love.ts"),
        runtime: aws_lambda.Runtime.NODEJS_20_X,
        handler: "index.handler",
        bundling: {
          externalModules: ["@aws-sdk/*"],
        },
        environment: {
          GITHUB_WEBHOOK_TOKEN_SECRET_NAME: webhookToken.secretName,
        },
        // When we interact with the GitHub API, be prepared for longer
        // waiting times!
        timeout: Duration.seconds(10),
      },
    );

    // Grant access to all the various secrets
    webhookToken.grantRead(webhookLambda);
    [
      secretNameGitHubAppId,
      secretNameGitHubAppInstallationId,
      secretNameGitHubPrivateKey,
    ].forEach((secretName) =>
      aws_secretsmanager.Secret.fromSecretNameV2(
        this,
        `Secret-${secretName}`,
        secretName,
      ).grantRead(webhookLambda),
    );

    // Create a new API gateway, which will be the entrypoint for our webhooks
    const gateway = new aws_apigateway.RestApi(this, "GitHubWebHookGateway");

    // Create the webhook handler route /webhook
    const webhook = gateway.root
      .addResource("webhook")
      .addMethod("POST", new aws_apigateway.LambdaIntegration(webhookLambda));

    new CfnOutput(this, "GitHubWebHookUrl", {
      value: gateway.urlForPath(webhook.resource.path),
    });
  }
}
