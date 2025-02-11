/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';

// Use the AWS SDK to get the current caller
// NOTE: requires some AWS credentials to be loaded in the environment

const client = new STSClient();

const identity = await client.send(new GetCallerIdentityCommand());

echo`My identity: ${identity.Arn}`;
