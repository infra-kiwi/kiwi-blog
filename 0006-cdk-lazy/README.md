# kiwi-blog-0006-cdk-lazy

This example shows you how to use the CDK `Lazy` function to generate a "static" value (such as text) using 
the dynamic approach of having a function that adds a line at a time to the text.

You can find the relative blog post at: https://blog.infra.kiwi/aws-cdk-how-to-be-lazy-4928c7c8b0fe

## Important files

* The construct using the Lazy function: [lib/lazy-parameter.ts](lib/multi-line-parameter.ts)
* CDK entrypoint: [bin/app.ts](bin/app.ts)
* Example stack: [lib/stack.ts](lib/stack.ts)

## Usage

Run:

```shell
npm install
npm run cdk:deploy
```

Take note of the `ParameterName` output. 

Verify the execution with:

```shell
aws ssm get-parameter --name kiwi-blog-0006-cdk-lazy-my-parameter --query 'Parameter.Value' --output text
```

The parameter should now contain a pretty haiku, and an SNS topic:

```
It's not DNS
There's no way it's DNS
It was DNS
Here is a topic about DNS: arn:aws:sns:us-east-1:123456789012:kiwi-blog-0006-cdk-lazy-ATopicAboutDNS62AFBFAA-4MPIzEblXSCe
```

Note: if you altered the code, make sure to replace `kiwi-blog-0006-cdk-lazy-my-parameter` with the value of the
`ParameterName` output.

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
