import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, map, switchMap } from 'rxjs';
import { TzktService } from '../services/tzkt.service';
import { TZKTActions } from '../state/tzkt.actions';
import { Injectable } from '@angular/core';
import { Block } from '../common';

@Injectable()
export class TZKTEffects {
  fetchBlocks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TZKTActions.fetchBlocks().type),
      switchMap(() => this.service.getBlocks()),
      switchMap((blocks) =>
        forkJoin(
          blocks.map((block) =>
            this.service
              .getTransactions(block.level)
              .pipe(map((transactions) => ({ ...block, transactions })))
          )
        )
      ),
      map((blocks: Block[]) => TZKTActions.storeBlocks({ blocks }))
    )
  );

  constructor(private actions$: Actions, private service: TzktService) {}
}
