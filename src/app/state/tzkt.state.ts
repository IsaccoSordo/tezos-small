import { Block } from "../generic";

export interface TZKTState {
    blocks: Block[];
}

export const initialState: TZKTState = {
    blocks: []
}