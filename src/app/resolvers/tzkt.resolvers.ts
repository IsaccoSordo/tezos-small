import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '../store/tzkt.store';
import { toObservable } from '@angular/core/rxjs-interop';

/**
 * Resolver for blocks overview page.
 * Preloads blocks and count before navigation.
 */
export const blocksResolver = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const pageSize = +(route.queryParamMap.get('pageSize') ?? 10);
  const page = +(route.queryParamMap.get('page') ?? 0);

  store.loadBlocks({ pageSize, page });

  return toObservable(store.blocks);
};

/**
 * Resolver for transaction details page.
 * Preloads transactions for a specific block level.
 */
export const transactionsResolver = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const level = +(route.paramMap.get('level') ?? 0);

  store.loadTransactions(level);

  return toObservable(store.transactions);
};
