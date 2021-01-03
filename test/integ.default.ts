import * as core from '@aws-cdk/core';
import { CustomStack } from '../src/custom-stack';
import { PipelineStack } from '../src/index';
import { PIPELINE_ENV, TestApp } from './testutil';

export class IntegTesting {
  readonly stack: core.Stack[];
  constructor() {
    const app = new TestApp();

    // const env = {
    //   region: process.env.CDK_DEFAULT_REGION,
    //   account: process.env.CDK_DEFAULT_ACCOUNT,
    // };

    // const synthesizer = new core.DefaultStackSynthesizer({ qualifier: 'pipeline-stack' });

    // Create a loose coupled SSM Parameter from type String
    const stack = new PipelineStack(app, 'PipelineStack', {
      env: PIPELINE_ENV,
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
      gitHub: { owner: 'mmuller88', oauthToken: new core.SecretValue('repo-token') },
    });

    this.stack = [stack];
  }
}

new IntegTesting();
