import { SynthUtils } from '@aws-cdk/assert';
import * as core from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import { PIPELINE_ENV, TestApp } from './testutil';
import { StageAccount } from '../src/accountConfig';
import { CustomStack } from '../src/custom-stack';
import { PipelineStack } from '../src/pipeline-stack';

let defaultStackProperties: any = {
  env: PIPELINE_ENV,
  stageAccounts: [
    {
      account: {
        id: '1233334',
        region: 'eu-central-1',
      },
      stage: 'dev',
    },
    {
      account: {
        id: '1233334',
        region: 'eu-central-1',
      },
      stage: 'prod',
    },
  ],
  branch: 'master',
  repositoryName: 'aws-cdk-staging-pipeline',
  customStack: (scope: core.Construct) => {
    const customStack = new CustomStack(scope, 'TestCustomStack');
    customStack.cfnOutputs.Blub = new core.CfnOutput(
      customStack,
      'OutputBlub',
      { value: 'BlubValue ' },
    );
    return customStack;
  },
  testCommands: () => ['echo $Blub'],
  manualApprovals: (stageAccount: StageAccount) =>
    stageAccount.stage === 'prod',
  gitHub: {
    owner: 'mmuller88',
    oauthToken: new core.SecretValue('repo-token'),
  },
};

describe('Create', () => {
  describe('StagingPipeline', () => {
    const app = new TestApp();
    describe('succeed', () => {
      let stack = new PipelineStack(
        app,
        'PipelineStack',
        defaultStackProperties,
      );
      test('with Blub as CfnOutput and reused in testCommands', () => {
        expect(stack).toHaveResourceLike('AWS::CodeBuild::Project');

        expect(JSON.stringify(SynthUtils.toCloudFormation(stack))).toContain(
          'export Blub=',
        );
        expect(JSON.stringify(SynthUtils.toCloudFormation(stack))).toContain(
          'OutputBlub',
        );
      });

      test('with manually approval only for prod', () => {
        expect(JSON.stringify(SynthUtils.toCloudFormation(stack))).toContain(
          'ManualApproval","RoleArn":{"Fn::GetAtt":["CdkPipelinePipelineStackprodManualApprovalCodePipelineActionRole',
        );
        expect(
          JSON.stringify(SynthUtils.toCloudFormation(stack)),
        ).not.toContain(
          'ManualApproval","RoleArn":{"Fn::GetAtt":["CdkPipelinePipelineStackdevManualApprovalCodePipelineActionRole',
        );
      });

      test('with manually approval for dev and prod', () => {
        defaultStackProperties.manualApprovals = () => true;
        stack = new PipelineStack(
          app,
          'PipelineStack2',
          defaultStackProperties,
        );
        expect(JSON.stringify(SynthUtils.toCloudFormation(stack))).toContain(
          'ManualApproval","RoleArn":{"Fn::GetAtt":["CdkPipelinePipelineStack2devManualApprovalCodePipelineActionRole',
        );
        expect(JSON.stringify(SynthUtils.toCloudFormation(stack))).toContain(
          'ManualApproval","RoleArn":{"Fn::GetAtt":["CdkPipelinePipelineStack2prodManualApprovalCodePipelineActionRole',
        );
      });

      test('with no manually approval for dev and prod when return false', () => {
        defaultStackProperties.manualApprovals = () => false;
        stack = new PipelineStack(
          app,
          'PipelineStack3',
          defaultStackProperties,
        );
        expect(
          JSON.stringify(SynthUtils.toCloudFormation(stack)),
        ).not.toContain(
          'ManualApproval","RoleArn":{"Fn::GetAtt":["CdkPipelinePipelineStack3devManualApprovalCodePipelineActionRole',
        );
        expect(
          JSON.stringify(SynthUtils.toCloudFormation(stack)),
        ).not.toContain(
          'ManualApproval","RoleArn":{"Fn::GetAtt":["CdkPipelinePipelineStack3prodManualApprovalCodePipelineActionRole',
        );
      });

      test('with no manually approval for dev and prod as default', () => {
        defaultStackProperties.manualApprovals = undefined;
        stack = new PipelineStack(
          app,
          'PipelineStack4',
          defaultStackProperties,
        );
        expect(
          JSON.stringify(SynthUtils.toCloudFormation(stack)),
        ).not.toContain(
          'ManualApproval","RoleArn":{"Fn::GetAtt":["CdkPipelinePipelineStack4devManualApprovalCodePipelineActionRole',
        );
        expect(
          JSON.stringify(SynthUtils.toCloudFormation(stack)),
        ).not.toContain(
          'ManualApproval","RoleArn":{"Fn::GetAtt":["CdkPipelinePipelineStack4prodManualApprovalCodePipelineActionRole',
        );
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
            gitHub: {
              owner: 'mmuller88',
              oauthToken: new core.SecretValue('repo-token'),
            },
          });
        }).toThrowError();
      });
      test('with empty stage', () => {
        expect(() => {
          new PipelineStack(app, 'PipelineStack', {
            env: PIPELINE_ENV,
            stageAccounts: [
              {
                account: {
                  id: '1233334',
                  region: 'eu-central-1',
                },
                stage: 'dev',
              },
              {
                account: {
                  id: '1233334',
                  region: 'eu-central-1',
                },
                stage: '',
              },
            ],
            branch: 'master',
            repositoryName: 'aws-cdk-staging-pipeline',
            customStack: (scope, _) => {
              const customStack = new CustomStack(scope, 'TestCustomStack');
              return customStack;
            },
            gitHub: {
              owner: 'mmuller88',
              oauthToken: new core.SecretValue('repo-token'),
            },
          });
        }).toThrowError();
      });
    });
  });
});
