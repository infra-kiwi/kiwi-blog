import { CloudFrontStack } from '../lib/stack';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

test('KiwiStack', async () => {
  const app = new App();

  // Init stack
  const stack = new CloudFrontStack(app, 'Test');

  // Prepare for assertions
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();

  template.resourceCountIs('AWS::S3::Bucket', 1);
  template.resourceCountIs('AWS::CloudFront::Distribution', 1);
  template.resourceCountIs('AWS::Glue::Database', 1);
  template.resourceCountIs('AWS::Glue::Table', 1);
});
