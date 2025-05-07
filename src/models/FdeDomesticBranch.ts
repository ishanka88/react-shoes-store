export interface BranchData {
    address: string;
    phones: string[];
  }
  
  export type FdeDomesticBranch = {
    [branchName: string]: BranchData;
  };