import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { tap, forkJoin } from 'rxjs';
import { Block, Transaction } from '../models';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/tzkt.store';

/**
 * Resolver for blocks overview page.
 * Preloads blocks and count before navigation.
 */
export const blocksResolver: ResolveFn<Block[]> = (
  route: ActivatedRouteSnapshot
) => {
  const store = inject(Store);
  const service = inject(TzktService);

  const pageSize = +(route.queryParamMap.get('pageSize') ?? 10);
  const page = +(route.queryParamMap.get('page') ?? 0);

  return service
    .getBlocks(pageSize, page)
    .pipe(tap((blocks) => store.setBlocks(blocks)));
};

/**
 * Resolver for blocks count.
 * Preloads total block count before navigation.
 */
export const blocksCountResolver: ResolveFn<number> = () => {
  const store = inject(Store);
  const service = inject(TzktService);

  return service.getBlocksCount().pipe(tap((count) => store.setCount(count)));
};

/**
 * Combined resolver for blocks overview page.
 * Loads both blocks and count in parallel.
 */
export const blocksDataResolver: ResolveFn<{
  blocks: Block[];
  count: number;
}> = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const service = inject(TzktService);

  const pageSize = +(route.queryParamMap.get('pageSize') ?? 10);
  const page = +(route.queryParamMap.get('page') ?? 0);

  return forkJoin({
    blocks: service.getBlocks(pageSize, page),
    count: service.getBlocksCount(),
  }).pipe(
    tap(({ blocks, count }) => {
      store.setBlocks(blocks);
      store.setCount(count);
    })
  );
};

/**
 * Resolver for transaction details page.
 * Preloads transactions for a specific block level.
 */
export const transactionsResolver: ResolveFn<Transaction[]> = (
  route: ActivatedRouteSnapshot
) => {
  const store = inject(Store);
  const service = inject(TzktService);

  const level = +(route.paramMap.get('level') ?? 0);

  return service
    .getTransactions(level)
    .pipe(tap((transactions) => store.setTransactions(transactions)));
};
