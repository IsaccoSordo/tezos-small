import { inject } from '@angular/core';
import {
  signalStoreFeature,
  withMethods,
  patchState,
  type,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, forkJoin, EMPTY } from 'rxjs';
import { TZKTState } from '../../models';
import { AccountService } from '../../services/account.service';
import { isContractAddress } from './url-utils';

export function withAccountData() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods((store, service = inject(AccountService)) => ({
      loadAccount: rxMethod<string>(
        pipe(
          switchMap((address) => {
            if (!address) return EMPTY;

            const account$ = isContractAddress(address)
              ? service.getContract(address)
              : service.getAccount(address);

            return account$.pipe(
              tapResponse({
                next: (account) => patchState(store, { account }),
                error: (error: Error) =>
                  patchState(store, (state) => ({
                    errors: [...state.errors, error],
                  })),
              })
            );
          })
        )
      ),

      loadAccountOperations: rxMethod<{
        address: string;
        pageSize: number;
        page: number;
      }>(
        pipe(
          switchMap(({ address, pageSize, page }) => {
            if (!address) return EMPTY;

            return forkJoin({
              operations: service.getAccountOperations(
                address,
                pageSize,
                page * pageSize
              ),
              count: service.getAccountOperationsCount(address),
            }).pipe(
              tapResponse({
                next: ({ operations, count }) =>
                  patchState(store, {
                    accountOperations: operations,
                    accountOperationsCount: count,
                  }),
                error: (error: Error) =>
                  patchState(store, (state) => ({
                    errors: [...state.errors, error],
                  })),
              })
            );
          })
        )
      ),

      loadContractEntrypoints: rxMethod<string>(
        pipe(
          switchMap((address) => {
            if (!address || !isContractAddress(address)) return EMPTY;

            return service.getContractEntrypoints(address).pipe(
              tapResponse({
                next: (entrypoints) => patchState(store, { entrypoints }),
                error: (error: Error) =>
                  patchState(store, (state) => ({
                    errors: [...state.errors, error],
                  })),
              })
            );
          })
        )
      ),

      loadContractStorage: rxMethod<string>(
        pipe(
          switchMap((address) => {
            if (!address || !isContractAddress(address)) return EMPTY;

            return service.getContractStorage(address).pipe(
              tapResponse({
                next: (storage) => patchState(store, { storage }),
                error: (error: Error) =>
                  patchState(store, (state) => ({
                    errors: [...state.errors, error],
                  })),
              })
            );
          })
        )
      ),

      loadContractInterface: rxMethod<string>(
        pipe(
          switchMap((address) => {
            if (!address || !isContractAddress(address)) return EMPTY;

            return service.getContractInterface(address).pipe(
              tapResponse({
                next: (contractInterface) =>
                  patchState(store, { contractInterface }),
                error: (error: Error) =>
                  patchState(store, (state) => ({
                    errors: [...state.errors, error],
                  })),
              })
            );
          })
        )
      ),

      loadContractViews: rxMethod<string>(
        pipe(
          switchMap((address) => {
            if (!address || !isContractAddress(address)) return EMPTY;

            return service.getContractViews(address).pipe(
              tapResponse({
                next: (contractViews) => patchState(store, { contractViews }),
                error: (error: Error) =>
                  patchState(store, (state) => ({
                    errors: [...state.errors, error],
                  })),
              })
            );
          })
        )
      ),

      loadTokenBalances: rxMethod<{
        address: string;
        pageSize: number;
        page: number;
      }>(
        pipe(
          switchMap(({ address, pageSize, page }) => {
            if (!address) return EMPTY;

            return forkJoin({
              balances: service.getTokenBalances(
                address,
                pageSize,
                page * pageSize
              ),
              count: service.getTokenBalancesCount(address),
            }).pipe(
              tapResponse({
                next: ({ balances, count }) =>
                  patchState(store, {
                    tokenBalances: balances,
                    tokenBalancesCount: count,
                  }),
                error: (error: Error) =>
                  patchState(store, (state) => ({
                    errors: [...state.errors, error],
                  })),
              })
            );
          })
        )
      ),

      loadContractEvents: rxMethod<{
        address: string;
        pageSize: number;
        page: number;
      }>(
        pipe(
          switchMap(({ address, pageSize, page }) => {
            if (!address || !isContractAddress(address)) return EMPTY;

            return forkJoin({
              events: service.getContractEvents(
                address,
                pageSize,
                page * pageSize
              ),
              count: service.getContractEventsCount(address),
            }).pipe(
              tapResponse({
                next: ({ events, count }) =>
                  patchState(store, {
                    contractEvents: events,
                    contractEventsCount: count,
                  }),
                error: (error: Error) =>
                  patchState(store, (state) => ({
                    errors: [...state.errors, error],
                  })),
              })
            );
          })
        )
      ),

      clearAccountState: () => {
        patchState(store, {
          account: null,
          accountOperations: [],
          accountOperationsCount: 0,
          entrypoints: [],
          storage: null,
          contractInterface: null,
          contractViews: [],
          tokenBalances: [],
          tokenBalancesCount: 0,
          contractEvents: [],
          contractEventsCount: 0,
          activeTab: 'operations',
        });
      },
    }))
  );
}
