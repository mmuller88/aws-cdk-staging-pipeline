import * as core from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { CustomStack } from '../src/custom-stack';
import { PipelineStack } from '../src/pipeline-stack';
import { PIPELINE_ENV, TestApp } from './testutil';

describe('Create', () => {
  describe('StagingPipeline', () => {
    const app = new TestApp();
    describe('succeed', () => {
      test('which exist', () => {
        let customStack;
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
            stage: 'qa',
          }],
          branch: 'master',
          repositoryName: 'aws-cdk-staging-pipeline',
          customStack: (scope, _) => {
            customStack = new CustomStack(scope, 'TestCustomStack');
            customStack.cfnOutputs.Blub = { value: 'BlubValue' };
            return customStack;
          },
          gitHub: { owner: 'mmuller88', oauthToken: new core.SecretValue('repo-token') },
        });

        expect(stack).toHaveResourceLike('AWS::CodeBuild::Project');
        expect(customStack).toHaveOutput()
      });
    });

    describe('fails', () => {

      test('with no stage', () => {
        expect(() => {
          new PipelineStack(app, 'PipelineStack', {
            env: PIPELINE_ENV,
            stageAccounts: [],
            branch: 'master',
            repositoryName: 'aws-cdk-staging-pipeline',
            customStack: (scope, _) => {
              const customStack = new CustomStack(scope, 'TestCustomStack');
              return customStack;
            },
            gitHub: { owner: 'mmuller88', oauthToken: new core.SecretValue('repo-token') },
          });
        }).toThrowError();
      });
      test('with empty stage', () => {
        expect(() => {
          new PipelineStack(app, 'PipelineStack', {
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
              stage: '',
            }],
            branch: 'master',
            repositoryName: 'aws-cdk-staging-pipeline',
            customStack: (scope, _) => {
              const customStack = new CustomStack(scope, 'TestCustomStack');
              return customStack;
            },
            gitHub: { owner: 'mmuller88', oauthToken: new core.SecretValue('repo-token') },
          });
        }).toThrowError();
      });


    });
  });
});