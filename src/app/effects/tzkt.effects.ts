import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { TzktService } from '../services/tzkt.service';
import { TZKTActions } from '../state/tzkt.actions';
import { Injectable } from '@angular/core';

@Injectable()
export class TZKTEffects {
  fetchBlocks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TZKTActions.fetchBlocks().type),
      switchMap(() => this.service.getBlocks()),
      map((blocks) => TZKTActions.storeBlocks({ blocks }))
    )
  );

  constructor(private actions$: Actions, private service: TzktService) {}
}
