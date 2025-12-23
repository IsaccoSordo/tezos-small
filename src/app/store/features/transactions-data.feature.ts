import { inject } from '@angular/core';
import { signalStoreFeature, withMethods, patchState, type } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap } from 'rxjs';
import { TZKTState } from '../../models';
import { TzktService } from '../../services/tzkt.service';

/**
 * Feature slice for transactions data loading.
 * Provides rxMethod for loading transactions by block level.
 */
export function withTransactionsData() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods((store, service = inject(TzktService)) => ({
      /**
       * Loads transactions for a block level.
       */
      loadTransactions: rxMethod<number>(
        pipe(
          switchMap((level) =>
            service.getTransactions(level).pipe(
              tapResponse({
                next: (transactions) => patchState(store, { transactions }),
                error: (error: Error) =>
                  patchState(store, (state) => ({
                    errors: [...state.errors, error],
                  })),
              })
            )
          )
        )
      ),
    }))
  );
}
