import { SearchResult } from './search.model';
import {
  AccountInfo,
  ContractInfo,
  AccountOperation,
  ContractEntrypoint,
  ContractStorage,
  ContractInterface,
  ContractView,
  TokenBalance,
  ContractEvent,
} from './account.model';

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
  searchSuggestions: SearchResult[];
  account: AccountInfo | ContractInfo | null;
  accountOperations: AccountOperation[];
  accountOperationsCount: number;
  entrypoints: ContractEntrypoint[];
  storage: ContractStorage | null;
  contractInterface: ContractInterface | null;
  contractViews: ContractView[];
  tokenBalances: TokenBalance[];
  tokenBalancesCount: number;
  contractEvents: ContractEvent[];
  contractEventsCount: number;
  activeTab: string;
}
