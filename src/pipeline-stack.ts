import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { GitHubSourceAction } from '@aws-cdk/aws-codepipeline-actions';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import {
  Stack,
  StackProps,
  SecretValue,
  Construct,
} from '@aws-cdk/core';
import {
  CdkPipeline,
  ShellScriptAction,
  SimpleSynthAction,
  StackOutput,
} from '@aws-cdk/pipelines';
import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket';
// import { dependencies } from '../package.json';
import { StageAccount } from './accountConfig';
import { CustomStack } from './custom-stack';
import { CustomStage } from './custom-stage';

export interface PipelineStackProps extends StackProps {
  /**
   * The stack you want to be managed with the pipeline.
   * @param scope it the parent construct.
   * @param stageAccount the stage account from the current pipeline stage. You can use than stageAccount.stage or stageAccount.account.id or stageAccount.region
   */
  readonly customStack: (scope: Construct, stageAccount: StageAccount) => CustomStack;
  // customStack: CustomStack;
  /**
   * Array of staging accounts. The order of the StageAccounts in the array determines the order of the pipeline.
   */
  readonly stageAccounts: StageAccount[];
  /**
   * Branch you want the pipeline listen to
   */
  readonly branch: string;
  /**
   * Repository name from your repo in your GitHub account
   */
  readonly repositoryName: string;
  /**
   * If you need a certain build command for the synth action from the CDK Pipeline
   */
  readonly buildCommand?: string;
  /**
   * Your GitHub credentials
   */
  readonly gitHub: { owner: string; oauthToken: SecretValue };
  /**
   * Higher order function to determine if your stage shall be approved manually. E.g. if (stageAccount.stage === 'prod') return true
   * @default false
   */
  readonly manualApprovals?: (stageAccount: StageAccount) => boolean;
  /**
   * Commands for testing or cleaning up your stack. It is pretty much the same as testCommands from the CDK Pipeline but additionally you can use stageAccount properties
   */
  readonly testCommands?: (stageAccount: StageAccount) => string[];
}

export class PipelineStack extends Stack {
  constructor(parent: Construct, id: string, props: PipelineStackProps) {
    super(parent, id, props);

    const sourceBucket = new AutoDeleteBucket(this, 'PipeBucket', {
      versioned: true,
    });

    const pipeline = new Pipeline(this, 'Pipeline', {
      artifactBucket: sourceBucket,
      restartExecutionOnUpdate: true,
    });

    const sourceArtifact = new Artifact();
    const cloudAssemblyArtifact = new Artifact();

    const cdkPipeline = new CdkPipeline(this, 'CdkPipeline', {
      // The pipeline name
      // pipelineName: `${this.stackName}-pipeline`,
      cloudAssemblyArtifact,
      codePipeline: pipeline,

      // Where the source can be found
      sourceAction: new GitHubSourceAction({
        actionName: 'GithubSource',
        branch: props.branch,
        owner: props.gitHub.owner,
        repo: props.repositoryName,
        oauthToken: props.gitHub.oauthToken,
        output: sourceArtifact,
      }),

      // How it will be built and synthesized
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        installCommand: 'yarn install && yarn global add aws-cdk',
        synthCommand: 'yarn synth',
        // subdirectory: 'cdk',
        // We need a build step to compile the TypeScript Lambda
        buildCommand: props.buildCommand,
      }),
    });

    // todo: add devAccount later
    for (const stageAccount of props.stageAccounts) {
      // const useValueOutputs2: Record<string, CfnOutput> = {};

      const customStage = new CustomStage(
        this,
        `${this.stackName}-${stageAccount.stage}`,
        {
          customStack: props.customStack,
          // customStack: (_scope, account) => {
          //   return props.customStack(this, account);
          // },
          env: {
            account: stageAccount.account.id,
            region: stageAccount.account.region,
          },
        },
        stageAccount,
      );

      // console.log('customStage = ' + customStage);

      const preprodStage = cdkPipeline.addApplicationStage(customStage, {
        manualApprovals: props.manualApprovals?.call(this, stageAccount),
      });

      const useOutputs: Record<string, StackOutput> = {};

      // tslint:disable-next-line: forin
      for (const cfnOutput in customStage.cfnOutputs) {
        useOutputs[cfnOutput] = cdkPipeline.stackOutput(
          customStage.cfnOutputs[cfnOutput],
        );
      }

      const testCommands = props.testCommands ? props.testCommands.call(this, stageAccount) : [];

      preprodStage.addActions(
        new ShellScriptAction({
          rolePolicyStatements: [
            new PolicyStatement({
              actions: ['*'],
              resources: ['*'],
            }),
          ],
          additionalArtifacts: [sourceArtifact],
          actionName: 'RunTestCommands',
          useOutputs,
          commands: testCommands,
          runOrder: preprodStage.nextSequentialRunOrder(),
        }),
      );
    }
  }
}
