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
import { interval, switchMap } from 'rxjs';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/store.service';
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
  blocks = this.store.state.blocks;
  count = this.store.state.count;

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
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const page = params.get('page');
        const pageSize = params.get('pageSize');

        if (page !== null) {
          this.currentPage.set(Number(page));
        }
        if (pageSize !== null) {
          this.pageSize.set(Number(pageSize));
        }
      });

    // Initial fetch on component initialization
    this.service
      .getBlocksCount()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    // Note: Initial blocks fetch is handled by PrimeNG's lazy loading
    // The table will automatically trigger onLazyLoad when it initializes

    // Poll every 60 seconds
    interval(60000)
      .pipe(
        switchMap(() => this.service.getBlocksCount()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onPageChange(event: PageChangeEvent): void {
    // Ensure valid values with defaults
    const page = event.page ?? 0;
    const pageSize = event.pageSize ?? 10;

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
    const limit = this.pageSize() ?? 10;
    const offset = this.currentPage() ?? 0;

    this.service
      .getBlocks(limit, offset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
