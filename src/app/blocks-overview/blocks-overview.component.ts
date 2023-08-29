import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Observable, Subscription, interval } from 'rxjs';
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

  private subs: Subscription[] = [];

  ngOnInit(): void {
    this.subs.push(this.getBlocksCount());
  }
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  private getBlocksCount(): Subscription {
    this.service.getBlocksCount();
    return interval(60000).subscribe(() => this.service.getBlocksCount()); // behind the scenes, the blocks count might increase
  }

  refreshView(event: TableData) {
    this.service.getBlocks(event.pageSize, event.page - 1); // the API offset param starts from 0
  }
}
