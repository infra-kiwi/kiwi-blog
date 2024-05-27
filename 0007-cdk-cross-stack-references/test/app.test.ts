/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { main } from '../bin/app';

describe('Stacks', () => {
  const app = new App();

  const stacks = main(app);

  test('Outputs', () => {
    const template = Template.fromStack(stacks.sourceStackWithOutputs);
    expect(template).toMatchSnapshot();

    // Verify the stack contains a generated output
    template.hasOutput('*', {
      Value: stacks.sourceStackWithOutputs.resolve(
        stacks.sourceStackWithOutputs.topic.topicArn
      )
    });

    const outputs = template.toJSON()['Outputs'];
    expect(Object.keys(outputs).length).toEqual(1);
  });

  test('Hardcoded names', () => {
    const template = Template.fromStack(stacks.sourceStackWithManualNames);
    expect(template).toMatchSnapshot();

    // Verify there are no outputs
    expect(template.toJSON()['Outputs']).toEqual(undefined);
  });

  test('SSM parameters', () => {
    const template = Template.fromStack(stacks.sourceStackWithParameters);
    expect(template).toMatchSnapshot();

    // Verify the stack contains an SSM parameter that points to the source SNS topic
    template.resourcePropertiesCountIs(
      'AWS::SSM::Parameter',
      {
        Value: stacks.sourceStackWithParameters.resolve(
          stacks.sourceStackWithParameters.topic.topicArn
        )
      },
      1
    );

    // Verify there are no outputs
    expect(template.toJSON()['Outputs']).toEqual(undefined);
  });
});
