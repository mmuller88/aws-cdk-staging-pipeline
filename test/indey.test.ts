import * as core from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { CustomStack } from '../src/custom-stack';
import { PipelineStack } from '../src/pipeline-stack';

describe('Get', () => {
  describe('StagingPipeline', () => {
    // const env = {
    //   region: '12345678', //process.env.CDK_DEFAULT_REGION,
    //   account: 'us-east-1', //process.env.CDK_DEFAULT_ACCOUNT,
    // };
    const app = new core.App();
    const stack = new core.Stack(app, 'testing-stack');
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
      gitHub: { owner: 'mmuller88', oauthToken: new core.SecretValue('repo-token') },
    });

    describe('successful', () => {
      describe('as SSM Parameter String', () => {

        test('which exist', () => {
          expect(stack).toHaveResourceLike('Custom::AWS');
        });
      });
    });
  });
});