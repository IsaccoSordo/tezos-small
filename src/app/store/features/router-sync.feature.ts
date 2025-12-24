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

interface DataLoadingMethods {
  loadBlocks: (source: Observable<{ pageSize: number; page: number }>) => void;
  pollBlocksCount: (source: Observable<string>) => void;
  loadTransactions: (source: Observable<number>) => void;
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
