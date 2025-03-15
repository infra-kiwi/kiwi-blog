/*
 * Copyright (c) 2024-2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import { KiwiStack } from '../lib/stack';
import { App, aws_sns, Stack, Tag } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { describe } from 'node:test';
import { ArtifactMetadataEntryType } from 'aws-cdk-lib/cloud-assembly-schema';
import { addAspects } from '../lib/aspects';

describe('Aspects', () => {
  test('Main stack', async () => {
    const app = new App();

    // Init stack
    const stack = new KiwiStack(app, 'Test');

    await addAspects(app, {
      // Debug which resources we're visiting in the aspects
      debug: true,
      // Add some forced tags to all CDK resources
      forcedTags: {
        MyTag: 'this-is-a-forced-tag',
        MyRequiredTag: 'this-is-a-required-tag'
      }
    });

    // Prepare for assertions
    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();

    template.hasResourceProperties('AWS::SNS::Topic', {
      Tags: [
        // Make sure the resource contains the tag introduced
        // via CDK Aspect
        {
          Key: 'aws-cdk-path',
          Value: 'Test/MyTopic/Resource'
        },

        // Make sure the resource contains the required tag
        {
          Key: 'MyRequiredTag',
          Value: 'this-is-a-required-tag'
        },

        // Make sure the resource contains the forced tag
        {
          Key: 'MyTag',
          Value: 'this-is-a-forced-tag'
        }
      ]
    });
  });

  test('ValidateSNSTopicAspect should fail if the required tag is missing', async () => {
    const app = new App();
    const stack = new Stack(app, 'Test');

    await addAspects(app);

    const topic = new aws_sns.Topic(stack, 'MyTopic');

    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();

    // Expect an ERROR annotation to exist on the SNS topic created without MyRequiredTag
    expect(
      topic.node.defaultChild!.node.metadata.find(
        (e) => e.type == ArtifactMetadataEntryType.ERROR
      )
    ).not.toBeUndefined();
  });

  test('ValidateSNSTopicAspect should succeed if the required tag is added to the CfnTopic scope via Tag.visit', async () => {
    const app = new App();
    const stack = new Stack(app, 'Test');

    await addAspects(app);

    const topic = new aws_sns.Topic(stack, 'MyTopic');
    new Tag('MyRequiredTag', 'this-is-a-required-tag').visit(
      topic.node.defaultChild!
    );

    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();

    // Expect an ERROR annotation to NOT exist on the SNS topic created without MyRequiredTag
    expect(
      topic.node.defaultChild!.node.metadata.find(
        (e) => e.type == ArtifactMetadataEntryType.ERROR
      )
    ).toBeUndefined();
  });
});
