# kiwi-blog-0003-naming-id-practices

This example shows how to define good, self-explaining AWS CDK construct IDs.

You can find the relative blog post at: https://blog.infra.kiwi/aws-cdk-some-id-practices-0ecfdccca40a

TL;DR: Wrap the IDs with the construct's class name!

`super(scope, ${MyConstructClass.name}-${id});` is your friend!

## Important files

* CDK entrypoint: [bin/app.ts](bin/app.ts)
* Stacks
    * The one that uses constructs with good names: [lib/stack-good-name.ts](lib/stack-good-name.ts)
    * The one that uses constructs with bad names: [lib/stack-bad-name.ts](lib/stack-bad-name.ts)
* Constructs
    * The constructs with good
      names: [lib/constructs-good-name/notification-group.ts](lib/constructs-good-name/notification-group.ts)
      and [lib/constructs-good-name/sns-topic-wrapper.ts](lib/constructs-good-name/sns-topic-wrapper.ts).
    * The constructs with bad
      names: [lib/constructs-bad-name/notification-group.ts](lib/constructs-bad-name/notification-group.ts)
      and [lib/constructs-bad-name/sns-topic-wrapper.ts](lib/constructs-bad-name/sns-topic-wrapper.ts).

## Usage

Run:

```shell
npm install
npm run cdk:deploy
```

Verify the execution by opening the AWS Console and looking at the deployed resources for both the
`kiwi-blog-0003-naming-id-practices-good-name` and `kiwi-blog-0003-naming-id-practices-bad-name` stacks.

Notice how much easier it is to read the Logical IDs of the resources from
the `kiwi-blog-0003-naming-id-practices-good-name` stack!

Then, you can destroy the deployed infrastructure with:

```shell
npm run cdk:destroy
```

## Useful commands

### CDK commands

```shell
# Performs a CDK diff against the current deployed environment
npm run cdk:diff

# Runs the CDK deployment
npm run cdk:deploy

# Destroys all the CDK deployment resources
npm run cdk:destroy

# Shows the synthesized CloudFormation template
npm run cdk:synth
```

### JS commands

```shell
# Run tests
npm run test

# Run lint
npm run lint
```
