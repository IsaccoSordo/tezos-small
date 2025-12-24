import { signalStore, withState } from '@ngrx/signals';
import { TZKTState } from '../models';
import {
  withStateMutations,
  withBlocksData,
  withTransactionsData,
  withRouterSync,
} from './features';

export const Store = signalStore(
  { providedIn: 'root' },
  withState<TZKTState>({
    blocks: [],
    count: 0,
    errors: [],
    loadingCounter: 0,
    transactions: [],
  }),
  withStateMutations(),
  withBlocksData(),
  withTransactionsData(),
  withRouterSync()
);
