import * as cdk from 'aws-cdk-lib';
import simpleGit from 'simple-git';

export type KiwiSynthesizerProps = cdk.DefaultStackSynthesizerProps & {
  forcedTags: Record<string, string>;
};

export class KiwiSynthesizer extends cdk.DefaultStackSynthesizer {
  readonly forcedTags: KiwiSynthesizerProps['forcedTags'];

  constructor(props: KiwiSynthesizerProps) {
    super(props);
    this.forcedTags = props.forcedTags;
  }

  bind(stack: cdk.Stack) {
    super.bind(stack);

    // Add every forced tag to the Stack
    for (const tag in this.forcedTags) {
      cdk.Tags.of(this.boundStack).add(tag, this.forcedTags[tag]);
    }
  }
}

export interface GetSynthesizerProps {
  // If true, the Repository tag will NOT contain
  // the GitHub organization name
  ignoreGitHubOrganization?: boolean;
}

export async function getSynthesizer(
  props?: GetSynthesizerProps,
  synthProps?: cdk.DefaultStackSynthesizerProps
) {
  // Extract the current repository name
  const remoteUrl = (await simpleGit().remote(['get-url', 'origin']))!.trim();
  console.debug(`Detected git remote url: ${remoteUrl}`);

  let repository = /github.com[:/]([^/]+\/[^/]+?)(\.git)?$/.exec(remoteUrl)![1];
  if (props?.ignoreGitHubOrganization) {
    repository = repository.split('/')[1];
  }

  return new KiwiSynthesizer({
    ...synthProps,
    forcedTags: {
      Repository: repository
    }
  });
}
