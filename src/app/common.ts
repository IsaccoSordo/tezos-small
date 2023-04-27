export interface Block {
    hash: string;
    level: number;
    proposer: Proposer;
    timestamp: string;
}

export interface Proposer {
    alias: string;
    address: string;
}