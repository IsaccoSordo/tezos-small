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

export interface Account {
  alias: string;
  address: string;
}

export interface TableData {
  count: number;
  page: number;
  pageSize: number;
}

export interface TZKTState {
  blocks: Block[];
  count: number;
  errors: Error[];
  loadingCounter: number;
  transactions: Transaction[];
}
