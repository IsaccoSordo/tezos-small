import { signalStoreFeature, withMethods, patchState, type } from '@ngrx/signals';
import { Block, Transaction, TZKTState } from '../../models';

/**
 * Feature slice for basic state mutations.
 * Provides setter methods and state reset functionality.
 */
export function withStateMutations() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods((store) => ({
      setBlocks(blocks: Block[]): void {
        patchState(store, { blocks });
      },

      setCount(count: number): void {
        patchState(store, { count });
      },

      setTransactions(transactions: Transaction[]): void {
        patchState(store, { transactions });
      },

      setErrors(errors: Error[]): void {
        patchState(store, { errors });
      },

      incrementLoadingCounter(): void {
        patchState(store, (state) => ({
          loadingCounter: state.loadingCounter + 1,
        }));
      },

      decrementLoadingCounter(): void {
        patchState(store, (state) => ({
          loadingCounter: Math.max(0, state.loadingCounter - 1),
        }));
      },

      setLoadingCounter(count: number): void {
        patchState(store, { loadingCounter: count });
      },

      resetState(): void {
        patchState(store, {
          blocks: [],
          count: 0,
          transactions: [],
          errors: [],
          loadingCounter: 0,
        });
      },
    }))
  );
}
