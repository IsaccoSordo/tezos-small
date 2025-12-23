import { inject } from '@angular/core';
import { signalStoreFeature, withMethods, patchState, type } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  pipe,
  switchMap,
  interval,
  startWith,
  from,
  concatMap,
  map,
  toArray,
  of,
  EMPTY,
} from 'rxjs';
import { TZKTState } from '../../models';
import { TzktService } from '../../services/tzkt.service';
import { getRouteType } from './url-utils';

/**
 * Feature slice for blocks data loading.
 * Provides rxMethods for loading blocks with transaction counts and polling.
 */
export function withBlocksData() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods((store, service = inject(TzktService)) => ({
      /**
       * Loads blocks with transaction counts.
       * Uses concatMap to preserve block order when fetching transaction counts.
       */
      loadBlocks: rxMethod<{ pageSize: number; page: number }>(
        pipe(
          switchMap(({ pageSize, page }) =>
            service.getBlocks(pageSize, page).pipe(
              switchMap((blocks) =>
                blocks.length === 0
                  ? of(blocks)
                  : from(blocks).pipe(
                      concatMap((block) =>
                        service
                          .getTransactionsCount(block.level)
                          .pipe(
                            map((count) => ({ ...block, transactions: count }))
                          )
                      ),
                      toArray()
                    )
              ),
              tapResponse({
                next: (blocks) => patchState(store, { blocks }),
                error: (error: Error) =>
                  patchState(store, (state) => ({
                    errors: [...state.errors, error],
                  })),
              })
            )
          )
        )
      ),

      /**
       * Loads total block count.
       */
      loadBlocksCount: rxMethod<void>(
        pipe(
          switchMap(() =>
            service.getBlocksCount().pipe(
              tapResponse({
                next: (count) => patchState(store, { count }),
                error: (error: Error) =>
                  patchState(store, (state) => ({
                    errors: [...state.errors, error],
                  })),
              })
            )
          )
        )
      ),

      /**
       * Polls for block count only when on overview page.
       * Accepts Observable<string> of URLs - polls when on overview, stops otherwise.
       */
      pollBlocksCount: rxMethod<string>(
        pipe(
          switchMap((url) => {
            if (getRouteType(url) !== 'overview') {
              return EMPTY; // Stop polling when not on overview
            }
            return interval(60000).pipe(
              startWith(0),
              switchMap(() =>
                service.getBlocksCount().pipe(
                  tapResponse({
                    next: (count) => patchState(store, { count }),
                    error: (error: Error) =>
                      patchState(store, (state) => ({
                        errors: [...state.errors, error],
                      })),
                  })
                )
              )
            );
          })
        )
      ),
    }))
  );
}
