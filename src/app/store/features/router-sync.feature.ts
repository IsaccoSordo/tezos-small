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
  pairwise,
  startWith,
} from 'rxjs';
import { TZKTState } from '../../models';
import {
  getRouteType,
  getPaginationParams,
  getDetailsLevel,
  getAccountAddress,
  getAccountTab,
  isContractAddress,
} from './url-utils';

interface DataLoadingMethods {
  loadBlocks: (source: Observable<{ pageSize: number; page: number }>) => void;
  pollBlocksCount: (source: Observable<string>) => void;
  loadTransactions: (source: Observable<number>) => void;
  loadAccount: (source: Observable<string>) => void;
  loadAccountOperations: (
    source: Observable<{ address: string; pageSize: number; page: number }>
  ) => void;
  loadContractEntrypoints: (source: Observable<string>) => void;
  loadContractStorage: (source: Observable<string>) => void;
  loadContractInterface: (source: Observable<string>) => void;
  loadContractViews: (source: Observable<string>) => void;
  loadTokenBalances: (
    source: Observable<{ address: string; pageSize: number; page: number }>
  ) => void;
  loadContractEvents: (
    source: Observable<{ address: string; pageSize: number; page: number }>
  ) => void;
  clearAccountState: () => void;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [key: string]: Function;
}

export function withRouterSync() {
  return signalStoreFeature(
    { state: type<TZKTState>(), methods: type<DataLoadingMethods>() },
    withHooks((store) => {
      const router = inject(Router);

      return {
        onInit() {
          const navigationEnd$ = router.events.pipe(
            filter(
              (event): event is NavigationEnd => event instanceof NavigationEnd
            ),
            map((event) => event.urlAfterRedirects)
          );

          const initialUrl$ = router.navigated
            ? of(router.url)
            : navigationEnd$.pipe(take(1));

          const currentUrl$ = merge(initialUrl$, navigationEnd$).pipe(
            distinctUntilChanged()
          );

          // Blocks overview loading
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

          store.pollBlocksCount(currentUrl$);

          // Block details loading
          store.loadTransactions(
            currentUrl$.pipe(
              map((url) => getDetailsLevel(url)),
              filter((level): level is number => level !== null),
              distinctUntilChanged()
            )
          );

          // Account route handling
          const accountUrl$ = currentUrl$.pipe(
            filter((url) => getRouteType(url) === 'account')
          );

          const accountAddress$ = accountUrl$.pipe(
            map((url) => getAccountAddress(url)),
            filter((address): address is string => address !== null),
            distinctUntilChanged()
          );

          // Load account info when address changes
          store.loadAccount(accountAddress$);

          // Load operations when on operations tab
          store.loadAccountOperations(
            accountUrl$.pipe(
              map((url) => ({
                address: getAccountAddress(url),
                tab: getAccountTab(url),
                ...getPaginationParams(url),
              })),
              filter(
                (
                  params
                ): params is {
                  address: string;
                  pageSize: number;
                  page: number;
                  tab: string;
                } => params.address !== null && params.tab === 'operations'
              ),
              distinctUntilChanged(
                (prev, curr) =>
                  prev.address === curr.address &&
                  prev.pageSize === curr.pageSize &&
                  prev.page === curr.page
              )
            )
          );

          // Contract-specific tab loading
          const contractTabParams$ = accountUrl$.pipe(
            map((url) => ({
              address: getAccountAddress(url),
              tab: getAccountTab(url),
            })),
            filter(
              (params): params is { address: string; tab: string } =>
                params.address !== null && isContractAddress(params.address)
            )
          );

          // Load entrypoints when on entrypoints tab
          store.loadContractEntrypoints(
            contractTabParams$.pipe(
              filter((params) => params.tab === 'entrypoints'),
              map((params) => params.address),
              distinctUntilChanged()
            )
          );

          // Load storage when on storage tab
          store.loadContractStorage(
            contractTabParams$.pipe(
              filter((params) => params.tab === 'storage'),
              map((params) => params.address),
              distinctUntilChanged()
            )
          );

          // Load interface when on code tab
          store.loadContractInterface(
            contractTabParams$.pipe(
              filter((params) => params.tab === 'code'),
              map((params) => params.address),
              distinctUntilChanged()
            )
          );

          // Load views when on views tab
          store.loadContractViews(
            contractTabParams$.pipe(
              filter((params) => params.tab === 'views'),
              map((params) => params.address),
              distinctUntilChanged()
            )
          );

          // Load token balances when on tokens tab
          store.loadTokenBalances(
            accountUrl$.pipe(
              map((url) => ({
                address: getAccountAddress(url),
                tab: getAccountTab(url),
                ...getPaginationParams(url),
              })),
              filter(
                (
                  params
                ): params is {
                  address: string;
                  pageSize: number;
                  page: number;
                  tab: string;
                } => params.address !== null && params.tab === 'tokens'
              ),
              distinctUntilChanged(
                (prev, curr) =>
                  prev.address === curr.address &&
                  prev.pageSize === curr.pageSize &&
                  prev.page === curr.page
              )
            )
          );

          // Load events when on events tab (contracts only)
          store.loadContractEvents(
            accountUrl$.pipe(
              map((url) => ({
                address: getAccountAddress(url),
                tab: getAccountTab(url),
                ...getPaginationParams(url),
              })),
              filter(
                (
                  params
                ): params is {
                  address: string;
                  pageSize: number;
                  page: number;
                  tab: string;
                } =>
                  params.address !== null &&
                  params.tab === 'events' &&
                  isContractAddress(params.address)
              ),
              distinctUntilChanged(
                (prev, curr) =>
                  prev.address === curr.address &&
                  prev.pageSize === curr.pageSize &&
                  prev.page === curr.page
              )
            )
          );

          // Clear account state when leaving account route
          currentUrl$
            .pipe(
              startWith(''),
              pairwise(),
              filter(
                ([prev, curr]) =>
                  getRouteType(prev) === 'account' &&
                  getRouteType(curr) !== 'account'
              )
            )
            .subscribe(() => {
              store.clearAccountState();
            });
        },
      };
    })
  );
}
