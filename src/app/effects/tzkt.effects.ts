import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { TzktService } from '../services/tzkt.service';
import { TZKTActions } from '../store/tzkt.actions';
import { Injectable } from '@angular/core';
import { Block } from '../common';

@Injectable()
export class TZKTEffects {
  fetchBlocks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TZKTActions.fetchBlocks),
      switchMap(({ limit, offset }) => this.service.getBlocks(limit, offset)),
      switchMap((blocks) =>
        blocks.length > 0
          ? forkJoin(
              blocks.map((block) =>
                this.service
                  .getTransactionsCount(block.level)
                  .pipe(map((transactions) => ({ ...block, transactions })))
              )
            )
          : of([])
      ),
      map((blocks: Block[]) => TZKTActions.storeBlocks({ blocks }))
    )
  );

  fetchBlocksCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TZKTActions.fetchBlocksCount),
      switchMap(() => this.service.getBlocksCount()),
      map((count) => TZKTActions.storeBlocksCount({ count }))
    )
  );

  fetchTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TZKTActions.fetchTransactions),
      switchMap(({ level }) => this.service.getTransactions(level)),
      map((transactions) => TZKTActions.storeTransactions({ transactions }))
    )
  );

  constructor(private actions$: Actions, private service: TzktService) {}
}
