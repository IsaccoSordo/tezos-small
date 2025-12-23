import { signalStore, withState } from '@ngrx/signals';
import { TZKTState } from '../models';
import {
  withStateMutations,
  withBlocksData,
  withTransactionsData,
  withRouterSync,
} from './features';

/**
 * TZKT Signal Store - Orchestrator
 *
 * Uses composable signalStoreFeature functions for clean separation:
 * - withStateMutations: Basic setters and resetState
 * - withBlocksData: loadBlocks, loadBlocksCount, pollBlocksCount
 * - withTransactionsData: loadTransactions
 * - withRouterSync: handleRouteChange + Router event subscription in onInit
 *
 * The order of composition matters:
 * 1. withState - defines the initial state
 * 2. withStateMutations - basic state mutators (setters, resetState)
 * 3. withBlocksData - block loading rxMethods
 * 4. withTransactionsData - transaction loading rxMethods
 * 5. withRouterSync - router subscription (must come LAST, needs access to all methods)
 */
export const Store = signalStore(
  { providedIn: 'root' },

  // 1. Initial state
  withState<TZKTState>({
    blocks: [],
    count: 0,
    errors: [],
    loadingCounter: 0,
    transactions: [],
  }),

  // 2. Basic state mutators
  withStateMutations(),

  // 3. Block data loading features
  withBlocksData(),

  // 4. Transaction data loading features
  withTransactionsData(),

  // 5. Router synchronization (must be last - needs access to all methods)
  withRouterSync()
);
