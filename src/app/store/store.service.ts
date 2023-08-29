import { Injectable, signal } from '@angular/core';
import { TZKTState } from './tzkt.state';

@Injectable({
  providedIn: 'root',
})
export class Store {
  readonly state: TZKTState = {
    blocks: signal([]),
    count: signal(0),
    errors: signal([]),
    loadingCounter: signal(0),
    transactions: signal([]),
  };
}
