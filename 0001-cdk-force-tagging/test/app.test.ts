import { KiwiStack } from '../lib/stack';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { getSynthesizer } from '../lib/synthesizer';

test('Forced synthesizer', async () => {
  const app = new App();

  const synthesizer = await getSynthesizer();

  // Make sure the synthesizer contains the forced tag
  const repositoryTag = synthesizer.forcedTags['Repository'];
  expect(repositoryTag).toEqual('infra-kiwi/kiwi-blog');

  // Init stack
  const stack = new KiwiStack(app, 'Test', { synthesizer });

  // Prepare for assertions
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  template.resourcePropertiesCountIs(
    'AWS::SNS::Topic',
    {
      // Make sure the SNS topic contains the forced tag
      Tags: [
        {
          Key: 'Repository',
          Value: 'infra-kiwi/kiwi-blog'
        }
      ]
    },
    1
  );
});