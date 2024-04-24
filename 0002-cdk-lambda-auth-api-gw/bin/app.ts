#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { aws_iam } from 'aws-cdk-lib';

import { name as projectName } from '../package.json';
import { ServerStack } from '../lib/stacks/server-stack';
import { ClientStack } from '../lib/stacks/client-stack';

const app = new cdk.App();

// We expect this variable to be provided at deploy time,
// which will decide if we are deploying the server stack
// or the client stack
const component = app.node.getContext('component');

// Use the current environment variables to figure out which account
// and region we want to deploy to
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

function renderServer() {
  // We can, for example, either authorize an account or even the
  // entire AWS organization to make calls to our route
  const clientAccountId = app.node.tryGetContext('clientAccountId');
  // The unique identifier (ID) of an organization (i. e. o-12345abcde)
  const organizationId = app.node.tryGetContext('organizationId');

  // We build the list of allowed principals, which will
  // be able to make requests to the API Gateway route
  const allowedPrincipals: aws_iam.IPrincipal[] = [];
  if (clientAccountId) {
    allowedPrincipals.push(new aws_iam.AccountPrincipal(clientAccountId));
  } else if (organizationId) {
    allowedPrincipals.push(new aws_iam.OrganizationPrincipal(organizationId));
  } else {
    throw new Error(
      'You need to provide either clientAccountId or organizationId'
    );
  }

  new ServerStack(app, projectName + '-server', {
    env,
    allowedPrincipals
  });
}

function renderClient() {
  // Get the server gateway configuration. These values will be
  // the ones returned in the CloudFormation outputs of the Server stack
  const serverGatewayUrl = app.node.getContext('serverGatewayUrl');
  const serverGatewayRegion = app.node.getContext('serverGatewayRegion');

  new ClientStack(app, projectName + '-client', {
    env,
    serverGatewayUrl,
    serverGatewayRegion
  });
}

if (component === 'server') {
  renderServer();
} else if (component === 'client') {
  renderClient();
} else {
  throw new Error(`Unknown component: ${component}`);
}
