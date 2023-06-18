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
    loadingCounter: state.loadingCounter > 0 ? state.loadingCounter - 1 : state.loadingCounter,
  })),
  on(TZKTActions.fetchBlocksCount, (state) => ({
    ...state,
    loadingCounter: state.loadingCounter + 1,
  })),
  on(TZKTActions.storeBlocksCount, (state, { count }) => ({
    ...state,
    count,
    loadingCounter: state.loadingCounter > 0 ? state.loadingCounter - 1 : state.loadingCounter,
  })),
  on(TZKTActions.storeError, (state, { error }) => ({
    ...state,
    errors: [...state.errors, error],
    loadingCounter: state.loadingCounter > 0 ? state.loadingCounter - 1 : state.loadingCounter,
  })),
  on(TZKTActions.clearError, (state, { error }) => ({
    ...state,
    errors: state.errors.filter((_err, i) => i !== state.errors.indexOf(error)),
  })),
  on(TZKTActions.fetchTransactions, (state) => ({
    ...state,
    loadingCounter: state.loadingCounter + 1,
  })),
  on(TZKTActions.storeTransactions, (state, { transactions }) => ({
    ...state,
    transactions,
    loadingCounter: state.loadingCounter > 0 ? state.loadingCounter - 1 : state.loadingCounter,
  }))
);
