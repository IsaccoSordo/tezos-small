import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, interval } from 'rxjs';
import { selectBlocks, selectBlocksCount } from '../store/tzkt.selectors';
import { Block, TableData } from '../common';
import { TZKTActions } from '../store/tzkt.actions';

@Component({
  selector: 'app-blocks-overview',
  templateUrl: './blocks-overview.component.html',
  styleUrls: ['./blocks-overview.component.scss'],
})
export class BlocksOverviewComponent implements OnInit, OnDestroy {
  blocks$: Observable<Block[]> = this.store.select(selectBlocks);
  count$: Observable<number> = this.store.select(selectBlocksCount);
  private subs: Subscription[] = [];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.subs.push(this.getBlocksCount());
  }
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  private getBlocksCount(): Subscription {
    this.store.dispatch(TZKTActions.fetchBlocksCount());

    return interval(60000).subscribe(() =>
      this.store.dispatch(TZKTActions.fetchBlocksCount())
    ); // behind the scenes, the blocks count might increase
  }

  refreshView(event: TableData) {
    this.store.dispatch(
      TZKTActions.fetchBlocks({ limit: event.pageSize, offset: event.page - 1 }) // the API offset param starts from 0
    );
  }
}
