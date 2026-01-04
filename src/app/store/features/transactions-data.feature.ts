import { inject } from '@angular/core';
import {
  signalStoreFeature,
  withMethods,
  patchState,
  type,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { TZKTState } from '../../models';
import { TzktService } from '../../services/tzkt.service';

export function withTransactionsData() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods((store, service = inject(TzktService)) => ({
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
