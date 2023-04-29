import { Block, Transaction } from "../common";

export interface TZKTState {
    blocks: Block[];
    count: number;
    transactions: Transaction[],
    error: string;
}

export const initialState: TZKTState = {
    blocks: [],
    count: 0,
    transactions: [],
    error: ''
}