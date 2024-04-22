# InfraKiwi examples

This repository contains working all the code examples related to the https://blog.infra.kiwi publication.

## Examples

* [0001-cdk-force-tagging](./0001-cdk-force-tagging): This example shows how to create a custom synthesizer, to forcefully populate the tags of the deployed stacks and relative resources.
* [0002-cdk-lambda-auth-api-gw](./0002-cdk-lambda-auth-api-gw): This example shows how to leverage IAM-authorized routes for API Gateways to allow external clients to make IAM-authorized requests.
* [0003-naming-id-practices](./0003-naming-id-practices): This example shows how to define good, self-explaining AWS CDK construct IDs.

## Boilerplate (CDK)

All the CDK examples are based on a progressively-built [boilerplate-cdk](./boilerplate-cdk) folder, which contains the skeleton for new examples.

To create a new CDK project, run:

```powershell
 .\hack\new-project.ps1 0001-cdk-mah-project
```