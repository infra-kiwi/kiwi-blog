#!/usr/bin/env node

/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';

import { name as projectName } from '../package.json';
import { StackGoodName } from '../lib/stack-good-name';
import { StackBadName } from '../lib/stack-bad-name';

// https://docs.aws.amazon.com/cdk/v2/guide/environments.html
// Use the current environment variables to figure out which account
// and region we want to deploy to
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

const app = new cdk.App();

new StackGoodName(app, projectName + '-good-name', { env });

new StackBadName(app, projectName + '-bad-name', { env });
