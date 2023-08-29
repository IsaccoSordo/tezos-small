import { WritableSignal } from "@angular/core";
import { Block, Transaction } from "../common";

export interface TZKTState {
    blocks: WritableSignal<Block[]>;
    count: WritableSignal<number>;
    transactions: WritableSignal<Transaction[]>,
    errors: WritableSignal<string[]>;
    loadingCounter: WritableSignal<number>;
}