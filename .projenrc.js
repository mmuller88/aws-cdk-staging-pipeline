const { TypeScriptProject } = require('projen');

const cdkVersion = '1.83.0';

const deps = [
  '@mobileposse/auto-delete-bucket',
  `@aws-cdk/core@${cdkVersion}`,
  `@aws-cdk/aws-codepipeline@${cdkVersion}`,
  `@aws-cdk/aws-iam@${cdkVersion}`,
  `@aws-cdk/aws-codepipeline-actions@${cdkVersion}`,
  `@aws-cdk/pipelines@${cdkVersion}`,
  `@aws-cdk/assert@${cdkVersion}`,
  `@aws-cdk/aws-lambda-nodejs@${cdkVersion}`,
  'aws-cdk-build-badge',
];

const project = new TypeScriptProject({
  authorAddress: 'damadden88@googlemail.de',
  authorName: 'martin.mueller',
  // cdkVersion: '1.80.0',
  // cdkVersionPinning: true,
  name: 'aws-cdk-staging-pipeline',
  repositoryUrl: 'https://github.com/mmuller88/aws-cdk-staging-pipeline',
  // cdkDependencies: [
  //   '@aws-cdk/core',
  //   '@aws-cdk/aws-codepipeline',
  //   '@aws-cdk/aws-iam',
  //   '@aws-cdk/aws-codepipeline-actions',
  //   '@aws-cdk/pipelines',
  // ],
  deps: deps,
  devDeps: deps,
  // bundledDeps: deps,
  releaseToNpm: true,
  // python: {
  //   distName: 'aws-cdk-staging-pipeline',
  //   module: 'aws_cdk_staging_pipeline',
  // },
  keywords: [
    'cdk',
    'aws',
    'pipeline',
    'staging',
  ],
});

const common_exclude = ['cdk.out'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();
