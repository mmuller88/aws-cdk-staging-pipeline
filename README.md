[![NPM version](https://badge.fury.io/js/aws-cdk-staging-pipeline.svg)](https://badge.fury.io/js/aws-cdk-staging-pipeline)
![Release](https://github.com/mmuller88/aws-cdk-staging-pipeline/workflows/Release/badge.svg)

# aws-cdk-staging-pipeline

An AWS CDK Construct with utilizing the CDK Pipeline and with focus on abstraction with use of higher order functions to hide more details of the staging pipeline.

If you successfully managed to set this staging pipeline up, in future only commits to the choosen remote in **branch** will be sufficiently to make changes to your staging stacks and to the pipeline itself as the pipeline is self-mutating.

It leverages all the cool stuff from the [CDK Pipeline](https://docs.aws.amazon.com/cdk/latest/guide/cdk_pipeline.html). As a matter of fact the core component is the CDK Pipeline.

As well this construct leverages the [Projen](https://github.com/projen/projen) as its best like the library is created with Projen and I utilise the default commands like yarn deploy, yarn build and so one.

Unlucky this library can't be translated to PyPi / Python as is uses higher order functions and the translation with [JSII](https://github.com/aws/jsii) for those are not supported for. Hopefully that will be supported soon.

# Usage

Your stack you want to be managed by the staging pipeline needs to extend from the **CustomStack** interface.

Look at the example. Please be aware that the staging pipeline is atm only designed for managing one stack. But it should be possible to manage multiple stack.

As well you might run into issue using different accounts. Than check you cdk bootstrap. Anyway as this is experimental there are probably still issues in the library. ATM my different stages map to different regions in the same account. A better practice would be do have multiple Accounts. So for each stage a dedicated account. But ATM I don't want to struggle with multiple accounts yet.

I am excited to your feedback and would be happy to see PRs. Enjoy.

# Example

Taken from https://github.com/mmuller88/aws-api-gw-petstore-example

```ts
import * as core from '@aws-cdk/core';
import { PipelineStack } from 'aws-cdk-staging-pipeline';
// import { PipelineStack } from '../../aws-cdk-staging-pipeline/src/index';
import { ApiGwStack } from './apigw-stack';

const app = new core.App();

new PipelineStack(app, 'petstore-pipeline', {
  stackName: 'petstore-pipeline',
  // Account and region where the pipeline will be build
  env: {
    account: 'XYZ',
    region: 'eu-central-1',
  },
  // Staging Accounts e.g. dev qa prod
  stageAccounts: [
    {
      account: {
        id: 'XYZ',
        region: 'eu-central-1',
      },
      stage: 'dev',
    },
    {
      account: {
        id: 'XYZ',
        region: 'us-east-1',
      },
      stage: 'prod',
    },
  ],
  branch: 'master',
  repositoryName: 'aws-api-gw-petstore-example',
  customStack: (scope, stageAccount) => {
    const apiGwStack = new ApiGwStack(
      scope,
      `petstore-stack-${stageAccount.stage}`,
      {
        stackName: `petstore-stack-${stageAccount.stage}`,
        stage: stageAccount.stage,
      },
    );
    return apiGwStack;
  },
  manualApprovals: (_) => true,
  testCommands: (stageAccount) => [
    `echo "${stageAccount.stage} stage"`,
    `echo ${stageAccount.account.id} id + ${stageAccount.account.region} region`,
  ],
  gitHub: {
    owner: 'mmuller88',
    oauthToken: core.SecretValue.secretsManager('alfcdk', {
      jsonField: 'muller88-github-token',
    }),
  },
});

app.synth();
```

# Planed Features / Ideas

- making GitLab and AWS CodeCommit repo available too
- conditional runs / triggering of the pipeline would be cool. Maybe only if it is a versions commit
- having a way to manage multiple stacks with might dedicated versions / dashboard features would be cool
- ...

# Troubleshooting

- I had some issues with the bootstrap stack in the stage regions. So I just recreated them
- ...

# Thanks To

- The CDK Community cdk-dev.slack.com
- [Projen](https://github.com/projen/projen) project and the community around i
