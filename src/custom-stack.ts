import * as core from '@aws-cdk/core';

export class CustomStack extends core.Stack {
  cfnOutputs: Record<string, core.CfnOutput> = {};

  constructor(scope: core.Construct, id: string, props?: core.StackProps) {
    super(scope, id, props);
  };
}
