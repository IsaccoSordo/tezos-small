import { Block } from "../common";

export interface TZKTState {
    blocks: Block[];
}

export const initialState: TZKTState = {
    blocks: []
}