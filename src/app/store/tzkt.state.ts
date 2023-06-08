import { Block, Transaction } from "../common";

export interface TZKTState {
    blocks: Block[];
    count: number;
    transactions: Transaction[],
    errors: string[];
    loadingCounter: number;
}

export const initialState: TZKTState = {
    blocks: [],
    count: 0,
    transactions: [],
    errors: [],
    loadingCounter: 0
}