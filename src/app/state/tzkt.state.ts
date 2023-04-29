import { Block } from "../common";

export interface TZKTState {
    blocks: Block[];
    count: number;
}

export const initialState: TZKTState = {
    blocks: [],
    count: 0
}