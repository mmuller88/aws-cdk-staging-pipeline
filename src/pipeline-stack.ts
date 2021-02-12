import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { GitHubSourceAction } from '@aws-cdk/aws-codepipeline-actions';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import * as core from '@aws-cdk/core';
import {
  CdkPipeline,
  ShellScriptAction,
  SimpleSynthAction,
  StackOutput,
} from '@aws-cdk/pipelines';
import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket';
import { BuildBadge } from 'aws-cdk-build-badge';
// import { dependencies } from '../package.json';
import { StageAccount } from './accountConfig';
import { CustomStack } from './custom-stack';
import { CustomStage } from './custom-stage';

export interface PipelineStackProps extends core.StackProps {
  /**
   * The stack you want to be managed with the pipeline.
   * @param scope it the parent construct.
   * @param stageAccount the stage account from the current pipeline stage. You can use than stageAccount.stage or stageAccount.account.id or stageAccount.region
   */
  readonly customStack: (scope: core.Construct, stageAccount: StageAccount) => CustomStack;
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
   * If you need a certain install command for the synth action from the CDK Pipeline
   */
  readonly installCommand?: string;

  readonly badges?: {
    synthBadge?: boolean;
  };
  /**
   * Your GitHub credentials
   */
  readonly gitHub: { owner: string; oauthToken: core.SecretValue };
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

export class PipelineStack extends core.Stack {
  constructor(parent: core.Construct, id: string, props: PipelineStackProps) {
    super(parent, id, props);

    if (props.stageAccounts.length === 0) {
      throw Error('You need at least one stage!');
    }

    for (const stageAccount of props.stageAccounts) {
      if (!stageAccount.stage) {
        throw Error('Every stage needs a name like dev, qa or prod!');
      }
    }

    const sourceBucket = new AutoDeleteBucket(this, 'PipeBucket', {
      versioned: true,
      bucketKeyEnabled: true,
    });

    const pipeline = new Pipeline(this, 'Pipeline', {
      artifactBucket: sourceBucket,
      restartExecutionOnUpdate: true,
    });

    const sourceArtifact = new Artifact();
    const cloudAssemblyArtifact = new Artifact();

    const repo = new GitHubSourceAction({
      actionName: 'GithubSource',
      branch: props.branch,
      owner: props.gitHub.owner,
      repo: props.repositoryName,
      oauthToken: props.gitHub.oauthToken,
      output: sourceArtifact,
    });

    if (props.badges?.synthBadge) {
      new BuildBadge(this, 'BuildBadge', { hideAccountID: 'no', defaultProjectName: `${this.stackName}-synth` });
    }

    const cdkPipeline = new CdkPipeline(this, 'CdkPipeline', {
      // The pipeline name
      // pipelineName: `${this.stackName}-pipeline`,
      cloudAssemblyArtifact,
      codePipeline: pipeline,
      // crossAccountKeys: true,

      // Where the source can be found
      sourceAction: repo,

      // How it will be built and synthesized
      synthAction: SimpleSynthAction.standardNpmSynth({
        projectName: `${this.stackName}-synth`,
        sourceArtifact,
        cloudAssemblyArtifact,
        installCommand: props.installCommand || 'yarn install && yarn global add aws-cdk',
        synthCommand: 'yarn synth',
        // subdirectory: 'cdk',
        // We need a build step to compile the TypeScript Lambda
        buildCommand: props.buildCommand,
      }),
    });

    // todo: add devAccount later
    for (const stageAccount of props.stageAccounts) {
      const customStage = new CustomStage(
        this,
        `${this.stackName}-${stageAccount.stage}`,
        {
          customStack: props.customStack,
          env: {
            account: stageAccount.account.id,
            region: stageAccount.account.region,
          },
        },
        stageAccount,
      );

      // console.log(`Env: ${JSON.stringify(process.env)}`);

      new core.CfnOutput(customStage.customStack, 'Stage', { value: stageAccount.stage || 'not set!' });
      new core.CfnOutput(customStage.customStack, 'CommitID', { value: process.env.CODEBUILD_RESOLVED_SOURCE_VERSION || 'not set!' });
      new core.CfnOutput(customStage.customStack, 'RepoUrl', { value: `https://github.com/${props.gitHub.owner}/${props.repositoryName}` || 'not set!' });
      new core.CfnOutput(customStage.customStack, 'BranchName', { value: props.branch || 'not set!' });
      new core.CfnOutput(customStage.customStack, 'BuildUrl', { value: process.env.CODEBUILD_BUILD_URL || 'not set!' });

      // unwrap CustomStack cfnOutputs for using in useOutputs for test action
      const useOutputs: Record<string, StackOutput> = {};
      for (const cfnOutput in customStage.customStack.cfnOutputs) {
        const output = customStage.customStack.cfnOutputs[cfnOutput];
        useOutputs[cfnOutput] = cdkPipeline.stackOutput(
          output,
        );
      }

      const preprodStage = cdkPipeline.addApplicationStage(customStage, {
        manualApprovals: props.manualApprovals?.call(this, stageAccount),
      });


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
