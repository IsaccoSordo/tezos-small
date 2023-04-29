import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TZKTState } from './tzkt.state';

export const tzktFeatureSelector = createFeatureSelector<TZKTState>('tzkt');

export const selectBlocks = createSelector(
  tzktFeatureSelector,
  (state) => state.blocks
);

export const selectBlocksCount = createSelector(
  tzktFeatureSelector,
  (state) => state.count
);

export const selectTransactions = createSelector(
  tzktFeatureSelector,
  (state) => state.transactions
);

export const selectError = createSelector(
  tzktFeatureSelector,
  (state) => state.error
);

export const selectLoadingCounter = createSelector(
  tzktFeatureSelector,
  (state) => state.loadingCounter
);
