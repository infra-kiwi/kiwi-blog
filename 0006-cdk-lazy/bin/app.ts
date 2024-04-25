#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { KiwiStack } from '../lib/stack';

import { name as projectName } from '../package.json';

const app = new cdk.App();
new KiwiStack(app, projectName, {
  // Use the current environment variables to figure out which account
  // and region we want to deploy to
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});
