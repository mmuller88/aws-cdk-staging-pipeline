{
  "Resources": {
    "PipeBucket9BE9B45C": {
      "Type": "AWS::S3::Bucket",
      "Properties": {
        "VersioningConfiguration": {
          "Status": "Enabled"
        }
      },
      "UpdateReplacePolicy": "Delete",
      "DeletionPolicy": "Delete",
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/PipeBucket/Resource"
      }
    },
    "PipeBucketAutoBucket68614A3E": {
      "Type": "Custom::AutoDeleteBucket",
      "Properties": {
        "ServiceToken": {
          "Fn::GetAtt": [
            "AutoBucket7677dc81117d41c0b75bdb11cb84bb70DC15ED41",
            "Arn"
          ]
        },
        "BucketName": {
          "Ref": "PipeBucket9BE9B45C"
        }
      },
      "UpdateReplacePolicy": "Delete",
      "DeletionPolicy": "Delete",
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/PipeBucket/AutoBucket/Default"
      }
    },
    "AutoBucket7677dc81117d41c0b75bdb11cb84bb70ServiceRole2F2A10DB": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": "lambda.amazonaws.com"
              }
            }
          ],
          "Version": "2012-10-17"
        },
        "ManagedPolicyArns": [
          {
            "Fn::Join": [
              "",
              [
                "arn:",
                {
                  "Ref": "AWS::Partition"
                },
                ":iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
              ]
            ]
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/AutoBucket7677dc81117d41c0b75bdb11cb84bb70/ServiceRole/Resource"
      }
    },
    "AutoBucket7677dc81117d41c0b75bdb11cb84bb70ServiceRoleDefaultPolicy57248D6C": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "s3:GetObject*",
                "s3:GetBucket*",
                "s3:List*",
                "s3:DeleteObject*",
                "s3:PutObject*",
                "s3:Abort*"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::GetAtt": [
                    "PipeBucket9BE9B45C",
                    "Arn"
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "PipeBucket9BE9B45C",
                          "Arn"
                        ]
                      },
                      "/*"
                    ]
                  ]
                }
              ]
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "AutoBucket7677dc81117d41c0b75bdb11cb84bb70ServiceRoleDefaultPolicy57248D6C",
        "Roles": [
          {
            "Ref": "AutoBucket7677dc81117d41c0b75bdb11cb84bb70ServiceRole2F2A10DB"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/AutoBucket7677dc81117d41c0b75bdb11cb84bb70/ServiceRole/DefaultPolicy/Resource"
      }
    },
    "AutoBucket7677dc81117d41c0b75bdb11cb84bb70DC15ED41": {
      "Type": "AWS::Lambda::Function",
      "Properties": {
        "Code": {
          "S3Bucket": "cdk-hnb659fds-assets-981237193288-eu-central-1",
          "S3Key": "392e2627a26f124347194605f96c8ed33d4552afcc2339b700ce6d6ce351eac1.zip"
        },
        "Handler": "main.handler",
        "Role": {
          "Fn::GetAtt": [
            "AutoBucket7677dc81117d41c0b75bdb11cb84bb70ServiceRole2F2A10DB",
            "Arn"
          ]
        },
        "Runtime": "nodejs10.x",
        "Timeout": 900
      },
      "DependsOn": [
        "AutoBucket7677dc81117d41c0b75bdb11cb84bb70ServiceRoleDefaultPolicy57248D6C",
        "AutoBucket7677dc81117d41c0b75bdb11cb84bb70ServiceRole2F2A10DB"
      ],
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/AutoBucket7677dc81117d41c0b75bdb11cb84bb70/Resource",
        "aws:asset:path": "asset.392e2627a26f124347194605f96c8ed33d4552afcc2339b700ce6d6ce351eac1",
        "aws:asset:property": "Code"
      }
    },
    "PipelineRoleD68726F7": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": "codepipeline.amazonaws.com"
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/Role/Resource"
      }
    },
    "PipelineRoleDefaultPolicyC7A05455": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "s3:GetObject*",
                "s3:GetBucket*",
                "s3:List*",
                "s3:DeleteObject*",
                "s3:PutObject*",
                "s3:Abort*"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::GetAtt": [
                    "PipeBucket9BE9B45C",
                    "Arn"
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "PipeBucket9BE9B45C",
                          "Arn"
                        ]
                      },
                      "/*"
                    ]
                  ]
                }
              ]
            },
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "PipelineBuildSynthCodePipelineActionRoleA0A9CB64",
                  "Arn"
                ]
              }
            },
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "PipelineUpdatePipelineSelfMutateCodePipelineActionRole258195B5",
                  "Arn"
                ]
              }
            },
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "PipelinepetstorepipelinedevManualApprovalCodePipelineActionRole30A0DC24",
                  "Arn"
                ]
              }
            },
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "CdkPipelineAssetsFileRoleDBBCC980",
                  "Arn"
                ]
              }
            },
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "PipelinepetstorepipelinedevRunTestCommandsCodePipelineActionRole8349E734",
                  "Arn"
                ]
              }
            },
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "PipelinepetstorepipelineprodManualApprovalCodePipelineActionRole11C4B8CD",
                  "Arn"
                ]
              }
            },
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "PipelinepetstorepipelineprodRunTestCommandsCodePipelineActionRole84213FE3",
                  "Arn"
                ]
              }
            },
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      "Ref": "AWS::Partition"
                    },
                    ":iam::981237193288:role/cdk-hnb659fds-deploy-role-981237193288-eu-central-1"
                  ]
                ]
              }
            },
            {
              "Action": [
                "s3:GetObject*",
                "s3:GetBucket*",
                "s3:List*",
                "s3:DeleteObject*",
                "s3:PutObject*",
                "s3:Abort*"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":s3:::petstore-pipeline-supporteplicationbucketd6dadffd5817496ba8a7"
                    ]
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":s3:::petstore-pipeline-supporteplicationbucketd6dadffd5817496ba8a7/*"
                    ]
                  ]
                }
              ]
            },
            {
              "Action": [
                "kms:Decrypt",
                "kms:DescribeKey",
                "kms:Encrypt",
                "kms:ReEncrypt*",
                "kms:GenerateDataKey*"
              ],
              "Effect": "Allow",
              "Resource": "*"
            },
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      "Ref": "AWS::Partition"
                    },
                    ":iam::981237193288:role/cdk-hnb659fds-deploy-role-981237193288-us-east-1"
                  ]
                ]
              }
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "PipelineRoleDefaultPolicyC7A05455",
        "Roles": [
          {
            "Ref": "PipelineRoleD68726F7"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/Role/DefaultPolicy/Resource"
      }
    },
    "PipelineC660917D": {
      "Type": "AWS::CodePipeline::Pipeline",
      "Properties": {
        "RoleArn": {
          "Fn::GetAtt": [
            "PipelineRoleD68726F7",
            "Arn"
          ]
        },
        "Stages": [
          {
            "Actions": [
              {
                "ActionTypeId": {
                  "Category": "Source",
                  "Owner": "ThirdParty",
                  "Provider": "GitHub",
                  "Version": "1"
                },
                "Configuration": {
                  "Owner": "mmuller88",
                  "Repo": "aws-api-gw-petstore-example",
                  "Branch": "master",
                  "OAuthToken": "{{resolve:secretsmanager:alfcdk:SecretString:muller88-github-token::}}",
                  "PollForSourceChanges": false
                },
                "Name": "GithubSource",
                "OutputArtifacts": [
                  {
                    "Name": "Artifact_Source_GithubSource"
                  }
                ],
                "RunOrder": 1
              }
            ],
            "Name": "Source"
          },
          {
            "Actions": [
              {
                "ActionTypeId": {
                  "Category": "Build",
                  "Owner": "AWS",
                  "Provider": "CodeBuild",
                  "Version": "1"
                },
                "Configuration": {
                  "ProjectName": {
                    "Ref": "PipelineBuildSynthCdkBuildProject1250E181"
                  },
                  "EnvironmentVariables": "[{\"name\":\"_PROJECT_CONFIG_HASH\",\"type\":\"PLAINTEXT\",\"value\":\"e6e6945c83b20a417ee9639e056fa904e500bb7c8aa39eb981457e3994f0d63b\"}]"
                },
                "InputArtifacts": [
                  {
                    "Name": "Artifact_Source_GithubSource"
                  }
                ],
                "Name": "Synth",
                "OutputArtifacts": [
                  {
                    "Name": "Artifact_Build_Synth"
                  }
                ],
                "RoleArn": {
                  "Fn::GetAtt": [
                    "PipelineBuildSynthCodePipelineActionRoleA0A9CB64",
                    "Arn"
                  ]
                },
                "RunOrder": 1
              }
            ],
            "Name": "Build"
          },
          {
            "Actions": [
              {
                "ActionTypeId": {
                  "Category": "Build",
                  "Owner": "AWS",
                  "Provider": "CodeBuild",
                  "Version": "1"
                },
                "Configuration": {
                  "ProjectName": {
                    "Ref": "CdkPipelineUpdatePipelineSelfMutation81360810"
                  }
                },
                "InputArtifacts": [
                  {
                    "Name": "Artifact_Build_Synth"
                  }
                ],
                "Name": "SelfMutate",
                "RoleArn": {
                  "Fn::GetAtt": [
                    "PipelineUpdatePipelineSelfMutateCodePipelineActionRole258195B5",
                    "Arn"
                  ]
                },
                "RunOrder": 1
              }
            ],
            "Name": "UpdatePipeline"
          },
          {
            "Actions": [
              {
                "ActionTypeId": {
                  "Category": "Build",
                  "Owner": "AWS",
                  "Provider": "CodeBuild",
                  "Version": "1"
                },
                "Configuration": {
                  "ProjectName": {
                    "Ref": "CdkPipelineAssetsFileAsset1416E4A07"
                  }
                },
                "InputArtifacts": [
                  {
                    "Name": "Artifact_Build_Synth"
                  }
                ],
                "Name": "FileAsset1",
                "RoleArn": {
                  "Fn::GetAtt": [
                    "CdkPipelineAssetsFileRoleDBBCC980",
                    "Arn"
                  ]
                },
                "RunOrder": 1
              },
              {
                "ActionTypeId": {
                  "Category": "Build",
                  "Owner": "AWS",
                  "Provider": "CodeBuild",
                  "Version": "1"
                },
                "Configuration": {
                  "ProjectName": {
                    "Ref": "CdkPipelineAssetsFileAsset2FD984081"
                  }
                },
                "InputArtifacts": [
                  {
                    "Name": "Artifact_Build_Synth"
                  }
                ],
                "Name": "FileAsset2",
                "RoleArn": {
                  "Fn::GetAtt": [
                    "CdkPipelineAssetsFileRoleDBBCC980",
                    "Arn"
                  ]
                },
                "RunOrder": 1
              },
              {
                "ActionTypeId": {
                  "Category": "Build",
                  "Owner": "AWS",
                  "Provider": "CodeBuild",
                  "Version": "1"
                },
                "Configuration": {
                  "ProjectName": {
                    "Ref": "CdkPipelineAssetsFileAsset3F5F50E93"
                  }
                },
                "InputArtifacts": [
                  {
                    "Name": "Artifact_Build_Synth"
                  }
                ],
                "Name": "FileAsset3",
                "RoleArn": {
                  "Fn::GetAtt": [
                    "CdkPipelineAssetsFileRoleDBBCC980",
                    "Arn"
                  ]
                },
                "RunOrder": 1
              },
              {
                "ActionTypeId": {
                  "Category": "Build",
                  "Owner": "AWS",
                  "Provider": "CodeBuild",
                  "Version": "1"
                },
                "Configuration": {
                  "ProjectName": {
                    "Ref": "CdkPipelineAssetsFileAsset4ACA86EDA"
                  }
                },
                "InputArtifacts": [
                  {
                    "Name": "Artifact_Build_Synth"
                  }
                ],
                "Name": "FileAsset4",
                "RoleArn": {
                  "Fn::GetAtt": [
                    "CdkPipelineAssetsFileRoleDBBCC980",
                    "Arn"
                  ]
                },
                "RunOrder": 1
              },
              {
                "ActionTypeId": {
                  "Category": "Build",
                  "Owner": "AWS",
                  "Provider": "CodeBuild",
                  "Version": "1"
                },
                "Configuration": {
                  "ProjectName": {
                    "Ref": "CdkPipelineAssetsFileAsset58C96EFED"
                  }
                },
                "InputArtifacts": [
                  {
                    "Name": "Artifact_Build_Synth"
                  }
                ],
                "Name": "FileAsset5",
                "RoleArn": {
                  "Fn::GetAtt": [
                    "CdkPipelineAssetsFileRoleDBBCC980",
                    "Arn"
                  ]
                },
                "RunOrder": 1
              }
            ],
            "Name": "Assets"
          },
          {
            "Actions": [
              {
                "ActionTypeId": {
                  "Category": "Approval",
                  "Owner": "AWS",
                  "Provider": "Manual",
                  "Version": "1"
                },
                "Name": "ManualApproval",
                "RoleArn": {
                  "Fn::GetAtt": [
                    "PipelinepetstorepipelinedevManualApprovalCodePipelineActionRole30A0DC24",
                    "Arn"
                  ]
                },
                "RunOrder": 2
              },
              {
                "ActionTypeId": {
                  "Category": "Build",
                  "Owner": "AWS",
                  "Provider": "CodeBuild",
                  "Version": "1"
                },
                "Configuration": {
                  "ProjectName": {
                    "Ref": "PipelinepetstorepipelinedevRunTestCommandsProject10E0BAC3"
                  }
                },
                "InputArtifacts": [
                  {
                    "Name": "Artifact_Source_GithubSource"
                  }
                ],
                "Name": "RunTestCommands",
                "RoleArn": {
                  "Fn::GetAtt": [
                    "PipelinepetstorepipelinedevRunTestCommandsCodePipelineActionRole8349E734",
                    "Arn"
                  ]
                },
                "RunOrder": 4
              },
              {
                "ActionTypeId": {
                  "Category": "Deploy",
                  "Owner": "AWS",
                  "Provider": "CloudFormation",
                  "Version": "1"
                },
                "Configuration": {
                  "StackName": "petstore-stack-dev",
                  "Capabilities": "CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND",
                  "RoleArn": {
                    "Fn::Join": [
                      "",
                      [
                        "arn:",
                        {
                          "Ref": "AWS::Partition"
                        },
                        ":iam::981237193288:role/cdk-hnb659fds-cfn-exec-role-981237193288-eu-central-1"
                      ]
                    ]
                  },
                  "ActionMode": "CHANGE_SET_REPLACE",
                  "ChangeSetName": "PipelineChange",
                  "TemplatePath": "Artifact_Build_Synth::assembly-petstore-pipeline-petstore-pipeline-dev/petstorepipelinepetstorepipelinedevpetstorestackdev26522B6B.template.json"
                },
                "InputArtifacts": [
                  {
                    "Name": "Artifact_Build_Synth"
                  }
                ],
                "Name": "petstore-stack-dev.Prepare",
                "RoleArn": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::981237193288:role/cdk-hnb659fds-deploy-role-981237193288-eu-central-1"
                    ]
                  ]
                },
                "RunOrder": 1
              },
              {
                "ActionTypeId": {
                  "Category": "Deploy",
                  "Owner": "AWS",
                  "Provider": "CloudFormation",
                  "Version": "1"
                },
                "Configuration": {
                  "StackName": "petstore-stack-dev",
                  "ActionMode": "CHANGE_SET_EXECUTE",
                  "ChangeSetName": "PipelineChange"
                },
                "Name": "petstore-stack-dev.Deploy",
                "RoleArn": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::981237193288:role/cdk-hnb659fds-deploy-role-981237193288-eu-central-1"
                    ]
                  ]
                },
                "RunOrder": 3
              }
            ],
            "Name": "petstore-pipeline-dev"
          },
          {
            "Actions": [
              {
                "ActionTypeId": {
                  "Category": "Approval",
                  "Owner": "AWS",
                  "Provider": "Manual",
                  "Version": "1"
                },
                "Name": "ManualApproval",
                "RoleArn": {
                  "Fn::GetAtt": [
                    "PipelinepetstorepipelineprodManualApprovalCodePipelineActionRole11C4B8CD",
                    "Arn"
                  ]
                },
                "RunOrder": 2
              },
              {
                "ActionTypeId": {
                  "Category": "Build",
                  "Owner": "AWS",
                  "Provider": "CodeBuild",
                  "Version": "1"
                },
                "Configuration": {
                  "ProjectName": {
                    "Ref": "PipelinepetstorepipelineprodRunTestCommandsProjectDF29B6A7"
                  }
                },
                "InputArtifacts": [
                  {
                    "Name": "Artifact_Source_GithubSource"
                  }
                ],
                "Name": "RunTestCommands",
                "RoleArn": {
                  "Fn::GetAtt": [
                    "PipelinepetstorepipelineprodRunTestCommandsCodePipelineActionRole84213FE3",
                    "Arn"
                  ]
                },
                "RunOrder": 4
              },
              {
                "ActionTypeId": {
                  "Category": "Deploy",
                  "Owner": "AWS",
                  "Provider": "CloudFormation",
                  "Version": "1"
                },
                "Configuration": {
                  "StackName": "petstore-stack-prod",
                  "Capabilities": "CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND",
                  "RoleArn": {
                    "Fn::Join": [
                      "",
                      [
                        "arn:",
                        {
                          "Ref": "AWS::Partition"
                        },
                        ":iam::981237193288:role/cdk-hnb659fds-cfn-exec-role-981237193288-us-east-1"
                      ]
                    ]
                  },
                  "ActionMode": "CHANGE_SET_REPLACE",
                  "ChangeSetName": "PipelineChange",
                  "TemplatePath": "Artifact_Build_Synth::assembly-petstore-pipeline-petstore-pipeline-prod/petstorepipelinepetstorepipelineprodpetstorestackprod72FCCFFC.template.json"
                },
                "InputArtifacts": [
                  {
                    "Name": "Artifact_Build_Synth"
                  }
                ],
                "Name": "petstore-stack-prod.Prepare",
                "Region": "us-east-1",
                "RoleArn": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::981237193288:role/cdk-hnb659fds-deploy-role-981237193288-us-east-1"
                    ]
                  ]
                },
                "RunOrder": 1
              },
              {
                "ActionTypeId": {
                  "Category": "Deploy",
                  "Owner": "AWS",
                  "Provider": "CloudFormation",
                  "Version": "1"
                },
                "Configuration": {
                  "StackName": "petstore-stack-prod",
                  "ActionMode": "CHANGE_SET_EXECUTE",
                  "ChangeSetName": "PipelineChange"
                },
                "Name": "petstore-stack-prod.Deploy",
                "Region": "us-east-1",
                "RoleArn": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::981237193288:role/cdk-hnb659fds-deploy-role-981237193288-us-east-1"
                    ]
                  ]
                },
                "RunOrder": 3
              }
            ],
            "Name": "petstore-pipeline-prod"
          }
        ],
        "ArtifactStores": [
          {
            "ArtifactStore": {
              "EncryptionKey": {
                "Id": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":kms:us-east-1:981237193288:alias/-supporttencryptionaliascc2b482b6632a1cefc6e"
                    ]
                  ]
                },
                "Type": "KMS"
              },
              "Location": "petstore-pipeline-supporteplicationbucketd6dadffd5817496ba8a7",
              "Type": "S3"
            },
            "Region": "us-east-1"
          },
          {
            "ArtifactStore": {
              "Location": {
                "Ref": "PipeBucket9BE9B45C"
              },
              "Type": "S3"
            },
            "Region": "eu-central-1"
          }
        ],
        "RestartExecutionOnUpdate": true
      },
      "DependsOn": [
        "PipelineRoleDefaultPolicyC7A05455",
        "PipelineRoleD68726F7"
      ],
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/Resource"
      }
    },
    "PipelineSourceGithubSourceWebhookResource05FA5D46": {
      "Type": "AWS::CodePipeline::Webhook",
      "Properties": {
        "Authentication": "GITHUB_HMAC",
        "AuthenticationConfiguration": {
          "SecretToken": "{{resolve:secretsmanager:alfcdk:SecretString:muller88-github-token::}}"
        },
        "Filters": [
          {
            "JsonPath": "$.ref",
            "MatchEquals": "refs/heads/{Branch}"
          }
        ],
        "TargetAction": "GithubSource",
        "TargetPipeline": {
          "Ref": "PipelineC660917D"
        },
        "TargetPipelineVersion": 1,
        "RegisterWithThirdParty": true
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/Source/GithubSource/WebhookResource"
      }
    },
    "PipelineBuildSynthCodePipelineActionRoleA0A9CB64": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "AWS": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::981237193288:root"
                    ]
                  ]
                }
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/Build/Synth/CodePipelineActionRole/Resource"
      }
    },
    "PipelineBuildSynthCodePipelineActionRoleDefaultPolicy883FAA33": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "codebuild:BatchGetBuilds",
                "codebuild:StartBuild",
                "codebuild:StopBuild"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "PipelineBuildSynthCdkBuildProject1250E181",
                  "Arn"
                ]
              }
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "PipelineBuildSynthCodePipelineActionRoleDefaultPolicy883FAA33",
        "Roles": [
          {
            "Ref": "PipelineBuildSynthCodePipelineActionRoleA0A9CB64"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/Build/Synth/CodePipelineActionRole/DefaultPolicy/Resource"
      }
    },
    "PipelineBuildSynthCdkBuildProjectRole808C155A": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": "codebuild.amazonaws.com"
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/Build/Synth/CdkBuildProject/Role/Resource"
      }
    },
    "PipelineBuildSynthCdkBuildProjectRoleDefaultPolicyE35C3CF9": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":logs:eu-central-1:981237193288:log-group:/aws/codebuild/",
                      {
                        "Ref": "PipelineBuildSynthCdkBuildProject1250E181"
                      }
                    ]
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":logs:eu-central-1:981237193288:log-group:/aws/codebuild/",
                      {
                        "Ref": "PipelineBuildSynthCdkBuildProject1250E181"
                      },
                      ":*"
                    ]
                  ]
                }
              ]
            },
            {
              "Action": [
                "codebuild:CreateReportGroup",
                "codebuild:CreateReport",
                "codebuild:UpdateReport",
                "codebuild:BatchPutTestCases",
                "codebuild:BatchPutCodeCoverages"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      "Ref": "AWS::Partition"
                    },
                    ":codebuild:eu-central-1:981237193288:report-group/",
                    {
                      "Ref": "PipelineBuildSynthCdkBuildProject1250E181"
                    },
                    "-*"
                  ]
                ]
              }
            },
            {
              "Action": [
                "s3:GetObject*",
                "s3:GetBucket*",
                "s3:List*",
                "s3:DeleteObject*",
                "s3:PutObject*",
                "s3:Abort*"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::GetAtt": [
                    "PipeBucket9BE9B45C",
                    "Arn"
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "PipeBucket9BE9B45C",
                          "Arn"
                        ]
                      },
                      "/*"
                    ]
                  ]
                }
              ]
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "PipelineBuildSynthCdkBuildProjectRoleDefaultPolicyE35C3CF9",
        "Roles": [
          {
            "Ref": "PipelineBuildSynthCdkBuildProjectRole808C155A"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/Build/Synth/CdkBuildProject/Role/DefaultPolicy/Resource"
      }
    },
    "PipelineBuildSynthCdkBuildProject1250E181": {
      "Type": "AWS::CodeBuild::Project",
      "Properties": {
        "Artifacts": {
          "Type": "CODEPIPELINE"
        },
        "Environment": {
          "ComputeType": "BUILD_GENERAL1_SMALL",
          "Image": "aws/codebuild/standard:4.0",
          "ImagePullCredentialsType": "CODEBUILD",
          "PrivilegedMode": false,
          "Type": "LINUX_CONTAINER"
        },
        "ServiceRole": {
          "Fn::GetAtt": [
            "PipelineBuildSynthCdkBuildProjectRole808C155A",
            "Arn"
          ]
        },
        "Source": {
          "BuildSpec": "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"pre_build\": {\n      \"commands\": [\n        \"yarn install && yarn global add aws-cdk\"\n      ]\n    },\n    \"build\": {\n      \"commands\": [\n        \"yarn synth\"\n      ]\n    }\n  },\n  \"artifacts\": {\n    \"base-directory\": \"cdk.out\",\n    \"files\": \"**/*\"\n  }\n}",
          "Type": "CODEPIPELINE"
        },
        "EncryptionKey": "alias/aws/s3"
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/Build/Synth/CdkBuildProject/Resource"
      }
    },
    "PipelineUpdatePipelineSelfMutateCodePipelineActionRole258195B5": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "AWS": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::981237193288:root"
                    ]
                  ]
                }
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/UpdatePipeline/SelfMutate/CodePipelineActionRole/Resource"
      }
    },
    "PipelineUpdatePipelineSelfMutateCodePipelineActionRoleDefaultPolicyE2077DE3": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "codebuild:BatchGetBuilds",
                "codebuild:StartBuild",
                "codebuild:StopBuild"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "CdkPipelineUpdatePipelineSelfMutation81360810",
                  "Arn"
                ]
              }
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "PipelineUpdatePipelineSelfMutateCodePipelineActionRoleDefaultPolicyE2077DE3",
        "Roles": [
          {
            "Ref": "PipelineUpdatePipelineSelfMutateCodePipelineActionRole258195B5"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/UpdatePipeline/SelfMutate/CodePipelineActionRole/DefaultPolicy/Resource"
      }
    },
    "PipelinepetstorepipelinedevManualApprovalCodePipelineActionRole30A0DC24": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "AWS": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::981237193288:root"
                    ]
                  ]
                }
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-dev/ManualApproval/CodePipelineActionRole/Resource"
      }
    },
    "PipelinepetstorepipelinedevRunTestCommandsCodePipelineActionRole8349E734": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "AWS": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::981237193288:root"
                    ]
                  ]
                }
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-dev/RunTestCommands/CodePipelineActionRole/Resource"
      }
    },
    "PipelinepetstorepipelinedevRunTestCommandsCodePipelineActionRoleDefaultPolicy9A1AF0A7": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "codebuild:BatchGetBuilds",
                "codebuild:StartBuild",
                "codebuild:StopBuild"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "PipelinepetstorepipelinedevRunTestCommandsProject10E0BAC3",
                  "Arn"
                ]
              }
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "PipelinepetstorepipelinedevRunTestCommandsCodePipelineActionRoleDefaultPolicy9A1AF0A7",
        "Roles": [
          {
            "Ref": "PipelinepetstorepipelinedevRunTestCommandsCodePipelineActionRole8349E734"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-dev/RunTestCommands/CodePipelineActionRole/DefaultPolicy/Resource"
      }
    },
    "PipelinepetstorepipelinedevRunTestCommandsProjectRole7837C224": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": "codebuild.amazonaws.com"
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-dev/RunTestCommands/Project/Role/Resource"
      }
    },
    "PipelinepetstorepipelinedevRunTestCommandsProjectRoleDefaultPolicy42AC241A": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":logs:eu-central-1:981237193288:log-group:/aws/codebuild/",
                      {
                        "Ref": "PipelinepetstorepipelinedevRunTestCommandsProject10E0BAC3"
                      }
                    ]
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":logs:eu-central-1:981237193288:log-group:/aws/codebuild/",
                      {
                        "Ref": "PipelinepetstorepipelinedevRunTestCommandsProject10E0BAC3"
                      },
                      ":*"
                    ]
                  ]
                }
              ]
            },
            {
              "Action": [
                "codebuild:CreateReportGroup",
                "codebuild:CreateReport",
                "codebuild:UpdateReport",
                "codebuild:BatchPutTestCases",
                "codebuild:BatchPutCodeCoverages"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      "Ref": "AWS::Partition"
                    },
                    ":codebuild:eu-central-1:981237193288:report-group/",
                    {
                      "Ref": "PipelinepetstorepipelinedevRunTestCommandsProject10E0BAC3"
                    },
                    "-*"
                  ]
                ]
              }
            },
            {
              "Action": "*",
              "Effect": "Allow",
              "Resource": "*"
            },
            {
              "Action": [
                "s3:GetObject*",
                "s3:GetBucket*",
                "s3:List*"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::GetAtt": [
                    "PipeBucket9BE9B45C",
                    "Arn"
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "PipeBucket9BE9B45C",
                          "Arn"
                        ]
                      },
                      "/*"
                    ]
                  ]
                }
              ]
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "PipelinepetstorepipelinedevRunTestCommandsProjectRoleDefaultPolicy42AC241A",
        "Roles": [
          {
            "Ref": "PipelinepetstorepipelinedevRunTestCommandsProjectRole7837C224"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-dev/RunTestCommands/Project/Role/DefaultPolicy/Resource"
      }
    },
    "PipelinepetstorepipelinedevRunTestCommandsProject10E0BAC3": {
      "Type": "AWS::CodeBuild::Project",
      "Properties": {
        "Artifacts": {
          "Type": "CODEPIPELINE"
        },
        "Environment": {
          "ComputeType": "BUILD_GENERAL1_SMALL",
          "Image": "aws/codebuild/standard:4.0",
          "ImagePullCredentialsType": "CODEBUILD",
          "PrivilegedMode": false,
          "Type": "LINUX_CONTAINER"
        },
        "ServiceRole": {
          "Fn::GetAtt": [
            "PipelinepetstorepipelinedevRunTestCommandsProjectRole7837C224",
            "Arn"
          ]
        },
        "Source": {
          "BuildSpec": "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"build\": {\n      \"commands\": [\n        \"set -eu\",\n        \"echo \\\"dev stage\\\"\",\n        \"echo 981237193288 id + eu-central-1 region\"\n      ]\n    }\n  }\n}",
          "Type": "CODEPIPELINE"
        },
        "EncryptionKey": "alias/aws/s3"
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-dev/RunTestCommands/Project/Resource"
      }
    },
    "PipelinepetstorepipelineprodManualApprovalCodePipelineActionRole11C4B8CD": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "AWS": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::981237193288:root"
                    ]
                  ]
                }
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-prod/ManualApproval/CodePipelineActionRole/Resource"
      }
    },
    "PipelinepetstorepipelineprodRunTestCommandsCodePipelineActionRole84213FE3": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "AWS": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::981237193288:root"
                    ]
                  ]
                }
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-prod/RunTestCommands/CodePipelineActionRole/Resource"
      }
    },
    "PipelinepetstorepipelineprodRunTestCommandsCodePipelineActionRoleDefaultPolicyD9EF8BA2": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "codebuild:BatchGetBuilds",
                "codebuild:StartBuild",
                "codebuild:StopBuild"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::GetAtt": [
                  "PipelinepetstorepipelineprodRunTestCommandsProjectDF29B6A7",
                  "Arn"
                ]
              }
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "PipelinepetstorepipelineprodRunTestCommandsCodePipelineActionRoleDefaultPolicyD9EF8BA2",
        "Roles": [
          {
            "Ref": "PipelinepetstorepipelineprodRunTestCommandsCodePipelineActionRole84213FE3"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-prod/RunTestCommands/CodePipelineActionRole/DefaultPolicy/Resource"
      }
    },
    "PipelinepetstorepipelineprodRunTestCommandsProjectRoleD6668445": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": "codebuild.amazonaws.com"
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-prod/RunTestCommands/Project/Role/Resource"
      }
    },
    "PipelinepetstorepipelineprodRunTestCommandsProjectRoleDefaultPolicy3708AE8C": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":logs:eu-central-1:981237193288:log-group:/aws/codebuild/",
                      {
                        "Ref": "PipelinepetstorepipelineprodRunTestCommandsProjectDF29B6A7"
                      }
                    ]
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":logs:eu-central-1:981237193288:log-group:/aws/codebuild/",
                      {
                        "Ref": "PipelinepetstorepipelineprodRunTestCommandsProjectDF29B6A7"
                      },
                      ":*"
                    ]
                  ]
                }
              ]
            },
            {
              "Action": [
                "codebuild:CreateReportGroup",
                "codebuild:CreateReport",
                "codebuild:UpdateReport",
                "codebuild:BatchPutTestCases",
                "codebuild:BatchPutCodeCoverages"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      "Ref": "AWS::Partition"
                    },
                    ":codebuild:eu-central-1:981237193288:report-group/",
                    {
                      "Ref": "PipelinepetstorepipelineprodRunTestCommandsProjectDF29B6A7"
                    },
                    "-*"
                  ]
                ]
              }
            },
            {
              "Action": "*",
              "Effect": "Allow",
              "Resource": "*"
            },
            {
              "Action": [
                "s3:GetObject*",
                "s3:GetBucket*",
                "s3:List*"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::GetAtt": [
                    "PipeBucket9BE9B45C",
                    "Arn"
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "PipeBucket9BE9B45C",
                          "Arn"
                        ]
                      },
                      "/*"
                    ]
                  ]
                }
              ]
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "PipelinepetstorepipelineprodRunTestCommandsProjectRoleDefaultPolicy3708AE8C",
        "Roles": [
          {
            "Ref": "PipelinepetstorepipelineprodRunTestCommandsProjectRoleD6668445"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-prod/RunTestCommands/Project/Role/DefaultPolicy/Resource"
      }
    },
    "PipelinepetstorepipelineprodRunTestCommandsProjectDF29B6A7": {
      "Type": "AWS::CodeBuild::Project",
      "Properties": {
        "Artifacts": {
          "Type": "CODEPIPELINE"
        },
        "Environment": {
          "ComputeType": "BUILD_GENERAL1_SMALL",
          "Image": "aws/codebuild/standard:4.0",
          "ImagePullCredentialsType": "CODEBUILD",
          "PrivilegedMode": false,
          "Type": "LINUX_CONTAINER"
        },
        "ServiceRole": {
          "Fn::GetAtt": [
            "PipelinepetstorepipelineprodRunTestCommandsProjectRoleD6668445",
            "Arn"
          ]
        },
        "Source": {
          "BuildSpec": "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"build\": {\n      \"commands\": [\n        \"set -eu\",\n        \"echo \\\"prod stage\\\"\",\n        \"echo 981237193288 id + us-east-1 region\"\n      ]\n    }\n  }\n}",
          "Type": "CODEPIPELINE"
        },
        "EncryptionKey": "alias/aws/s3"
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/Pipeline/petstore-pipeline-prod/RunTestCommands/Project/Resource"
      }
    },
    "CdkPipelineUpdatePipelineSelfMutationRole9B65198C": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": "codebuild.amazonaws.com"
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/CdkPipeline/UpdatePipeline/SelfMutation/Role/Resource"
      }
    },
    "CdkPipelineUpdatePipelineSelfMutationRoleDefaultPolicyAA8CCA2A": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":logs:eu-central-1:981237193288:log-group:/aws/codebuild/",
                      {
                        "Ref": "CdkPipelineUpdatePipelineSelfMutation81360810"
                      }
                    ]
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":logs:eu-central-1:981237193288:log-group:/aws/codebuild/",
                      {
                        "Ref": "CdkPipelineUpdatePipelineSelfMutation81360810"
                      },
                      ":*"
                    ]
                  ]
                }
              ]
            },
            {
              "Action": [
                "codebuild:CreateReportGroup",
                "codebuild:CreateReport",
                "codebuild:UpdateReport",
                "codebuild:BatchPutTestCases",
                "codebuild:BatchPutCodeCoverages"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      "Ref": "AWS::Partition"
                    },
                    ":codebuild:eu-central-1:981237193288:report-group/",
                    {
                      "Ref": "CdkPipelineUpdatePipelineSelfMutation81360810"
                    },
                    "-*"
                  ]
                ]
              }
            },
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": [
                "arn:*:iam::*:role/*-deploy-role-*",
                "arn:*:iam::*:role/*-publishing-role-*"
              ]
            },
            {
              "Action": "cloudformation:DescribeStacks",
              "Effect": "Allow",
              "Resource": "*"
            },
            {
              "Action": "s3:ListBucket",
              "Effect": "Allow",
              "Resource": "*"
            },
            {
              "Action": [
                "s3:GetObject*",
                "s3:GetBucket*",
                "s3:List*"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::GetAtt": [
                    "PipeBucket9BE9B45C",
                    "Arn"
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "PipeBucket9BE9B45C",
                          "Arn"
                        ]
                      },
                      "/*"
                    ]
                  ]
                }
              ]
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "CdkPipelineUpdatePipelineSelfMutationRoleDefaultPolicyAA8CCA2A",
        "Roles": [
          {
            "Ref": "CdkPipelineUpdatePipelineSelfMutationRole9B65198C"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/CdkPipeline/UpdatePipeline/SelfMutation/Role/DefaultPolicy/Resource"
      }
    },
    "CdkPipelineUpdatePipelineSelfMutation81360810": {
      "Type": "AWS::CodeBuild::Project",
      "Properties": {
        "Artifacts": {
          "Type": "CODEPIPELINE"
        },
        "Environment": {
          "ComputeType": "BUILD_GENERAL1_SMALL",
          "Image": "aws/codebuild/standard:4.0",
          "ImagePullCredentialsType": "CODEBUILD",
          "PrivilegedMode": false,
          "Type": "LINUX_CONTAINER"
        },
        "ServiceRole": {
          "Fn::GetAtt": [
            "CdkPipelineUpdatePipelineSelfMutationRole9B65198C",
            "Arn"
          ]
        },
        "Source": {
          "BuildSpec": "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"install\": {\n      \"commands\": \"npm install -g aws-cdk\"\n    },\n    \"build\": {\n      \"commands\": [\n        \"cdk -a . deploy petstore-pipeline --require-approval=never --verbose\"\n      ]\n    }\n  }\n}",
          "Type": "CODEPIPELINE"
        },
        "EncryptionKey": "alias/aws/s3"
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/CdkPipeline/UpdatePipeline/SelfMutation/Resource"
      }
    },
    "CdkPipelineAssetsFileRoleDBBCC980": {
      "Type": "AWS::IAM::Role",
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Principal": {
                "Service": "codebuild.amazonaws.com",
                "AWS": {
                  "Fn::Join": [
                    "",
                    [
                      "arn:",
                      {
                        "Ref": "AWS::Partition"
                      },
                      ":iam::981237193288:root"
                    ]
                  ]
                }
              }
            }
          ],
          "Version": "2012-10-17"
        }
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/CdkPipeline/Assets/FileRole/Resource"
      }
    },
    "CdkPipelineAssetsFileRoleDefaultPolicy43508724": {
      "Type": "AWS::IAM::Policy",
      "Properties": {
        "PolicyDocument": {
          "Statement": [
            {
              "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      "Ref": "AWS::Partition"
                    },
                    ":logs:eu-central-1:981237193288:log-group:/aws/codebuild/*"
                  ]
                ]
              }
            },
            {
              "Action": [
                "codebuild:CreateReportGroup",
                "codebuild:CreateReport",
                "codebuild:UpdateReport",
                "codebuild:BatchPutTestCases",
                "codebuild:BatchPutCodeCoverages"
              ],
              "Effect": "Allow",
              "Resource": {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      "Ref": "AWS::Partition"
                    },
                    ":codebuild:eu-central-1:981237193288:report-group/*"
                  ]
                ]
              }
            },
            {
              "Action": [
                "codebuild:BatchGetBuilds",
                "codebuild:StartBuild",
                "codebuild:StopBuild"
              ],
              "Effect": "Allow",
              "Resource": "*"
            },
            {
              "Action": "sts:AssumeRole",
              "Effect": "Allow",
              "Resource": "arn:*:iam::*:role/*-file-publishing-role-*"
            },
            {
              "Action": [
                "s3:GetObject*",
                "s3:GetBucket*",
                "s3:List*"
              ],
              "Effect": "Allow",
              "Resource": [
                {
                  "Fn::GetAtt": [
                    "PipeBucket9BE9B45C",
                    "Arn"
                  ]
                },
                {
                  "Fn::Join": [
                    "",
                    [
                      {
                        "Fn::GetAtt": [
                          "PipeBucket9BE9B45C",
                          "Arn"
                        ]
                      },
                      "/*"
                    ]
                  ]
                }
              ]
            }
          ],
          "Version": "2012-10-17"
        },
        "PolicyName": "CdkPipelineAssetsFileRoleDefaultPolicy43508724",
        "Roles": [
          {
            "Ref": "CdkPipelineAssetsFileRoleDBBCC980"
          }
        ]
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/CdkPipeline/Assets/FileRole/DefaultPolicy/Resource"
      }
    },
    "CdkPipelineAssetsFileAsset1416E4A07": {
      "Type": "AWS::CodeBuild::Project",
      "Properties": {
        "Artifacts": {
          "Type": "CODEPIPELINE"
        },
        "Environment": {
          "ComputeType": "BUILD_GENERAL1_SMALL",
          "Image": "aws/codebuild/standard:4.0",
          "ImagePullCredentialsType": "CODEBUILD",
          "PrivilegedMode": false,
          "Type": "LINUX_CONTAINER"
        },
        "ServiceRole": {
          "Fn::GetAtt": [
            "CdkPipelineAssetsFileRoleDBBCC980",
            "Arn"
          ]
        },
        "Source": {
          "BuildSpec": "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"install\": {\n      \"commands\": \"npm install -g cdk-assets\"\n    },\n    \"build\": {\n      \"commands\": [\n        \"cdk-assets --path \\\"assembly-petstore-pipeline-petstore-pipeline-dev/petstorepipelinepetstorepipelinedevpetstorestackdev26522B6B.assets.json\\\" --verbose publish \\\"392e2627a26f124347194605f96c8ed33d4552afcc2339b700ce6d6ce351eac1:981237193288-eu-central-1\\\"\",\n        \"cdk-assets --path \\\"assembly-petstore-pipeline-petstore-pipeline-prod/petstorepipelinepetstorepipelineprodpetstorestackprod72FCCFFC.assets.json\\\" --verbose publish \\\"392e2627a26f124347194605f96c8ed33d4552afcc2339b700ce6d6ce351eac1:981237193288-us-east-1\\\"\"\n      ]\n    }\n  }\n}",
          "Type": "CODEPIPELINE"
        },
        "EncryptionKey": "alias/aws/s3"
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/CdkPipeline/Assets/FileAsset1/Default/Resource"
      }
    },
    "CdkPipelineAssetsFileAsset2FD984081": {
      "Type": "AWS::CodeBuild::Project",
      "Properties": {
        "Artifacts": {
          "Type": "CODEPIPELINE"
        },
        "Environment": {
          "ComputeType": "BUILD_GENERAL1_SMALL",
          "Image": "aws/codebuild/standard:4.0",
          "ImagePullCredentialsType": "CODEBUILD",
          "PrivilegedMode": false,
          "Type": "LINUX_CONTAINER"
        },
        "ServiceRole": {
          "Fn::GetAtt": [
            "CdkPipelineAssetsFileRoleDBBCC980",
            "Arn"
          ]
        },
        "Source": {
          "BuildSpec": "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"install\": {\n      \"commands\": \"npm install -g cdk-assets\"\n    },\n    \"build\": {\n      \"commands\": [\n        \"cdk-assets --path \\\"assembly-petstore-pipeline-petstore-pipeline-dev/petstorepipelinepetstorepipelinedevpetstorestackdev26522B6B.assets.json\\\" --verbose publish \\\"c9ac4b3b65f3510a2088b7fd003de23d2aefac424025eb168725ce6769e3c176:981237193288-eu-central-1\\\"\",\n        \"cdk-assets --path \\\"assembly-petstore-pipeline-petstore-pipeline-prod/petstorepipelinepetstorepipelineprodpetstorestackprod72FCCFFC.assets.json\\\" --verbose publish \\\"c9ac4b3b65f3510a2088b7fd003de23d2aefac424025eb168725ce6769e3c176:981237193288-us-east-1\\\"\"\n      ]\n    }\n  }\n}",
          "Type": "CODEPIPELINE"
        },
        "EncryptionKey": "alias/aws/s3"
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/CdkPipeline/Assets/FileAsset2/Default/Resource"
      }
    },
    "CdkPipelineAssetsFileAsset3F5F50E93": {
      "Type": "AWS::CodeBuild::Project",
      "Properties": {
        "Artifacts": {
          "Type": "CODEPIPELINE"
        },
        "Environment": {
          "ComputeType": "BUILD_GENERAL1_SMALL",
          "Image": "aws/codebuild/standard:4.0",
          "ImagePullCredentialsType": "CODEBUILD",
          "PrivilegedMode": false,
          "Type": "LINUX_CONTAINER"
        },
        "ServiceRole": {
          "Fn::GetAtt": [
            "CdkPipelineAssetsFileRoleDBBCC980",
            "Arn"
          ]
        },
        "Source": {
          "BuildSpec": "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"install\": {\n      \"commands\": \"npm install -g cdk-assets\"\n    },\n    \"build\": {\n      \"commands\": [\n        \"cdk-assets --path \\\"assembly-petstore-pipeline-petstore-pipeline-dev/petstorepipelinepetstorepipelinedevpetstorestackdev26522B6B.assets.json\\\" --verbose publish \\\"f30fa759c8b0681807942e2baf014354d4addf11a103448990cfae4d2f8496ba:981237193288-eu-central-1\\\"\",\n        \"cdk-assets --path \\\"assembly-petstore-pipeline-petstore-pipeline-prod/petstorepipelinepetstorepipelineprodpetstorestackprod72FCCFFC.assets.json\\\" --verbose publish \\\"f30fa759c8b0681807942e2baf014354d4addf11a103448990cfae4d2f8496ba:981237193288-us-east-1\\\"\"\n      ]\n    }\n  }\n}",
          "Type": "CODEPIPELINE"
        },
        "EncryptionKey": "alias/aws/s3"
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/CdkPipeline/Assets/FileAsset3/Default/Resource"
      }
    },
    "CdkPipelineAssetsFileAsset4ACA86EDA": {
      "Type": "AWS::CodeBuild::Project",
      "Properties": {
        "Artifacts": {
          "Type": "CODEPIPELINE"
        },
        "Environment": {
          "ComputeType": "BUILD_GENERAL1_SMALL",
          "Image": "aws/codebuild/standard:4.0",
          "ImagePullCredentialsType": "CODEBUILD",
          "PrivilegedMode": false,
          "Type": "LINUX_CONTAINER"
        },
        "ServiceRole": {
          "Fn::GetAtt": [
            "CdkPipelineAssetsFileRoleDBBCC980",
            "Arn"
          ]
        },
        "Source": {
          "BuildSpec": "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"install\": {\n      \"commands\": \"npm install -g cdk-assets\"\n    },\n    \"build\": {\n      \"commands\": [\n        \"cdk-assets --path \\\"assembly-petstore-pipeline-petstore-pipeline-dev/petstorepipelinepetstorepipelinedevpetstorestackdev26522B6B.assets.json\\\" --verbose publish \\\"5b26a84196658ab56897bf41e543409d92a2b1094d33c454882470f9d739c4b3:981237193288-eu-central-1\\\"\"\n      ]\n    }\n  }\n}",
          "Type": "CODEPIPELINE"
        },
        "EncryptionKey": "alias/aws/s3"
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/CdkPipeline/Assets/FileAsset4/Default/Resource"
      }
    },
    "CdkPipelineAssetsFileAsset58C96EFED": {
      "Type": "AWS::CodeBuild::Project",
      "Properties": {
        "Artifacts": {
          "Type": "CODEPIPELINE"
        },
        "Environment": {
          "ComputeType": "BUILD_GENERAL1_SMALL",
          "Image": "aws/codebuild/standard:4.0",
          "ImagePullCredentialsType": "CODEBUILD",
          "PrivilegedMode": false,
          "Type": "LINUX_CONTAINER"
        },
        "ServiceRole": {
          "Fn::GetAtt": [
            "CdkPipelineAssetsFileRoleDBBCC980",
            "Arn"
          ]
        },
        "Source": {
          "BuildSpec": "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"install\": {\n      \"commands\": \"npm install -g cdk-assets\"\n    },\n    \"build\": {\n      \"commands\": [\n        \"cdk-assets --path \\\"assembly-petstore-pipeline-petstore-pipeline-prod/petstorepipelinepetstorepipelineprodpetstorestackprod72FCCFFC.assets.json\\\" --verbose publish \\\"26340fbe83798a7e9c425fa0f69ff0c1b4043a92882f69ca6d05578a9aa86701:981237193288-us-east-1\\\"\"\n      ]\n    }\n  }\n}",
          "Type": "CODEPIPELINE"
        },
        "EncryptionKey": "alias/aws/s3"
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/CdkPipeline/Assets/FileAsset5/Default/Resource"
      }
    },
    "CDKMetadata": {
      "Type": "AWS::CDK::Metadata",
      "Properties": {
        "Modules": "aws-cdk=1.80.0,@aws-cdk/assets=1.80.0,@aws-cdk/aws-apigateway=1.80.0,@aws-cdk/aws-applicationautoscaling=1.80.0,@aws-cdk/aws-autoscaling=1.80.0,@aws-cdk/aws-autoscaling-common=1.80.0,@aws-cdk/aws-autoscaling-hooktargets=1.80.0,@aws-cdk/aws-cloudformation=1.80.0,@aws-cdk/aws-cloudwatch=1.80.0,@aws-cdk/aws-codebuild=1.80.0,@aws-cdk/aws-codeguruprofiler=1.80.0,@aws-cdk/aws-codepipeline=1.80.0,@aws-cdk/aws-codepipeline-actions=1.80.0,@aws-cdk/aws-ec2=1.80.0,@aws-cdk/aws-ecr=1.80.0,@aws-cdk/aws-ecr-assets=1.80.0,@aws-cdk/aws-ecs=1.80.0,@aws-cdk/aws-elasticloadbalancingv2=1.80.0,@aws-cdk/aws-events=1.80.0,@aws-cdk/aws-events-targets=1.80.0,@aws-cdk/aws-iam=1.80.0,@aws-cdk/aws-kms=1.80.0,@aws-cdk/aws-lambda=1.80.0,@aws-cdk/aws-logs=1.80.0,@aws-cdk/aws-s3=1.80.0,@aws-cdk/aws-s3-assets=1.80.0,@aws-cdk/aws-s3-deployment=1.80.0,@aws-cdk/aws-servicediscovery=1.80.0,@aws-cdk/aws-sns=1.80.0,@aws-cdk/aws-sns-subscriptions=1.80.0,@aws-cdk/aws-sqs=1.80.0,@aws-cdk/aws-ssm=1.80.0,@aws-cdk/cloud-assembly-schema=1.80.0,@aws-cdk/core=1.80.0,@aws-cdk/custom-resources=1.80.0,@aws-cdk/cx-api=1.80.0,@aws-cdk/pipelines=1.80.0,@aws-cdk/region-info=1.80.0,jsii-runtime=node.js/v12.18.0"
      },
      "Metadata": {
        "aws:cdk:path": "petstore-pipeline/CDKMetadata/Default"
      }
    }
  },
  "Parameters": {
    "BootstrapVersion": {
      "Type": "AWS::SSM::Parameter::Value<String>",
      "Default": "/cdk-bootstrap/hnb659fds/version",
      "Description": "Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store."
    }
  },
  "Rules": {
    "CheckBootstrapVersion": {
      "Assertions": [
        {
          "Assert": {
            "Fn::Not": [
              {
                "Fn::Contains": [
                  [
                    "1",
                    "2",
                    "3"
                  ],
                  {
                    "Ref": "BootstrapVersion"
                  }
                ]
              }
            ]
          },
          "AssertDescription": "CDK bootstrap stack version 4 required. Please run 'cdk bootstrap' with a recent version of the CDK CLI."
        }
      ]
    }
  }
}