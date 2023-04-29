import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { TzktService } from '../services/tzkt.service';
import { TZKTActions } from '../store/tzkt.actions';
import { Injectable } from '@angular/core';
import { Block } from '../common';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TZKTEffects {
  private handleError(error: HttpErrorResponse) {
    let message = '';

    if (error.status === 0) {
      message = error.error;
    } else {
      message = `${error.status}: ${error.message}`;
    }

    return of(TZKTActions.storeError({ error: message }));
  }

  fetchBlocks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TZKTActions.fetchBlocks),
      switchMap(({ limit, offset }) => this.service.getBlocks(limit, offset)),
      switchMap((blocks) =>
        forkJoin(
          blocks.map((block) =>
            this.service
              .getTransactionsCount(block.level)
              .pipe(map((transactions) => ({ ...block, transactions })))
          )
        )
      ),
      map((blocks: Block[]) => TZKTActions.storeBlocks({ blocks })),
      catchError(this.handleError)
    )
  );

  fetchBlocksCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TZKTActions.fetchBlocksCount),
      switchMap(() => this.service.getBlocksCount()),
      map((count) => TZKTActions.storeBlocksCount({ count })),
      catchError(this.handleError)
    )
  );

  fetchTransactions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TZKTActions.fetchTransactions),
      switchMap(({ level }) => this.service.getTransactions(level)),
      map((transactions) => TZKTActions.storeTransactions({ transactions })),
      catchError(this.handleError)
    )
  );

  constructor(private actions$: Actions, private service: TzktService) {}
}
