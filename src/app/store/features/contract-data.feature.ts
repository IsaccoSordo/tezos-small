import { inject } from '@angular/core';
import {
  signalStoreFeature,
  withMethods,
  patchState,
  type,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  pipe,
  switchMap,
  from,
  mergeMap,
  toArray,
  EMPTY,
  map,
  tap,
} from 'rxjs';
import { TZKTState } from '../../models';
import { ContractService } from '../../services/contract.service';
import { RATE_LIMIT } from '../../config/constants';
import { isContractAddress } from './url-utils';

export function withContractData() {
  return signalStoreFeature(
    { state: type<TZKTState>() },
    withMethods((store, service = inject(ContractService)) => ({
      loadContractEntrypoints: rxMethod<string>(
        pipe(
          switchMap((address) => {
            if (!address || !isContractAddress(address)) return EMPTY;

            return service
              .getContractEntrypoints(address)
              .pipe(tap((entrypoints) => patchState(store, { entrypoints })));
          })
        )
      ),

      loadContractStorage: rxMethod<string>(
        pipe(
          switchMap((address) => {
            if (!address || !isContractAddress(address)) return EMPTY;

            return service
              .getContractStorage(address)
              .pipe(tap((storage) => patchState(store, { storage })));
          })
        )
      ),

      loadContractInterface: rxMethod<string>(
        pipe(
          switchMap((address) => {
            if (!address || !isContractAddress(address)) return EMPTY;

            return service
              .getContractInterface(address)
              .pipe(
                tap((contractInterface) =>
                  patchState(store, { contractInterface })
                )
              );
          })
        )
      ),

      loadContractViews: rxMethod<string>(
        pipe(
          switchMap((address) => {
            if (!address || !isContractAddress(address)) return EMPTY;

            return service
              .getContractViews(address)
              .pipe(
                tap((contractViews) => patchState(store, { contractViews }))
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

            return from([
              service
                .getContractEventsCount(address)
                .pipe(map((count) => ({ type: 'count' as const, count }))),
              service
                .getContractEvents(address, pageSize, page * pageSize)
                .pipe(map((events) => ({ type: 'events' as const, events }))),
            ]).pipe(
              mergeMap((obs) => obs, RATE_LIMIT.LOW),
              toArray(),
              tap((results) => {
                const countResult = results.find((r) => r.type === 'count');
                const eventsResult = results.find((r) => r.type === 'events');
                patchState(store, {
                  contractEvents:
                    eventsResult?.type === 'events' ? eventsResult.events : [],
                  contractEventsCount:
                    countResult?.type === 'count' ? countResult.count : 0,
                });
              })
            );
          })
        )
      ),

      loadContractDetails: rxMethod<string>(
        pipe(
          switchMap((address) => {
            if (!address || !isContractAddress(address)) return EMPTY;

            return from([
              service.getContractEntrypoints(address).pipe(
                map((entrypoints) => ({
                  type: 'entrypoints' as const,
                  entrypoints,
                }))
              ),
              service
                .getContractStorage(address)
                .pipe(
                  map((storage) => ({ type: 'storage' as const, storage }))
                ),
              service.getContractInterface(address).pipe(
                map((contractInterface) => ({
                  type: 'interface' as const,
                  contractInterface,
                }))
              ),
              service.getContractViews(address).pipe(
                map((contractViews) => ({
                  type: 'views' as const,
                  contractViews,
                }))
              ),
            ]).pipe(
              mergeMap((obs) => obs, RATE_LIMIT.DEFAULT),
              toArray(),
              tap((results) => {
                const entrypointsResult = results.find(
                  (r) => r.type === 'entrypoints'
                );
                const storageResult = results.find((r) => r.type === 'storage');
                const interfaceResult = results.find(
                  (r) => r.type === 'interface'
                );
                const viewsResult = results.find((r) => r.type === 'views');

                patchState(store, {
                  entrypoints:
                    entrypointsResult?.type === 'entrypoints'
                      ? entrypointsResult.entrypoints
                      : [],
                  storage:
                    storageResult?.type === 'storage'
                      ? storageResult.storage
                      : null,
                  contractInterface:
                    interfaceResult?.type === 'interface'
                      ? interfaceResult.contractInterface
                      : null,
                  contractViews:
                    viewsResult?.type === 'views'
                      ? viewsResult.contractViews
                      : [],
                });
              })
            );
          })
        )
      ),
    }))
  );
}
