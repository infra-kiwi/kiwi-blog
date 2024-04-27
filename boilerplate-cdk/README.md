# kiwi-blog-boilerplate-cdk

This folder contains the boilerplate code for new CDK projects.

## Important files

* CDK entrypoint: [bin/app.ts](bin/app.ts)
* Example stack: [lib/stack.ts](lib/stack.ts)

## Usage

Run:

```shell
npm install
npm run cdk:deploy:all
```

Verify the execution with

```shell
aws cloudformation describe-stacks --stack-name kiwi-blog-boilerplate-cdk
```

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