export interface Account {
  alias: string;
  address: string;
}

export interface Block {
  hash: string;
  level: number;
  proposer?: Account;
  timestamp: string;
  transactions: number;
}

export interface Transaction {
  sender: Account;
  target: Account;
  amount: number;
  status: string;
}

export interface TZKTState {
  blocks: Block[];
  count: number;
  loadingCounter: number;
  transactions: Transaction[];
  // Account explorer state
  account:
    | import('./account.model').AccountInfo
    | import('./account.model').ContractInfo
    | null;
  accountOperations: import('./account.model').AccountOperation[];
  accountOperationsCount: number;
  entrypoints: import('./account.model').ContractEntrypoint[];
  storage: import('./account.model').ContractStorage | null;
  contractInterface: import('./account.model').ContractInterface | null;
  contractViews: import('./account.model').ContractView[];
  tokenBalances: import('./account.model').TokenBalance[];
  tokenBalancesCount: number;
  contractEvents: import('./account.model').ContractEvent[];
  contractEventsCount: number;
  activeTab: string;
}
