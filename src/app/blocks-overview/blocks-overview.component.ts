import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
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
export class BlocksOverviewComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Store handles all data loading via Router events
  store = inject(Store);
  blocks = this.store.blocks;
  count = this.store.count;

  // Pagination state derived from URL (source of truth) - purely for display
  private queryParams = toSignal(
    this.route.queryParams.pipe(
      map((params) => ({
        pageSize: +(params['pageSize'] ?? 10),
        page: +(params['page'] ?? 0),
      }))
    ),
    { initialValue: { pageSize: 10, page: 0 } }
  );

  pageSize = computed(() => this.queryParams().pageSize);
  currentPage = computed(() => this.queryParams().page);

  columns = [
    { field: 'hash', header: 'Hash' },
    { field: 'level', header: 'Level' },
    { field: 'transactions', header: 'Transactions' },
    { field: 'proposer', header: 'Proposer' },
    { field: 'timestamp', header: 'Timestamp' },
  ];

  /**
   * URL-driven pagination: only update URL, store reacts to Router events
   */
  onPageChange(event: PageChangeEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.page, pageSize: event.pageSize },
      queryParamsHandling: 'merge',
    });
  }
}
