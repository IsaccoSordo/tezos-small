import { WritableSignal } from '@angular/core';
import { Block, Transaction } from '../common';

export interface Error {
  text: string;
}

export interface TZKTState {
  blocks: WritableSignal<Block[]>;
  count: WritableSignal<number>;
  transactions: WritableSignal<Transaction[]>;
  errors: WritableSignal<Error[]>;
  loadingCounter: WritableSignal<number>;
}
