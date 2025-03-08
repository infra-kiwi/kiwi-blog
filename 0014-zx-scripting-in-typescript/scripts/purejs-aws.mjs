/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';
import * as sts from '@aws-sdk/client-sts';

// You can invoke this script remotely with
// npx zx --install https://github.com/infra-kiwi/kiwi-blog/blob/main/0014-zx-scripting-in-typescript/scripts/purejs-aws.mjs
// NOTE: ZX will automatically install any missing libraries locally and execute the script.
// Check out the docs: https://google.github.io/zx/cli#install

// Use the AWS SDK to get the current caller
// NOTE: requires some AWS credentials to be loaded in the environment

const client = new sts.STSClient();

const identity = await client.send(new sts.GetCallerIdentityCommand());

echo`My identity: ${identity.Arn}`;
