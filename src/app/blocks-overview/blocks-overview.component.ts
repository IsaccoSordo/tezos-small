import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
  DestroyRef,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { timer, switchMap, take } from 'rxjs';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/tzkt.store';
import { TableComponent, PageChangeEvent } from '../ui/table/table.component';

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  store = inject(Store);
  blocks = this.store.blocks;
  count = this.store.count;

  // Pagination state
  currentPage = signal(0);
  pageSize = signal(10);

  columns = [
    { field: 'hash', header: 'Hash' },
    { field: 'level', header: 'Level' },
    { field: 'transactions', header: 'Transactions' },
    { field: 'proposer', header: 'Proposer' },
    { field: 'timestamp', header: 'Timestamp' },
  ];

  ngOnInit(): void {
    // Restore pagination state from query params
    this.route.queryParamMap.pipe(take(1)).subscribe((params) => {
      const page = params.get('page');
      const pageSize = params.get('pageSize');

      if (page !== null) {
        this.currentPage.set(Number(page));
      }
      if (pageSize !== null) {
        this.pageSize.set(Number(pageSize));
      }
    });

    // Fetch blocks count immediately and then poll every 60 seconds
    timer(0, 60000)
      .pipe(
        switchMap(() => this.service.getBlocksCount()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  onPageChange(event: PageChangeEvent): void {
    const page = event.page;
    const pageSize = event.pageSize;

    this.currentPage.set(page);
    this.pageSize.set(pageSize);

    // Update query params to preserve pagination state
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page, pageSize },
      queryParamsHandling: 'merge',
    });

    this.fetchBlocks();
  }

  private fetchBlocks(): void {
    const limit = this.pageSize();
    const offset = this.currentPage();

    this.service
      .getBlocks(limit, offset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
