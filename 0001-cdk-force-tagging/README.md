# kiwi-blog-0001-cdk-force-tagging

This example shows how to create a custom synthesizer, to forcefully populate the tags of the deployed stacks and relative resources.

You can find the relative blog post at: https://blog.infra.kiwi/aws-cdk-force-tagging-all-stacks-with-a-git-repository-name-ee30ec7e6eae

## Usage

Run:

```shell
npm install
npm run cdk:deploy
```

Verify the execution with

```shell
aws cloudformation describe-stacks --stack-name kiwi-blog-0001-cdk-force-tagging --query 'Stacks[*].[StackName,Tags]' 
```

Which should print

```json
[                                                                                             
    [
        "kiwi-blog-0001-cdk-force-tagging",
        [
            {
                "Key": "Repository",
                "Value": "infra-kiwi/kiwi-blog"
            }
        ]
    ]
]
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