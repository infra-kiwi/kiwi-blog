#!/usr/bin/env node

/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import { KiwiStack } from '../lib/stack';

import { name as projectName } from '../package.json';

// https://docs.aws.amazon.com/cdk/v2/guide/environments.html
// Use the current environment variables to figure out which account
// and region we want to deploy to
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

const app = new cdk.App();

// [OPTIONAL] Expects an SNS topic that accepts a {title,body} payload, like the one configured in
// https://blog.infra.kiwi/aws-cdk-a-slack-notification-pipeline-via-aws-chatbot-0e0c76e7f4c3
const errorCatcherSNSTopicArn = app.node.tryGetContext(
  'errorCatcherSNSTopicArn'
);

new KiwiStack(app, projectName, { env, errorCatcherSNSTopicArn });
