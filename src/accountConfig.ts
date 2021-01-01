export interface StageAccount {
  /**
   * Account ID and region
   */
  account: Account;
  /**
   * Stage like dev, qa, prod
   */
  stage: string;
}

export interface Account {
  id: string;
  region: string;
}