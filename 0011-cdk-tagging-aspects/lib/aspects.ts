import * as cdk from 'aws-cdk-lib';
import { Annotations, aws_sns, TagManager } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

// Defines an aspect that will visit every resource of the Stack and
// assign a tag value based on the path of such resource.
//
// E.g. If the main Stack ID is "Test", an SNS resource
// could have the path Test/MyTopic/Resource.
export class PathTaggerAspect implements cdk.IAspect {
  visit(node: IConstruct) {
    new cdk.Tag('aws-cdk-path', node.node.path).visit(node);
  }
}

// Defines an aspect that will print info about every single node
// visited by the Aspect
export class DebugAspect implements cdk.IAspect {
  visit(node: IConstruct) {
    const className = node.constructor.name;
    const tags = TagManager.of(node)?.tagValues();

    console.log(`Visiting ${className}`, {
      id: node.node.id,
      tags
    });
  }
}

// Defines an aspect that make sure every SNS topic has a specific tag
// defined, otherwise it will add an annotation to prevent any successful
// synth of the Stack.
export class ValidateSNSTopicAspect implements cdk.IAspect {
  visit(node: IConstruct) {
    if (!(node instanceof aws_sns.CfnTopic)) {
      return;
    }

    if (!('MyRequiredTag' in (TagManager.of(node)?.tagValues() ?? {}))) {
      Annotations.of(node).addError(
        `Missing required tag MyRequiredTag in CfnTopic ${node.logicalId}!`
      );
    }
  }
}

export async function addAspects(
  scope: IConstruct,
  props?: {
    debug?: boolean;
    forcedTags?: Record<string, string>;
  }
) {
  const tags = cdk.Tags.of(scope);
  const aspects = cdk.Aspects.of(scope);

  // Add every forced tag to the Stack
  for (const tag in props?.forcedTags) {
    tags.add(tag, props.forcedTags[tag]);
  }

  // Apply the PathTagger to the whole stack
  aspects.add(new PathTaggerAspect());

  if (props?.debug) {
    // Apply the DebugAspect to the stack
    aspects.add(new DebugAspect());
  }

  // Apply the ValidateSNSTopicAspect to the stack
  aspects.add(new ValidateSNSTopicAspect());
}
