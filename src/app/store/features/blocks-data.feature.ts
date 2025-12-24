import { inject } from '@angular/core';
import {
  signalStoreFeature,
  withMethods,
  patchState,
  type,
} from '@ngrx/signals';
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

export function withBlocksData() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods((store, service = inject(TzktService)) => ({
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

      pollBlocksCount: rxMethod<string>(
        pipe(
          switchMap((url) => {
            if (getRouteType(url) !== 'overview') {
              return EMPTY;
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
