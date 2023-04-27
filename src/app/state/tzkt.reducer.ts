import { createReducer, on } from "@ngrx/store";
import { initialState } from "./tzkt.state";
import { TZKTActions } from "./tzkt.actions";

export const tzktReducer = createReducer(
    initialState,
    on(TZKTActions.storeBlocks, (state, {blocks}) => ({...state, blocks}))
)