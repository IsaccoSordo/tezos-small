import { Block } from "../common";

export interface TZKTState {
    blocks: Block[];
    count: number;
    error: string;
}

export const initialState: TZKTState = {
    blocks: [],
    count: 0,
    error: ''
}