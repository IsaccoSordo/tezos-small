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
    // Initialize pagination state from query params (resolver already loaded data)
    const params = this.route.snapshot.queryParamMap;
    const page = params.get('page');
    const pageSize = params.get('pageSize');

    if (page) this.currentPage.set(+page);
    if (pageSize) this.pageSize.set(+pageSize);

    // Poll for block count every 60 seconds to keep data fresh
    interval(60000)
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

    // Navigate with new query params - resolver will fetch new data
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page, pageSize },
      queryParamsHandling: 'merge',
    });
  }
}
