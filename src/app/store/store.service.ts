import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { Block, Transaction } from '../common';

export type TZKTState = {
  blocks: Block[];
  count: number;
  errors: Error[];
  loadingCounter: number;
  transactions: Transaction[];
};

export const Store = signalStore(
  { providedIn: 'root' },
  withState<TZKTState>({
    blocks: [],
    count: 0,
    errors: [],
    loadingCounter: 0,
    transactions: [],
  }),
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
