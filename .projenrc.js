const { AwsCdkConstructLibrary } = require('projen');

const deps = [
  '@mobileposse/auto-delete-bucket',
];

const project = new AwsCdkConstructLibrary({
  authorAddress: 'damadden88@googlemail.de',
  authorName: 'martin.mueller',
  cdkVersion: '1.80.0',
  cdkVersionPinning: true,
  name: 'aws-cdk-staging-pipeline',
  repositoryUrl: 'https://github.com/mmuller88/aws-cdk-staging-pipeline',
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-codepipeline',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-codepipeline-actions',
    '@aws-cdk/pipelines',
  ],
  deps: deps,
  devDeps: deps,
  python: {
    distName: 'aws-cdk-staging-pipeline',
    module: 'aws_cdk_staging_pipeline',
  },
  keywords: [
    'cdk',
    'aws',
    'pipeline',
    'staging',
  ],
});

project.synth();
