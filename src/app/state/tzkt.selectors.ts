import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TZKTState } from "./tzkt.state";

export const tzktFeatureSelector = createFeatureSelector<TZKTState>('tzkt');

export const selectBlocks = createSelector(
    tzktFeatureSelector,
    (state) => state.blocks
)

export const selectBlocksCount = createSelector(
    tzktFeatureSelector,
    (state) => state.count
)