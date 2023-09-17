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

// as for https://github.com/ng-bootstrap/ng-bootstrap/issues/4556
// in order for ngb-alert to properly close an alert the error must be an object
export interface Error {
  text: string;
}
