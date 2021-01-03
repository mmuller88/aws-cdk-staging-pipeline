import * as core from '@aws-cdk/core';

export class CustomStack extends core.Stack {
  cfnOutputs: Record<string, core.CfnOutput> = {};

  constructor(scope: core.Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);

    new core.CfnOutput(scope, 'CommitID', { value: process.env.CODEBUILD_RESOLVED_SOURCE_VERSION || 'not set!' });
  };
}
