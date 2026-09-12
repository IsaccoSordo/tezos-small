import { inject } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import type { TZKTState } from '../../models';
import { BlocksService } from '../../services/blocks.service';

export function withTransactionsData() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods((store, service = inject(BlocksService)) => ({
      loadTransactions: rxMethod<number>(
        pipe(
          switchMap((level) =>
            service
              .getTransactions(level)
              .pipe(tap((transactions) => patchState(store, { transactions })))
          )
        )
      ),
    }))
  );
}
