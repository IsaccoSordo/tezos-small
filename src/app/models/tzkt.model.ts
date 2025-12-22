/**
 * TZKT Domain Models
 *
 * Interfaces for Tezos blockchain data from the TZKT API.
 * These models represent the core domain entities.
 */

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

/**
 * State interface for TZKT SignalStore.
 * Defines the shape of the TZKT-related application state.
 */
export interface TZKTState {
  blocks: Block[];
  count: number;
  errors: Error[];
  loadingCounter: number;
  transactions: Transaction[];
}
