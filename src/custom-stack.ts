import * as core from '@aws-cdk/core';

/**
 * The Pipeline will automatically append the following CfnOutputs partly token from CodeBuild:
 * Stage: e.g. dev
 * CommitID: CODEBUILD_RESOLVED_SOURCE_VERSION
 * RepoUrl: CODEBUILD_SOURCE_REPO_URL
 * WebhookTrigger: CODEBUILD_WEBHOOK_TRIGGER
 */
export class CustomStack extends core.Stack {
  // Necessary to wrap the CfnOutputs and make them available for the testCommands
  cfnOutputs: Record<string, core.CfnOutputProps> = {};

  constructor(scope: core.Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
  };
}
