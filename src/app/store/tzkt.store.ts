import { signalStore, withState } from '@ngrx/signals';
import { TZKTState } from '../models';
import {
  withStateMutations,
  withBlocksData,
  withTransactionsData,
  withAccountData,
  withContractData,
  withSearchData,
  withRouterSync,
} from './features';
import { DEFAULT_TAB } from '../config/constants';

export const Store = signalStore(
  { providedIn: 'root' },
  withState<TZKTState>({
    blocks: [],
    count: 0,
    loadingCounter: 0,
    transactions: [],
    searchSuggestions: [],
    account: null,
    accountOperations: [],
    accountOperationsCount: 0,
    operationsCursor: { cursors: [], currentIndex: -1, hasMore: true },
    entrypoints: [],
    storage: null,
    contractInterface: null,
    contractViews: [],
    tokenBalances: [],
    tokenBalancesCount: 0,
    contractEvents: [],
    contractEventsCount: 0,
    activeTab: DEFAULT_TAB,
  }),
  withStateMutations(),
  withBlocksData(),
  withTransactionsData(),
  withAccountData(),
  withContractData(),
  withSearchData(),
  withRouterSync()
);
