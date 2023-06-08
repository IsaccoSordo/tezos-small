import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectBlocks, selectBlocksCount } from '../store/tzkt.selectors';
import { Block, TableData } from '../common';
import { TZKTActions } from '../store/tzkt.actions';

@Component({
  selector: 'app-blocks-overview',
  templateUrl: './blocks-overview.component.html',
  styleUrls: ['./blocks-overview.component.scss'],
})
export class BlocksOverviewComponent {
  blocks$: Observable<Block[]> = this.store.select(selectBlocks);
  count$: Observable<number> = this.store.select(selectBlocksCount);

  constructor(private store: Store) {}

  refreshView(event: TableData) {
    this.store.dispatch(TZKTActions.fetchBlocksCount()); // behind the scenes, the blocks count might increase
    this.store.dispatch(
      TZKTActions.fetchBlocks({ limit: event.pageSize, offset: event.page - 1 }) // the API offset param starts from 0
    );
  }
}
