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
    const synthesizer = new core.DefaultStackSynthesizer({ qualifier: 'pipeline-stack' });
    const stack = new PipelineStack(app, 'PipelineStack', {
      synthesizer: synthesizer,
      stageAccounts: [{
        account: {
          id: '1233334',
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
      test('which exist', () => {
        expect(stack).toHaveResourceLike('Custom::AutoDeleteBucket');
      });
    });
  });
});