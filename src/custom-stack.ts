import * as core from '@aws-cdk/core';

/**
 * The Pipeline will automatically append the following CfnOutputs partly token from CodeBuild:
  new core.CfnOutput(customStage.customStack, 'Stage', { value: stageAccount.stage || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'CommitID', { value: process.env.CODEBUILD_RESOLVED_SOURCE_VERSION || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'RepoUrl', { value: `https://github.com/${props.gitHub.owner}/${props.repositoryName}` || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'BranchName', { value: props.branch || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'BuildUrl', { value: process.env.CODEBUILD_BUILD_URL || 'not set!' });
 */
export class CustomStack extends core.Stack {
  // Necessary to wrap the CfnOutputs and make them available for the testCommands
  cfnOutputs: Record<string, core.CfnOutput> = {};

  constructor(scope: core.Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
  };
}
