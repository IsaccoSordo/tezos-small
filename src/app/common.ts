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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface OAuthProvider {
  name: string;
  icon: string;
  color: string;
}

export interface OAuthCallbackResponse {
  accessToken: string;
  user: User;
  expiresIn: number;
}
