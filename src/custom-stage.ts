import * as core from '@aws-cdk/core';
import { StageAccount } from './accountConfig';
import { CustomStack } from './custom-stack';

export interface CustomStageProps extends core.StageProps {
  customStack: (scope: core.Construct, stageAccount: StageAccount) => CustomStack;
}

export class CustomStage extends core.Stage {

  customStack: CustomStack;

  constructor(scope: core.Construct, id: string, props: CustomStageProps, stageAccount: StageAccount) {
    super(scope, id, props);

    this.customStack = props.customStack.call(this, this, stageAccount);
  }
}
