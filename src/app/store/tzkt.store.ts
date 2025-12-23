import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, interval, startWith } from 'rxjs';
import { Block, Transaction, TZKTState } from '../models';
import { TzktService } from '../services/tzkt.service';

export const Store = signalStore(
  { providedIn: 'root' },
  withState<TZKTState>({
    blocks: [],
    count: 0,
    errors: [],
    loadingCounter: 0,
    transactions: [],
  }),
  withMethods((store, service = inject(TzktService)) => ({
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

    // Error handling is done by the error interceptor globally
    loadBlocks: rxMethod<{ pageSize: number; page: number }>(
      pipe(
        switchMap(({ pageSize, page }) =>
          service.getBlocks(pageSize, page).pipe(
            tapResponse({
              next: (blocks) => patchState(store, { blocks }),
              error: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
            })
          )
        )
      )
    ),

    loadBlocksCount: rxMethod<void>(
      pipe(
        switchMap(() =>
          service.getBlocksCount().pipe(
            tapResponse({
              next: (count) => patchState(store, { count }),
              error: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
            })
          )
        )
      )
    ),

    pollBlocksCount: rxMethod<number>(
      pipe(
        switchMap((intervalMs) =>
          interval(intervalMs).pipe(
            startWith(0),
            switchMap(() =>
              service.getBlocksCount().pipe(
                tapResponse({
                  next: (count) => patchState(store, { count }),
                  error: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
                })
              )
            )
          )
        )
      )
    ),

    loadTransactions: rxMethod<number>(
      pipe(
        switchMap((level) =>
          service.getTransactions(level).pipe(
            tapResponse({
              next: (transactions) => patchState(store, { transactions }),
              error: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
            })
          )
        )
      )
    ),
  }))
);
