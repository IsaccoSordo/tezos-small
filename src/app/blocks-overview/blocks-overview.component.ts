import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { interval, switchMap, Subject } from 'rxjs';
import { TableData } from '../common';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/store.service';
import { TableComponent } from '../ui/table/table.component';

@Component({
  selector: 'app-blocks-overview',
  templateUrl: './blocks-overview.component.html',
  styleUrls: ['./blocks-overview.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlocksOverviewComponent implements OnInit {
  private service = inject(TzktService);
  private destroyRef = inject(DestroyRef);
  private refresh$ = new Subject<TableData>();

  store = inject(Store);
  blocks = this.store.state.blocks;
  count = this.store.state.count;

  ngOnInit(): void {
    // Initial fetch on component initialization
    this.service
      .getBlocksCount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    // Poll every 60 seconds
    interval(60000)
      .pipe(
        switchMap(() => this.service.getBlocksCount()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    // Handle table refresh events reactively
    this.refresh$
      .pipe(
        switchMap((event) =>
          this.service.getBlocks(event.pageSize, event.page),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  refreshView(event: TableData) {
    this.refresh$.next(event);
  }
}
