import { Stack, StackProps, SecretValue, CfnOutput } from 'aws-cdk-lib';
import { Artifact } from 'aws-cdk-lib/lib/aws-codepipeline';
import { GitHubSourceAction } from 'aws-cdk-lib/lib/aws-codepipeline-actions';
import { PolicyStatement } from 'aws-cdk-lib/lib/aws-iam';
import { CdkPipeline, ShellScriptAction, SimpleSynthAction, StackOutput } from 'aws-cdk-lib/lib/pipelines';
import { Construct } from 'constructs';


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
   * If you need a certain install command for the synth action from the CDK Pipeline
   */
  readonly installCommand?: string;

  readonly badges?: {
    synthBadge?: boolean;
  };
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

    if (props.stageAccounts.length === 0) {
      throw Error('You need at least one stage!');
    }

    for (const stageAccount of props.stageAccounts) {
      if (!stageAccount.stage) {
        throw Error('Every stage needs a name like dev, qa or prod!');
      }
    }

    // Removed bucket as there is a bug for cross account use https://github.com/aws/aws-cdk/issues/13027
    // const sourceBucket = new s3.Bucket(this, 'PipeBucket', {
    //   removalPolicy: core.RemovalPolicy.DESTROY,
    //   autoDeleteObjects: true,
    //   versioned: true,
    //   // bucketKeyEnabled: true,
    //   encryption: s3.BucketEncryption.KMS_MANAGED,
    // });

    // const pipeline = new Pipeline(this, 'Pipeline', {
    //   artifactBucket: sourceBucket,
    //   restartExecutionOnUpdate: true,
    // });

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

    // if (props.badges?.synthBadge) {
    //   new BuildBadge(this, 'BuildBadge', { hideAccountID: 'no', defaultProjectName: `${this.stackName}-synth` });
    // }

    const cdkPipeline = new CdkPipeline(this, 'CdkPipeline', {
      // The pipeline name
      // pipelineName: `${this.stackName}-pipeline`,
      cloudAssemblyArtifact,
      // codePipeline: pipeline,

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

      new CfnOutput(customStage.customStack, 'Stage', { value: stageAccount.stage || 'not set!' });
      new CfnOutput(customStage.customStack, 'CommitID', { value: process.env.CODEBUILD_RESOLVED_SOURCE_VERSION || 'not set!' });
      new CfnOutput(customStage.customStack, 'RepoUrl', { value: `https://github.com/${props.gitHub.owner}/${props.repositoryName}` || 'not set!' });
      new CfnOutput(customStage.customStack, 'BranchName', { value: props.branch || 'not set!' });
      new CfnOutput(customStage.customStack, 'BuildUrl', { value: process.env.CODEBUILD_BUILD_URL || 'not set!' });

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
