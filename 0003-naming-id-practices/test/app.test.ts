/*
 * Copyright (c) 2024. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StackGoodName } from '../lib/stack-good-name';
import { StackBadName } from '../lib/stack-bad-name';

test('Naming stacks', async () => {
  const app = new App();

  // Init stacks
  const stackGoodName = new StackGoodName(app, 'GoodName');
  const stackBadName = new StackBadName(app, 'BadName');

  // Prepare for assertions
  {
    const template = Template.fromStack(stackGoodName);
    expect(template).toMatchSnapshot();

    template.resourceCountIs('AWS::SNS::Topic', 5);
  }

  {
    const template = Template.fromStack(stackBadName);
    expect(template).toMatchSnapshot();

    template.resourceCountIs('AWS::SNS::Topic', 5);
  }
});
