import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Block } from '../common';

export const TZKTActions = createActionGroup({
  source: 'tzkt',
  events: {
    'fetch blocks': props<{ limit: number; offset: number }>(),
    'store blocks': props<{ blocks: Block[] }>(),
    'fetch blocks count': emptyProps(),
    'store blocks count': props<{ count: number }>(),
  },
});
