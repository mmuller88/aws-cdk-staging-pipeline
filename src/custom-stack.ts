import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

/**
 * The Pipeline will automatically append the following CfnOutputs partly token from CodeBuild:
  new core.CfnOutput(customStage.customStack, 'Stage', { value: stageAccount.stage || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'CommitID', { value: process.env.CODEBUILD_RESOLVED_SOURCE_VERSION || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'RepoUrl', { value: `https://github.com/${props.gitHub.owner}/${props.repositoryName}` || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'BranchName', { value: props.branch || 'not set!' });
  new core.CfnOutput(customStage.customStack, 'BuildUrl', { value: process.env.CODEBUILD_BUILD_URL || 'not set!' });
 */
export class CustomStack extends Stack {

  /**
   * Necessary to wrap the CfnOutputs and make them available for the testCommands
   */
  cfnOutputs: Record<string, CfnOutput> = {};

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  };
}
