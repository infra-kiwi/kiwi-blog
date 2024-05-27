/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { KiwiStack } from '../lib/stack';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

test('KiwiStack', async () => {
  const app = new App();

  // Init stack
  const stack = new KiwiStack(app, 'Test');

  // Prepare for assertions
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  template.resourceCountIs('AWS::SNS::Topic', 1);
});
