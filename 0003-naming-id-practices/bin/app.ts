#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';

import { name as projectName } from '../package.json';
import { StackGoodName } from '../lib/stack-good-name';
import { StackBadName } from '../lib/stack-bad-name';

const app = new cdk.App();

new StackGoodName(app, projectName + '-good-name', {
  // Use the current environment variables to figure out which account
  // and region we want to deploy to
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});

new StackBadName(app, projectName + '-bad-name', {
  // Use the current environment variables to figure out which account
  // and region we want to deploy to
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});
