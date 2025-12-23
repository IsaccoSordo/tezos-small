import { inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {
  signalStoreFeature,
  withMethods,
  withHooks,
  patchState,
  type,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  pipe,
  filter,
  map,
  distinctUntilChanged,
  tap,
  merge,
  take,
  of,
  Observable,
} from 'rxjs';
import { TZKTState } from '../../models';
import { RouteType, getRouteType, getPaginationParams, getDetailsLevel } from './url-utils';

/**
 * Interface for the methods required from other features.
 * Router sync needs access to data loading methods.
 */
interface DataLoadingMethods {
  loadBlocks: (source: Observable<{ pageSize: number; page: number }>) => void;
  pollBlocksCount: (source: Observable<string>) => void;
  loadTransactions: (source: Observable<number>) => void;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [key: string]: Function;
}

/**
 * Feature slice for router synchronization.
 * Subscribes to Router events and triggers appropriate data loading.
 * Must be composed AFTER withBlocksData and withTransactionsData.
 */
export function withRouterSync() {
  return signalStoreFeature(
    { state: type<TZKTState>(), methods: type<DataLoadingMethods>() },
    withMethods((store) => ({
      /**
       * Handles route changes - resets state appropriately.
       * No manual .subscribe() - fully reactive via rxMethod.
       */
      handleRouteChange: rxMethod<RouteType>(
        pipe(
          distinctUntilChanged(),
          tap((route) => {
            if (route === 'overview') {
              patchState(store, { transactions: [], errors: [] });
            } else if (route === 'details') {
              patchState(store, { blocks: [], errors: [] });
            } else {
              // Full reset for other routes (like login)
              patchState(store, {
                blocks: [],
                count: 0,
                transactions: [],
                errors: [],
                loadingCounter: 0,
              });
            }
          })
        )
      ),
    })),
    withHooks((store) => {
      const router = inject(Router);

      return {
        onInit() {
          // NavigationEnd stream for all navigations
          const navigationEnd$ = router.events.pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            map((event) => event.urlAfterRedirects)
          );

          // On page refresh, router.url might be empty. We need to either:
          // 1. Use router.url if router has already navigated (router.navigated === true)
          // 2. Wait for the first NavigationEnd if router hasn't navigated yet
          const initialUrl$ = router.navigated
            ? of(router.url) // Router already navigated, use current URL
            : navigationEnd$.pipe(take(1)); // Wait for first navigation

          // Merge initial URL with subsequent navigations
          const currentUrl$ = merge(initialUrl$, navigationEnd$).pipe(
            distinctUntilChanged() // Avoid duplicate emissions
          );

          // Load blocks when on overview page
          store['loadBlocks'](
            currentUrl$.pipe(
              filter((url) => getRouteType(url) === 'overview'),
              map((url) => getPaginationParams(url)),
              distinctUntilChanged(
                (prev, curr) => prev.pageSize === curr.pageSize && prev.page === curr.page
              )
            )
          );

          // Poll for block count only while on overview page
          store['pollBlocksCount'](currentUrl$);

          // Load transactions when on details page
          store['loadTransactions'](
            currentUrl$.pipe(
              map((url) => getDetailsLevel(url)),
              filter((level): level is number => level !== null),
              distinctUntilChanged()
            )
          );

          // Handle route changes (reset state) - no manual .subscribe()
          store['handleRouteChange'](
            currentUrl$.pipe(map((url) => getRouteType(url)))
          );
        },
      };
    })
  );
}
