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

  template.hasResourceProperties('AWS::SSM::Parameter', {
    Value: stack.resolve(
      [
        `It's not DNS`,
        `There's no way it's DNS`,
        `It was DNS`,
        `Here is a topic about DNS: ${stack.topic.topicArn}`
      ].join('\n')
    )
  });
});
