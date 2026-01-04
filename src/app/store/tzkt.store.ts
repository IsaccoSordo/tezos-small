import { signalStore, withState } from '@ngrx/signals';
import { TZKTState } from '../models';
import {
  withStateMutations,
  withBlocksData,
  withTransactionsData,
  withAccountData,
  withContractData,
  withRouterSync,
} from './features';

export const Store = signalStore(
  { providedIn: 'root' },
  withState<TZKTState>({
    blocks: [],
    count: 0,
    loadingCounter: 0,
    transactions: [],
    account: null,
    accountOperations: [],
    accountOperationsCount: 0,
    entrypoints: [],
    storage: null,
    contractInterface: null,
    contractViews: [],
    tokenBalances: [],
    tokenBalancesCount: 0,
    contractEvents: [],
    contractEventsCount: 0,
    activeTab: 'operations',
  }),
  withStateMutations(),
  withBlocksData(),
  withTransactionsData(),
  withAccountData(),
  withContractData(),
  withRouterSync()
);
