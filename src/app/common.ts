export interface Block {
    hash: string;
    level: number;
    proposer?: Proposer;
    timestamp: string;
    transactions: number;
}

export interface Proposer {
    alias: string;
    address: string;
}