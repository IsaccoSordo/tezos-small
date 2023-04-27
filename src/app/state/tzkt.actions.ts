import { createActionGroup, emptyProps } from "@ngrx/store";

export const TZKTActions = createActionGroup({
    source: 'TZKT',
    events: {
        'GET Blocks': emptyProps()
    }
})