#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { KiwiStack } from '../lib/stack';

import { name as projectName } from '../package.json';
import { getSynthesizer } from '../lib/synthesizer';

const app = new cdk.App();

async function main() {
  new KiwiStack(app, projectName, {
    // Use the current environment variables to figure out which account
    // and region we want to deploy to
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION
    },

    // Use our custom tagging synthesizer
    synthesizer: await getSynthesizer()
  });
}

void main();
