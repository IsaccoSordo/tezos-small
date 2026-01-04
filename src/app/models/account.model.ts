export type AddressType = 'user' | 'contract';

export interface AccountInfo {
  id: number;
  type: string;
  address: string;
  alias?: string;
  publicKey?: string;
  revealed?: boolean;
  balance: number;
  counter: number;
  delegate?: {
    alias?: string;
    address: string;
    active?: boolean;
  };
  delegationLevel?: number;
  delegationTime?: string;
  stakedBalance?: number;
  unstakedBalance?: number;
  firstActivity: number;
  firstActivityTime: string;
  lastActivity: number;
  lastActivityTime: string;
  numActivations?: number;
  numContracts: number;
  activeTokensCount: number;
  tokenBalancesCount: number;
  tokenTransfersCount: number;
  activeTicketsCount: number;
  ticketBalancesCount: number;
  ticketTransfersCount: number;
  numDelegations: number;
  numOriginations: number;
  numTransactions: number;
  numReveals?: number;
  numRegisterConstants?: number;
  numSetDepositsLimits?: number;
  numMigrations?: number;
  numDrainDelegates?: number;
}

export interface ContractInfo extends AccountInfo {
  kind: string;
  tzips?: string[];
  creator?: {
    alias?: string;
    address: string;
  };
  manager?: {
    alias?: string;
    address: string;
  };
  tokensCount: number;
  ticketsCount?: number;
  eventsCount?: number;
  codeHash: number;
  typeHash: number;
}

export interface AccountOperation {
  id: number;
  type: string;
  level: number;
  timestamp: string;
  block?: string;
  hash?: string;
  counter?: number;
  sender?: {
    alias?: string;
    address: string;
  };
  target?: {
    alias?: string;
    address: string;
  };
  initiator?: {
    alias?: string;
    address: string;
  };
  amount?: number;
  parameter?: {
    entrypoint: string;
    value: unknown;
  };
  storage?: unknown;
  status?: string;
  hasInternals?: boolean;
  gasUsed?: number;
  storageUsed?: number;
  bakerFee?: number;
  storageFee?: number;
  allocationFee?: number;
}

export interface ContractEntrypoint {
  name: string;
  jsonParameters: unknown;
  michelineParameters?: unknown;
  michelsonParameters?: string;
  unused: boolean;
}

export interface ContractView {
  name: string;
  jsonParameterType: unknown;
  jsonReturnType: unknown;
  michelineParameterType?: unknown;
  michelineReturnType?: unknown;
  michelsonParameterType?: string;
  michelsonReturnType?: string;
}

export interface TokenBalance {
  id: number;
  account: {
    alias?: string;
    address: string;
  };
  balance: string;
  transfersCount: number;
  firstLevel: number;
  firstTime: string;
  lastLevel: number;
  lastTime: string;
  token: {
    id: number;
    contract: {
      alias?: string;
      address: string;
    };
    tokenId: string;
    standard: string;
    totalSupply?: string;
    metadata?: {
      name?: string;
      symbol?: string;
      decimals?: string;
      description?: string;
      thumbnailUri?: string;
      displayUri?: string;
      artifactUri?: string;
    };
  };
}

export interface ContractEvent {
  id: number;
  level: number;
  timestamp: string;
  contract: {
    alias?: string;
    address: string;
  };
  codeHash: number;
  tag: string;
  payload?: unknown;
  transactionId: number;
  type?: unknown;
}

export type ContractStorage = Record<string, unknown>;

export interface ContractInterface {
  storageSchema: unknown;
  entrypoints: ContractEntrypoint[];
  bigMaps: {
    name: string;
    path: string;
    keyType: unknown;
    valueType: unknown;
  }[];
  events: {
    tag: string;
    type: unknown;
  }[];
}
