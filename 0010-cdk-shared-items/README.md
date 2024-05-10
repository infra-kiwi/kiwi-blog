# kiwi-blog-0010-cdk-shared-items

This example shows how to use the "shared items" concept to share an EventBus among multiple stacks, without 
having to explicitly pass around the dependency.

You can find the relative blog post
at: https://blog.infra.kiwi/aws-cdk-cross-stack-references-via-shared-items-45df17182855

## Important files

* CDK entrypoint: [bin/app.ts](bin/app.ts)
* Shared items utility: [lib/util/shared.ts](lib/util/shared.ts)
* Events stack (defined the EventBus): [lib/events-stack.ts](lib/events-stack.ts)
* Producer stack (generates events on the EventBus): [lib/producer-stack.ts](lib/producer-stack.ts)
  * Producer Lambda function: [lib/lambda/producer.ts](lib/lambda/producer.ts)
* Consumer stack (receives events from the EventBus): [lib/consumer-stack.ts](lib/consumer-stack.ts)
    * Consumer Lambda function: [lib/lambda/consumer.ts](lib/lambda/consumer.ts)

## Usage

Run:

```shell
npm install
npm run cdk:deploy:all
```

Create a hello-world event with:

```shell
aws lambda invoke --function-name kiwi-blog-0010-cdk-shared-items-producer-lambda --payload 'eyJncmVldGluZyI6ICJIZWxsbyB3b3JsZCEifQo=' lambda-response.json; cat lambda-response.json
```

Then, inspect the logs of the consumer function (you may have to retry once or twice if it takes some time for the Lambda to warm up):

```shell
aws logs filter-log-events --log-group-name /aws/lambda/kiwi-blog-0010-cdk-shared-items-consumer-lambda --filter-pattern '{ $.level = "INFO" }' --output text --query 'events[].message'
```

You should see a message similar to:

```
{"timestamp":"2024-05-08T05:11:50.123Z","level":"INFO","requestId":"...","message":"Received event: { greeting: 'Hello world!' }"}
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
