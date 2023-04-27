import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Block } from '../common';

export const TZKTActions = createActionGroup({
  source: 'tzkt',
  events: {
    'fetch blocks': emptyProps(),
    'store blocks': props<{ blocks: Block[] }>(),
  },
});
