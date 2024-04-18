# kiwi-blog-boilerplate-cdk

This folder contains the boilerplate code for new CDK projects.

## Usage

Run:

```shell
npm install
npm run cdk:deploy
```

Verify the execution with

```shell
aws cloudformation describe-stacks --stack-name kiwi-blog-boilerplate-cdk
```

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