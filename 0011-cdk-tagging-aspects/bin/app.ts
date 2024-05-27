#!/usr/bin/env node

/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { KiwiStack } from '../lib/stack';

import { name as projectName } from '../package.json';
import { addAspects } from '../lib/aspects';

// https://docs.aws.amazon.com/cdk/v2/guide/environments.html
// Use the current environment variables to figure out which account
// and region we want to deploy to
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

const app = new cdk.App();
const doNotAddRequiredTags =
  app.node.tryGetContext('doNotAddRequiredTags') === 'true';

async function main() {
  new KiwiStack(app, projectName, {
    env
  });

  await addAspects(app, {
    // Debug which resources we're visiting in the aspects
    debug: true,
    // Add some forced tags to all CDK resources
    forcedTags: {
      MyTag: 'this-is-a-forced-tag',
      ...(doNotAddRequiredTags
        ? {}
        : {
            MyRequiredTag: 'this-is-a-required-tag'
          })
    }
  });
}

void main();
