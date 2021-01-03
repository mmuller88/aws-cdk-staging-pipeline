import * as core from '@aws-cdk/core';

// export interface CustomStackProps extends core.StackProps {
//   readonly authorDate: string;
// }

/**
 * The Pipeline will automatically append the following CfnOutputs partly token from CodeBuild:
  new core.CfnOutput(customStage.customStack, 'Stage', { value: stageAccount.stage || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'CommitID', { value: process.env.CODEBUILD_RESOLVED_SOURCE_VERSION || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'RepoUrl', { value: process.env.CODEBUILD_SOURCE_REPO_URL || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'WebhookTrigger', { value: process.env.CODEBUILD_WEBHOOK_TRIGGER || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'BranchName', { value: repo.variables.branchName || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'CommitUrl', { value: repo.variables.commitUrl || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'CommitterDate', { value: repo.variables.committerDate || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'CommitMessage', { value: repo.variables.commitMessage || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'RepositoryName', { value: repo.variables.repositoryName || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'AuthorDate', { value: repo.variables.authorDate || 'not set!' });
 */
export class CustomStack extends core.Stack {
  // Necessary to wrap the CfnOutputs and make them available for the testCommands
  cfnOutputs: Record<string, core.CfnOutputProps> = {};

  constructor(scope: core.Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    // new core.CfnOutput(this, 'AuthorDate2', { value: props?.authorDate || 'not set!' });
  };
}
