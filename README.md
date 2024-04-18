# InfraKiwi examples

This repository contains working all the code examples related to the https://blog.infra.kiwi publication.

## Examples

* [0001-cdk-force-tagging](./0001-cdk-force-tagging): This example shows how to create a custom synthesizer, to forcefully populate the tags of the deployed stacks and relative resources.

## Boilerplate (CDK)

All the CDK examples are based on a progressively-built [boilerplate-cdk](./boilerplate-cdk) folder, which contains the skeleton for new examples.

To create a new CDK project, run:

```powershell
 .\hack\new-project.ps1 0001-cdk-mah-project
```