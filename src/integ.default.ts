import * as cdk from '@aws-cdk/core';
import { CustomStack } from './custom-stack';
import { PipelineStack } from './index';

export class IntegTesting {
  readonly stack: cdk.Stack[];
  constructor() {
    const app = new cdk.App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new cdk.Stack(app, 'pipeline-stack', { env });

    // Create a loose coupled SSM Parameter from type String
    new PipelineStack(stack, 'PipelineStack', {
      stageAccounts: [{
        account: {
          id: '981237193288',
          region: 'eu-central-1',
        },
        stage: 'dev',
      }],
      branch: 'master',
      repositoryName: 'aws-cdk-staging-pipeline',
      customStack: (scope, _) => {
        const customStack = new CustomStack(scope, 'TestCustomStack');
        return customStack;
      },
      manualApprovals: (_) => true,
      testCommands: (stageAccount) => [
        `echo "${stageAccount.stage} stage"`,
        `echo ${stageAccount.account.id} id + ${stageAccount.account.region} region`,
      ],
      gitHub: { owner: 'mmuller88', oauthToken: new cdk.SecretValue('repo-token') },
    });

    this.stack = [stack];
  }
}

new IntegTesting();
