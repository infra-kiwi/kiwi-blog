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
new KiwiStack(app, projectName, { env });
