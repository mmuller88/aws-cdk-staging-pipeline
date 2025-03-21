import { CfnOutput, SecretValue, Stack } from 'aws-cdk-lib';
import { PIPELINE_ENV, TestApp } from './testutil';
import { CustomStack } from '../src/custom-stack';
import { PipelineStack } from '../src/index';

export class IntegTesting {
  readonly stack: Stack[];
  constructor() {
    const app = new TestApp();

    // Create a loose coupled SSM Parameter from type String
    const stack = new PipelineStack(app, 'PipelineStack', {
      env: PIPELINE_ENV,
      stageAccounts: [{
        account: {
          id: '1233334',
          region: 'eu-central-1',
        },
        stage: 'dev',
      }, {
        account: {
          id: '1233334',
          region: 'eu-central-1',
        },
        stage: 'prod',
      }],
      branch: 'master',
      repositoryName: 'aws-cdk-staging-pipeline',
      badges: { synthBadge: true },
      customStack: (scope, _) => {
        const customStack = new CustomStack(scope, 'TestCustomStack');
        customStack.cfnOutputs.Blub = new CfnOutput(customStack, 'OutputBlub', { value: 'BlubValue ' });
        return customStack;
      },
      manualApprovals: (stageAccount) => stageAccount.stage === 'prod',
      testCommands: (_) => [
        'echo $Blub',
      ],
      gitHub: { owner: 'mmuller88', oauthToken: new SecretValue('repo-token') },
    });

    this.stack = [stack];
  }
}

new IntegTesting();
