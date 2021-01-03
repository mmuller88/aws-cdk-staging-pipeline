import * as core from '@aws-cdk/core';
import { StageAccount } from './accountConfig';
import { CustomStack } from './custom-stack';

// import { UIStack } from '../alf-cdk-ui/cdk/ui-stack';


export interface CustomStageProps extends core.StageProps {
  readonly stage: string;
  // stackProps: CustomStackProps;
  customStack: (scope: core.Construct, stageAccount: StageAccount) => CustomStack;
}
/**
 * Deployable unit of web service app
 */
export class CustomStage extends core.Stage {
  cfnOutputs: Record<string, core.CfnOutput> = {};

  constructor(scope: core.Construct, id: string, props: CustomStageProps, stageAccount: StageAccount) {
    super(scope, id, props);

    const customStack = props.customStack.call(this, this, stageAccount);
    new core.CfnOutput(customStack, 'Stage', { value: props.stage || 'not set!' });
    new core.CfnOutput(customStack, 'CommitID', { value: process.env.CODEBUILD_RESOLVED_SOURCE_VERSION || 'not set!' });

    // tslint:disable-next-line: forin
    for (const key in customStack.cfnOutputs) {
      this.cfnOutputs[key] = customStack.cfnOutputs[key];
    }

    // this.cfnOutputs = customStack.cfnOutputs;
  }
}
