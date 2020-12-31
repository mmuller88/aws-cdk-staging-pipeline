export interface StageAccount {
  account: Account,
  stage: string;
}

export interface Account {
  id: string;
  region: string;
}

export interface SharedAccountProps {
  stageAccount: StageAccount;
  domainName: string;
  subDomain: string;
  acmCertRef: string;
  hostedZoneId: string;
  zoneName: string;
  vpc: {
    vpcId: string;
    availabilityZones: string[];
  }
}