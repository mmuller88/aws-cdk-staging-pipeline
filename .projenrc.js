const { TypeScriptProject } = require('projen');

const cdkVersion = process.env.CDK_VERSION || '2.0.0-rc.21';

const deps = [`aws-cdk-lib@${cdkVersion}`, 'constructs@^10.0.5'];

const project = new TypeScriptProject({
  authorAddress: 'damadden88@googlemail.de',
  authorName: 'martin.mueller',
  defaultReleaseBranch: 'master',
  name: 'aws-cdk-staging-pipeline',
  repositoryUrl: 'https://github.com/mmuller88/aws-cdk-staging-pipeline',
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  devDeps: [`@aws-cdk/assert@${cdkVersion}`],
  deps,
  releaseToNpm: true,
  // python: {
  //   distName: 'aws-cdk-staging-pipeline',
  //   module: 'aws_cdk_staging_pipeline',
  // },
  keywords: ['cdk', 'aws', 'pipeline', 'staging'],
});

project.setScript('deploy', 'cdk deploy');
project.setScript('destroy', 'cdk destroy');

project.synth();
