const { TypeScriptProject } = require('projen');

const cdkVersion = '1.117.0';

const deps = [
  // '@types/aws-lambda',
  // 'aws-lambda',
  // 'aws-sdk',
  // 'esbuild@^0',
  // `@aws-cdk/assert@${cdkVersion}`,
];

const cdkDeps = [
  // '@mobileposse/auto-delete-bucket',
  `@aws-cdk/core@${cdkVersion}`,
  `@aws-cdk/aws-codepipeline@${cdkVersion}`,
  `@aws-cdk/aws-iam@${cdkVersion}`,
  `@aws-cdk/aws-s3@${cdkVersion}`,
  `@aws-cdk/aws-codepipeline-actions@${cdkVersion}`,
  `@aws-cdk/pipelines@${cdkVersion}`,
  `@aws-cdk/assert@${cdkVersion}`,
  // `@aws-cdk/aws-lambda-nodejs@${cdkVersion}`,
  // 'aws-cdk-build-badge',
];

const project = new TypeScriptProject({
  authorAddress: 'damadden88@googlemail.de',
  authorName: 'martin.mueller',
  defaultReleaseBranch: 'master',
  name: 'aws-cdk-staging-pipeline',
  repositoryUrl: 'https://github.com/mmuller88/aws-cdk-staging-pipeline',
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  devDeps: [...deps, ...cdkDeps],
  deps: deps,
  peerDeps: cdkDeps,
  bundledDeps: deps,
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

project.setScript('deploy', 'cdk deploy');
project.setScript('destroy', 'cdk destroy');

project.synth();
