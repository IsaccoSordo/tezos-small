import { inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { signalStoreFeature, withHooks, type } from '@ngrx/signals';
import {
  filter,
  map,
  distinctUntilChanged,
  merge,
  take,
  of,
  Observable,
} from 'rxjs';
import { TZKTState } from '../../models';
import {
  getRouteType,
  getPaginationParams,
  getDetailsLevel,
} from './url-utils';

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
    withHooks((store) => {
      const router = inject(Router);

      return {
        onInit() {
          // NavigationEnd stream for all navigations
          const navigationEnd$ = router.events.pipe(
            filter(
              (event): event is NavigationEnd => event instanceof NavigationEnd
            ),
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
          store.loadBlocks(
            currentUrl$.pipe(
              filter((url) => getRouteType(url) === 'overview'),
              map((url) => getPaginationParams(url)),
              distinctUntilChanged(
                (prev, curr) =>
                  prev.pageSize === curr.pageSize && prev.page === curr.page
              )
            )
          );

          // Poll for block count only while on overview page
          store.pollBlocksCount(currentUrl$);

          // Load transactions when on details page
          store.loadTransactions(
            currentUrl$.pipe(
              map((url) => getDetailsLevel(url)),
              filter((level): level is number => level !== null),
              distinctUntilChanged()
            )
          );
        },
      };
    })
  );
}
