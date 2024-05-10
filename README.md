# InfraKiwi examples

This repository contains working all the code examples related to the https://blog.infra.kiwi publication.

## Examples

* [0001-cdk-force-tagging](./0001-cdk-force-tagging): This example shows how to create a custom synthesizer, to forcefully populate the tags of the deployed stacks and relative resources.
* [0002-cdk-lambda-auth-api-gw](./0002-cdk-lambda-auth-api-gw): This example shows how to leverage IAM-authorized routes for API Gateways to allow external clients to make IAM-authorized requests.
* [0003-naming-id-practices](./0003-naming-id-practices): This example shows how to define good, self-explaining AWS CDK construct IDs.
* [0004-cloudfront-logs-glue-athena](./0004-cloudfront-logs-glue-athena): This example shows how to query CloudFront logs using AWS Athena and AWS Glue.
* [0005-cdk-nag](./0005-cdk-nag): This example shows how to apply the CDK linting rules provided by [`cdk-nag`](https://github.com/cdklabs/cdk-nag).
* [0006-cdk-lazy](./0006-cdk-lazy): This example shows you how to use the CDK `Lazy` function to generate a "static" value (such as text) using a dynamic approach.
* [0007-cdk-cross-stack-references](./0007-cdk-cross-stack-references): This example shows multiple ways of using values generated by a stack, such as resources' ARNs, in another stack.
* [0008-cdk-aws-chatbot](./0008-cdk-aws-chatbot): This example shows how to configure the AWS ChatBot to send messages to Slack by creating a notification pipeline that
  accepts a custom message payload format.
* [0009-cdk-lambda-error-catcher](./0009-cdk-lambda-error-catcher): This example shows you how you can catch Lambda function error messages and (optionally) post them to a Slack channel.
* [0010-cdk-shared-items](./0010-cdk-shared-items): This example shows how to use the "shared items" concept to share an EventBus among multiple stacks, without
  having to explicitly pass around the dependency.

## Boilerplate (CDK)

All the CDK examples are based on a progressively-built [boilerplate-cdk](./boilerplate-cdk) folder, which contains the skeleton for new examples.

To create a new CDK project, run:

```powershell
 .\hack\new-project.ps1 0001-cdk-mah-project
```