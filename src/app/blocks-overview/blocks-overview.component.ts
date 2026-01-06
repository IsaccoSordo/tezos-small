import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Store } from '../store/tzkt.store';
import { TableComponent } from '../ui/table/table.component';
import { PageChangeEvent } from '../models';
import { PAGINATION } from '../config/constants';

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

  store = inject(Store);
  blocks = this.store.blocks;
  count = this.store.count;

  queryParams = toSignal(
    this.route.queryParams.pipe(
      map((params) => ({
        pageSize: +(params['pageSize'] ?? PAGINATION.DEFAULT_PAGE_SIZE),
        page: Math.max(0, +(params['page'] ?? PAGINATION.DEFAULT_PAGE)),
      }))
    ),
    {
      initialValue: {
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
        page: PAGINATION.DEFAULT_PAGE,
      },
    }
  );

  columns = [
    { field: 'hash', header: 'Hash' },
    { field: 'level', header: 'Level' },
    { field: 'transactions', header: 'Transactions' },
    { field: 'proposer', header: 'Proposer' },
    { field: 'timestamp', header: 'Timestamp' },
  ];

  onPageChange(event: PageChangeEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.page, pageSize: event.pageSize },
      queryParamsHandling: 'merge',
    });
  }
}
