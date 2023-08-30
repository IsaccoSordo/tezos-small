import { WritableSignal } from '@angular/core';
import { Block, Transaction } from '../common';

// as for https://github.com/ng-bootstrap/ng-bootstrap/issues/4556
// in order for ngb-alert to display an error such error must be an object
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
