import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  store = inject(Store);
  blocks = this.store.blocks;
  count = this.store.count;

  // Pagination state from query params
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
    const params = this.route.snapshot.queryParamMap;
    const page = params.get('page');
    const pageSize = params.get('pageSize');

    if (page) this.currentPage.set(+page);
    if (pageSize) this.pageSize.set(+pageSize);

    // Poll for block count every 60 seconds to keep data fresh
    this.store.pollBlocksCount(60000);
  }

  onPageChange(event: PageChangeEvent): void {
    const page = event.page;
    const pageSize = event.pageSize;

    this.currentPage.set(page);
    this.pageSize.set(pageSize);

    // Load new blocks for the page
    this.store.loadBlocks({ pageSize, page });

    // Update URL with new query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page, pageSize },
      queryParamsHandling: 'merge',
    });
  }
}
