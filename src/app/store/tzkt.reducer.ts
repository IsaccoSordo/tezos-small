import { createReducer, on } from '@ngrx/store';
import { initialState } from './tzkt.state';
import { TZKTActions } from './tzkt.actions';

export const tzktReducer = createReducer(
  initialState,
  on(TZKTActions.fetchBlocks, (state) => ({
    ...state,
    loadingCounter: state.loadingCounter + 1,
  })),
  on(TZKTActions.storeBlocks, (state, { blocks }) => ({
    ...state,
    blocks,
    loadingCounter: state.loadingCounter - 1,
  })),
  on(TZKTActions.fetchBlocksCount, (state) => ({
    ...state,
    loadingCounter: state.loadingCounter + 1,
  })),
  on(TZKTActions.storeBlocksCount, (state, { count }) => ({
    ...state,
    count,
    loadingCounter: state.loadingCounter - 1,
  })),
  on(TZKTActions.storeError, (state, { error }) => ({
    ...state,
    error,
    loadingCounter: state.loadingCounter - 1,
  })),
  on(TZKTActions.fetchTransactions, (state) => ({
    ...state,
    loadingCounter: state.loadingCounter + 1,
  })),
  on(TZKTActions.storeTransactions, (state, { transactions }) => ({
    ...state,
    transactions,
    loadingCounter: state.loadingCounter - 1,
  }))
);
