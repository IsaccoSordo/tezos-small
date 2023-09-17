import { WritableSignal } from '@angular/core';
import { Block, Transaction, Error } from '../common';

export interface TZKTState {
  blocks: WritableSignal<Block[]>;
  count: WritableSignal<number>;
  transactions: WritableSignal<Transaction[]>;
  errors: WritableSignal<Error[]>;
  loadingCounter: WritableSignal<number>;
}
