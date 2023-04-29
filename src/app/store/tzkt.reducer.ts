import { createReducer, on } from '@ngrx/store';
import { initialState } from './tzkt.state';
import { TZKTActions } from './tzkt.actions';

export const tzktReducer = createReducer(
  initialState,
  on(TZKTActions.storeBlocks, (state, { blocks }) => ({ ...state, blocks })),
  on(TZKTActions.storeBlocksCount, (state, { count }) => ({ ...state, count })),
  on(TZKTActions.storeError, (state, { error }) => ({ ...state, error })),
  on(TZKTActions.storeTransactions, (state, { transactions }) => ({
    ...state,
    transactions,
  }))
);
