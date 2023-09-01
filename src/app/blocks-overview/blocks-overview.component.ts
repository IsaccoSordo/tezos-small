import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subject, Subscription, interval, takeUntil } from 'rxjs';
import { Block, TableData } from '../common';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/store.service';

@Component({
  selector: 'app-blocks-overview',
  templateUrl: './blocks-overview.component.html',
  styleUrls: ['./blocks-overview.component.scss'],
})
export class BlocksOverviewComponent implements OnInit, OnDestroy {
  service = inject(TzktService);
  store = inject(Store);

  blocks = this.store.state.blocks;
  count = this.store.state.count;

  private destroy$ = new Subject<boolean>();

  ngOnInit(): void {
    this.getBlocksCount();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private getBlocksCount() {
    this.service.getBlocksCount();
    interval(60000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.service.getBlocksCount()); // behind the scenes, the blocks count might increase
  }

  refreshView(event: TableData) {
    this.service.getBlocks(event.pageSize, event.page - 1); // the API offset param starts from 0
  }
}
