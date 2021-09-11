import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { StageAccount } from './accountConfig';
import { CustomStack } from './custom-stack';

export interface CustomStageProps extends StageProps {
  customStack: (scope: Construct, stageAccount: StageAccount) => CustomStack;
}

export class CustomStage extends Stage {

  customStack: CustomStack;

  constructor(scope: Construct, id: string, props: CustomStageProps, stageAccount: StageAccount) {
    super(scope, id, props);

    this.customStack = props.customStack.call(this, this, stageAccount);
  }
}
