[![NPM version](https://badge.fury.io/js/aws-cdk-staging-pipeline.svg)](https://badge.fury.io/js/aws-cdk-staging-pipeline)
[![PyPI version](https://badge.fury.io/py/aws-cdk-staging-pipeline.svg)](https://badge.fury.io/py/aws-cdk-staging-pipeline)
![Release](https://github.com/mmuller88/aws-cdk-staging-pipeline/workflows/Release/badge.svg)

# aws-cdk-staging-pipeline

An AWS CDK Construct with utilizing the CDK Pipeline and with focus on abstraction with use of higher order functions.

# Usage

Your stack you want to be managed by the staging pipeline needs to extend from the **CustomStack** intferace.

Look at the example. Please be aware that the staging pipeline is atm only designed for managing one stack. But it should be possible to manage multiple. As well you might run into issue using different accounts. Than check you cdk bootstrap. Anyway as this is experimental there are probably still issues in the library. I am happy to see PRs.

# Example

```ts
import * as core from '@aws-cdk/core';
import { PipelineStack } from 'aws-cdk-staging-pipeline';
import { ApiGwStack } from './apigw-stack';

const app = new core.App();

const stack = new core.Stack(app, 'petstoreStack');

new PipelineStack(stack, 'PipelineStack', {
  // Account and region where the pipeline will be build
  env: {
    account: '981237193288',
    region: 'eu-central-1',
  },
  // Staging Accounts e.g. dev qa prod
  stageAccounts: [
    {
      account: {
        id: '981237193288',
        region: 'eu-central-1',
      },
      stage: 'dev',
    },
    {
      account: {
        id: '981237193288',
        region: 'us-east-1',
      },
      stage: 'prod',
    },
  ],
  branch: 'master',
  repositoryName: 'aws-cdk-staging-pipeline',
  customStack: (scope, _) => {
    const apiGwStack = new ApiGwStack(scope, 'api-gw-stack-dev');
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

# Thanks To

- The CDK Community cdk-dev.slack.com
- [Projen](https://github.com/projen/projen) project and the community around i
