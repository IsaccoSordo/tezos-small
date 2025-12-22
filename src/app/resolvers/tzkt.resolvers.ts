import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Transaction, Block } from '../models';
import { TzktService } from '../services/tzkt.service';

/**
 * Resolver for transactions on the details page.
 * Preloads transactions for a specific block level before rendering the component.
 */
export const transactionsResolver: ResolveFn<Transaction[]> = (
  route: ActivatedRouteSnapshot
) => {
  const service = inject(TzktService);
  const level = +(route.paramMap.get('level') ?? 0);

  return service.getTransactions(level);
};

/**
 * Resolver for blocks on the blocks overview page.
 * Preloads the initial page of blocks before rendering the component.
 * Reads pagination state from query parameters if available.
 */
export const blocksResolver: ResolveFn<Block[]> = (
  route: ActivatedRouteSnapshot
) => {
  const service = inject(TzktService);
  const page = +(route.queryParamMap.get('page') ?? 0);
  const pageSize = +(route.queryParamMap.get('pageSize') ?? 10);

  return service.getBlocks(pageSize, page);
};

/**
 * Resolver for total block count.
 * Preloads the block count for pagination display.
 */
export const blocksCountResolver: ResolveFn<number> = () => {
  const service = inject(TzktService);

  return service.getBlocksCount();
};
