# kiwi-blog-0012-cdk-lambda-github

This example shows how to set up a Lambda function that listens to GitHub webhooks and,
whenever a Pull Request is opened, answers back by reacting with a heart on the PR.

You can find the related blog post at: https://blog.infra.kiwi/aws-cdk-listen-to-github-webhooks-and-answer-back-eea9316ccebd

## Important files

* CDK entrypoint: [bin/app.ts](bin/app.ts)
* The Lambda function that handles the GitHub workflow [lib/lambda/pr-love.ts](lib/lambda/pr-love.ts)
* Example stack: [lib/stack.ts](lib/stack.ts)

## Usage

Please refer to the [blog post](https://blog.infra.kiwi/aws-cdk-listen-to-github-webhooks-and-answer-back-eea9316ccebd) for the whole set up of secrets, as there are
multiple steps involved, each requiring some context.

After you have created all the necessary secrets, run:

```shell
npm install
npm run cdk:deploy:all
```

Retrieve the randomly generated GitHub webhook token with

```shell
aws secretsmanager get-secret-value --secret-id kiwi-blog-0012-cdk-lambda-github-webhook-token --query 'SecretString' --output text
```

Verify the execution by opening a Pull Request in any of the testing repositories
where you have installed your GitHub application. A little heart reaction should
appear! ❤️

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
