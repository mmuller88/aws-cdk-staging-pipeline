import * as core from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { CustomStack } from '../src/custom-stack';
import { PipelineStack } from '../src/pipeline-stack';
import { PIPELINE_ENV, TestApp } from './testutil';

describe('Create', () => {
  describe('StagingPipeline', () => {
    const app = new TestApp();
    describe('succeed', () => {

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
        customStack: (scope, _) => {
          const customStack = new CustomStack(scope, 'TestCustomStack');
          customStack.cfnOutputs.Blub = new core.CfnOutput(customStack, 'OutputBlub', { value: 'BlubValue ' });
          return customStack;
        },
        testCommands: (_) => [
          'echo $Blub',
        ],
        manualApprovals: (stageAccount) => stageAccount.stage === 'prod',
        gitHub: { owner: 'mmuller88', oauthToken: new core.SecretValue('repo-token') },
      });
      test('with Blub as CfnOutput and reused in testCommands', () => {
        expect(stack).toHaveResourceLike('AWS::CodeBuild::Project', {
          // Source: { BuildSpec: "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"build\": {\n      \"commands\": [\n        \"set -eu\",\n        \"export Blub=\\\"$(node -pe 'require(process.env.CODEBUILD_SRC_DIR_Artifact_PipelineStackPipelineStackqaTestCustomStack958E5CA1_Outputs + \\\"/outputs.json\\\")[\\\"OutputBlub\\\"]')\\\"\",\n        \"echo $Blub\"\n      ]\n    }\n  }\n}" },
        });

        // expect(stack).toHaveResourceLike('AWS::CodePipeline::Pipeline', { Actions: [] });
      });

      test('with manually approval only for prod', () => {
        expect(stack).toHaveResourceLike('AWS::CodePipeline::Pipeline', {
          // Stages: [{
          //   Actions: [{
          //     ActionTypeId: {
          //       Category: 'Approval',
          //       Owner: 'AWS',
          //       Provider: 'Manual',
          //       Version: '1',
          //     },
          //     Name: 'ManualApproval',
          //     RoleArn: {
          //       'Fn::GetAtt': [
          //         'PipelinePipelineStackprodManualApprovalCodePipelineActionRoleF8189188',
          //         'Arn',
          //       ],
          //     },
          //     RunOrder: 2,
          //   }],
          // }],
        });
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