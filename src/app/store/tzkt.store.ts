import { inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {
  signalStore,
  withState,
  withMethods,
  withHooks,
  patchState,
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
  filter,
  distinctUntilChanged,
  tap,
  EMPTY,
  merge,
  take,
} from 'rxjs';
import { Block, Transaction, TZKTState } from '../models';
import { TzktService } from '../services/tzkt.service';

// Route type for state management
type RouteType = 'overview' | 'details' | 'other';

// Helper functions for URL parsing
const parseUrl = (url: string) => {
  const urlObj = new URL(url, 'http://localhost');
  return {
    pathname: urlObj.pathname,
    params: urlObj.searchParams,
  };
};

const getRouteType = (url: string): RouteType => {
  const { pathname } = parseUrl(url);
  if (pathname === '/' || pathname === '') return 'overview';
  if (url.startsWith('/details/')) return 'details';
  return 'other';
};

const getPaginationParams = (url: string) => {
  const { params } = parseUrl(url);
  return {
    pageSize: +(params.get('pageSize') ?? 10),
    page: +(params.get('page') ?? 0),
  };
};

const getDetailsLevel = (url: string): number | null => {
  const match = url.match(/\/details\/(\d+)/);
  return match ? +match[1] : null;
};

export const Store = signalStore(
  { providedIn: 'root' },
  withState<TZKTState>({
    blocks: [],
    count: 0,
    errors: [],
    loadingCounter: 0,
    transactions: [],
  }),
  withMethods((store, service = inject(TzktService)) => ({
    setBlocks(blocks: Block[]): void {
      patchState(store, { blocks });
    },

    setCount(count: number): void {
      patchState(store, { count });
    },

    setTransactions(transactions: Transaction[]): void {
      patchState(store, { transactions });
    },

    setErrors(errors: Error[]): void {
      patchState(store, { errors });
    },

    incrementLoadingCounter(): void {
      patchState(store, (state) => ({
        loadingCounter: state.loadingCounter + 1,
      }));
    },

    decrementLoadingCounter(): void {
      patchState(store, (state) => ({
        loadingCounter: Math.max(0, state.loadingCounter - 1),
      }));
    },

    setLoadingCounter(count: number): void {
      patchState(store, { loadingCounter: count });
    },

    resetState(): void {
      patchState(store, {
        blocks: [],
        count: 0,
        transactions: [],
        errors: [],
        loadingCounter: 0,
      });
    },

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
        store.loadBlocks(
          currentUrl$.pipe(
            filter((url) => getRouteType(url) === 'overview'),
            map((url) => getPaginationParams(url)),
            distinctUntilChanged(
              (prev, curr) => prev.pageSize === curr.pageSize && prev.page === curr.page
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

        // Handle route changes (reset state) - no manual .subscribe()
        store.handleRouteChange(
          currentUrl$.pipe(map((url) => getRouteType(url)))
        );
      },
    };
  })
);
