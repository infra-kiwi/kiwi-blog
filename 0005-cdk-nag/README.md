# kiwi-blog-0005-cdk-nag

This example shows how to apply the CDK linting rules provided by [`cdk-nag`](https://github.com/cdklabs/cdk-nag).

You can find the relative blog post at: https://blog.infra.kiwi/aws-cdk-nag-or-how-to-write-production-appropriate-cdk-code-4eee27e738c7

## Important files

* CDK entrypoint: [bin/app.ts](bin/app.ts)
* Example stack: [lib/stack.ts](lib/stack.ts)

## Usage

Run:

```shell
npm install
```

You can try to comment out the line `masterKey: awsSNSKey` in [lib/stack.ts](lib/stack.ts), and then run `npm run cdk:diff`.
CDK should then throw some errors similar to:

```
[Error at /kiwi-blog-0005-cdk-nag/MyTopic/Resource] AwsSolutions-SNS2: The SNS Topic does not have server-side encryption enabled.
[Error at /kiwi-blog-0005-cdk-nag/MyTopic/Resource] AwsSolutions-SNS3: The SNS Topic does not require publishers to use SSL.
```

You can then uncomment the line, and you should be able to deploy the stack with `npm run cdk:deploy`.

Take a note of the `MyTopicArn` output. You can now run `aws sns get-topic-attributes --topic-arn MY_TOPIC_ARN` 
(replacing `MY_TOPIC_ARN`) with the value of the `MyTopicArn` output.

The output should contain a line similar to the following one:

```
"KmsMasterKeyId": "arn:aws:kms:us-east-1:123456789012:alias/aws/sns"
```

The previous line indicates the topic has now server-side-encryption enabled.

Then, you can destroy the deployed infrastructure with:

```shell
npm run cdk:destroy:all
```

## Useful commands

### CDK commands

```shell
# Performs a CDK diff against the current deployed environment
npm run cdk:diff

# Runs the CDK deployment
npm run cdk:deploy:all

# Destroys all the CDK deployment resources
npm run cdk:destroy:all

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
