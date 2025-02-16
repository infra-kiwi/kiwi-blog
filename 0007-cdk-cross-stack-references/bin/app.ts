/*
 * Copyright (c) 2024-2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import * as cdk from 'aws-cdk-lib';
import { SourceStackWithOutputs } from '../lib/source-stack-with-outputs';
import { DestinationStack } from '../lib/destination-stack';
import { SourceStackWithManualNames } from '../lib/source-stack-with-manual-names';
import { SourceStackWithParameters } from '../lib/source-stack-with-parameters';

import { name as projectName } from '../package.json';
import { App } from 'aws-cdk-lib';

// https://docs.aws.amazon.com/cdk/v2/guide/environments.html
// Use the current environment variables to figure out which account
// and region we want to deploy to
const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

export function main(app: App) {
  // Define a set of stacks that use automatically generated outputs
  const sourceStackWithOutputs = new SourceStackWithOutputs(
    app,
    `${projectName}-SourceStackWithOutputs`,
    { env }
  );
  const destinationStackFromOutputs = new DestinationStack(
    app,
    `${projectName}-DestinationStackFromOutputs`,
    {
      env,
      snsTopicForAlarms: sourceStackWithOutputs.topic
    }
  );

  // Define a set of stacks that use manually generated resource names
  const sourceStackWithManualNames = new SourceStackWithManualNames(
    app,
    `${projectName}-SourceStackWithManualNames`,
    { env }
  );
  const destinationStackFromManualNames = new DestinationStack(
    app,
    `${projectName}-DestinationStackFromManualNames`,
    {
      env,
      snsTopicForAlarmsName: sourceStackWithManualNames.topicName
    }
  );
  // Force DestinationStackFromManualNames to be created
  // AFTER SourceStackWithManualNames
  destinationStackFromManualNames.addDependency(sourceStackWithManualNames);

  // Define a set of stacks that use SSM parameters
  const sourceStackWithParameters = new SourceStackWithParameters(
    app,
    `${projectName}-SourceStackWithParameters`,
    { env }
  );
  const destinationStackFromParameters = new DestinationStack(
    app,
    `${projectName}-DestinationStackFromParameters`,
    {
      env,
      snsTopicForAlarmsParameterName: sourceStackWithParameters.parameterName
    }
  );
  // Force DestinationStackFromParameters to be created
  // AFTER SourceStackWithParameters
  destinationStackFromParameters.addDependency(sourceStackWithParameters);

  return {
    sourceStackWithOutputs,
    destinationStackFromOutputs,
    sourceStackWithManualNames,
    destinationStackFromManualNames,
    sourceStackWithParameters,
    destinationStackFromParameters
  };
}

if (require.main == module) {
  void main(new cdk.App());
}
