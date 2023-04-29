import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectBlocks, selectBlocksCount } from '../store/tzkt.selectors';
import { Block } from '../common';
import { TZKTActions } from '../store/tzkt.actions';

@Component({
  selector: 'app-blocks-overview',
  templateUrl: './blocks-overview.component.html',
  styleUrls: ['./blocks-overview.component.scss'],
})
export class BlocksOverviewComponent implements OnInit {
  blocks$: Observable<Block[]> = this.store.select(selectBlocks);
  count$: Observable<number> = this.store.select(selectBlocksCount);
  page = 1; // base value for paginator is 1 (not 0)
  pageSize = 10;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.refreshView();
  }

  refreshView() {
    this.store.dispatch(TZKTActions.fetchBlocksCount()); // behind the scenes, the blocks count might increase
    this.store.dispatch(
      TZKTActions.fetchBlocks({ limit: this.pageSize, offset: this.page - 1 }) // the API offset param starts from 0
    );
  }
}
