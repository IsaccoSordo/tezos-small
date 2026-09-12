import type { WritableSignal } from '@angular/core';
import type { Block, Transaction } from '../models';

export interface TZKTState {
  blocks: WritableSignal<Block[]>;
  count: WritableSignal<number>;
  transactions: WritableSignal<Transaction[]>;
  errors: WritableSignal<Error[]>;
  loadingCounter: WritableSignal<number>;
}
