const { typescript } = require('projen');

const cdkVersion = process.env.CDK_VERSION || '2.0.0-rc.21';

const project = new typescript.TypeScriptProject({
  authorAddress: 'damadden88@googlemail.de',
  authorName: 'martin.mueller',
  defaultReleaseBranch: 'master',
  name: '@damadden88/aws-cdk-staging-pipeline',
  repositoryUrl: 'https://github.com/mmuller88/aws-cdk-staging-pipeline',
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  devDeps: [`@aws-cdk/assert@${cdkVersion}`],
  deps: [`aws-cdk-lib@${cdkVersion}`, 'constructs@^10.0.5'],
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
