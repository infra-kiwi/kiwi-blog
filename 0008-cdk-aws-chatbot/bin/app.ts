/*
 * Copyright (c) 2024-2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import { ChatBotStack } from '../lib/stack';

import { name as projectName } from '../package.json';
import { loadConfig } from '../lib/util/config';

// https://docs.aws.amazon.com/cdk/v2/guide/environments.html
// Use the current environment variables to figure out which account
// and region we want to deploy to
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

const app = new cdk.App();

// Accepts the `-c configFile=my-config.yml` parameter, or
// defaults to a common file name
const configFile = app.node.tryGetContext('configFile') ?? 'config.yml';

async function createStack(app: cdk.App) {
  const config = await loadConfig(configFile);

  new ChatBotStack(app, projectName, {
    env,
    config
  });
}

void createStack(app);
