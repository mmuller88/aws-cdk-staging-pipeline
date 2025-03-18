const { typescript } = require('projen');

const cdkVersion = process.env.CDK_VERSION || '1.122.0';

const project = new typescript.TypeScriptProject({
  authorAddress: 'damadden88@googlemail.de',
  authorName: 'martin.mueller',
  defaultReleaseBranch: 'master',
  name: 'aws-cdk-staging-pipeline',
  repositoryUrl: 'https://github.com/mmuller88/aws-cdk-staging-pipeline',
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  // CDK specific configurations
  cdkVersion: cdkVersion,
  deps: ['@mobileposse/auto-delete-bucket', 'aws-cdk-build-badge'],

  // Release configurations
  releaseToNpm: true,
  majorVersion: 2,
  releaseBranches: {
    'aws-cdk-1-122-0': {
      majorVersion: 1,
      minorVersion: 122,
    },
  },

  keywords: ['cdk', 'aws', 'pipeline', 'staging'],
});

project.setScript('deploy', 'cdk deploy');
project.setScript('destroy', 'cdk destroy');

project.synth();
