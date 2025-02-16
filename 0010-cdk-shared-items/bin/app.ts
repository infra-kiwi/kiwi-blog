/*
 * Copyright (c) 2024-2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import { ProducerStack } from '../lib/producer-stack';

import { name as projectName } from '../package.json';
import { EventsStack } from '../lib/events-stack';
import { ConsumerStack } from '../lib/consumer-stack';

// https://docs.aws.amazon.com/cdk/v2/guide/environments.html
// Use the current environment variables to figure out which account
// and region we want to deploy to
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

const app = new cdk.App();

new EventsStack(app, `${projectName}-events`, { env });
new ProducerStack(app, `${projectName}-producer`, { env });
new ConsumerStack(app, `${projectName}-consumer`, { env });
