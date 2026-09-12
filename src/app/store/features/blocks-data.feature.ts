import { inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  EMPTY,
  from,
  interval,
  map,
  mergeMap,
  of,
  pipe,
  startWith,
  switchMap,
  tap,
  toArray,
} from 'rxjs';
import { POLLING, RATE_LIMIT } from '../../config/constants';
import type { TZKTState } from '../../models';
import { BlocksService } from '../../services/blocks.service';
import { getRouteType } from './url-utils';

export function withBlocksData() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods((store, service = inject(BlocksService)) => ({
      loadBlocks: rxMethod<{ pageSize: number; page: number }>(
        pipe(
          switchMap(({ pageSize, page }) =>
            service.getBlocks(pageSize, page).pipe(
              switchMap((blocks) =>
                blocks.length === 0
                  ? of(blocks)
                  : from(blocks).pipe(
                      mergeMap(
                        (block) =>
                          service.getTransactionsCount(block.level).pipe(
                            map((count) => ({
                              ...block,
                              transactions: count,
                            }))
                          ),
                        RATE_LIMIT.HIGH
                      ),
                      toArray()
                    )
              ),
              tap((blocks) => patchState(store, { blocks }))
            )
          )
        )
      ),

      loadBlocksCount: rxMethod<void>(
        pipe(
          switchMap(() =>
            service
              .getBlocksCount()
              .pipe(tap((count) => patchState(store, { count })))
          )
        )
      ),

      pollBlocksCount: rxMethod<string>(
        pipe(
          switchMap((url) => {
            if (getRouteType(url) !== 'overview') {
              return EMPTY;
            }
            return interval(POLLING.BLOCKS_COUNT_MS).pipe(
              startWith(0),
              switchMap(() =>
                service
                  .getBlocksCount()
                  .pipe(tap((count) => patchState(store, { count })))
              )
            );
          })
        )
      ),
    }))
  );
}
