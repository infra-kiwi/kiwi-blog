# kiwi-blog-0011-cdk-tagging-aspects

This example shows some use cases of the AWS CDK [Aspects](https://docs.aws.amazon.com/cdk/v2/guide/aspects.html) feature. 

## Important files

* CDK entrypoint: [bin/app.ts](bin/app.ts)
* Aspects definition: [lib/aspects.ts](lib/aspects.ts)
* Example stack: [lib/stack.ts](lib/stack.ts)

## Usage

Run:

```shell
npm install
```

To first understand how validations work, try to run the following command, which will
prevent adding a required tag:

```shell
npm run cdk:deploy -- -c doNotAddRequiredTags=true
```

You should then see the following error, which proves our validation aspect is working correctly:

```
[Error at /kiwi-blog-0011-cdk-tagging-aspects/MyTopic/Resource] 
Missing required tag MyRequiredTag in CfnTopic MyTopic86869434!
```

You can then deploy normally with:

```shell
npm run cdk:deploy
```

Verify the execution with

```shell
aws cloudformation describe-stacks --stack-name kiwi-blog-0011-cdk-tagging-aspects
```

and note the added tags (`MyRequiredTag`, `aws-cdk-path`).

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
