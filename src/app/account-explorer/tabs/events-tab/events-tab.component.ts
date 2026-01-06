import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TableComponent } from '../../../ui/table/table.component';
import { PageChangeEvent } from '../../../models';
import { Store } from '../../../store/tzkt.store';
import { PAGINATION } from '../../../config/constants';

@Component({
  selector: 'app-events-tab',
  templateUrl: './events-tab.component.html',
  styleUrls: ['./events-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsTabComponent {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  queryParams = toSignal(
    this.route.queryParams.pipe(
      map((params) => ({
        pageSize: +(params['pageSize'] ?? PAGINATION.DEFAULT_PAGE_SIZE),
        page: +(params['page'] ?? PAGINATION.DEFAULT_PAGE),
      }))
    ),
    {
      initialValue: {
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
        page: PAGINATION.DEFAULT_PAGE,
      },
    }
  );

  events = this.store.contractEvents;
  totalRecords = this.store.contractEventsCount;

  columns = [
    { field: 'tag', header: 'Event Tag' },
    { field: 'level', header: 'Block' },
    { field: 'timestamp', header: 'Time' },
    { field: 'payload', header: 'Payload' },
  ];

  expandedEvents = new Set<number>();

  onPageChange(event: PageChangeEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.page, pageSize: event.pageSize },
      queryParamsHandling: 'merge',
    });
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatPayload(payload: unknown): string {
    if (!payload) return '-';
    return JSON.stringify(payload, null, 2);
  }

  toggleEvent(id: number): void {
    if (this.expandedEvents.has(id)) {
      this.expandedEvents.delete(id);
    } else {
      this.expandedEvents.add(id);
    }
  }

  isExpanded(id: number): boolean {
    return this.expandedEvents.has(id);
  }

  hasPayload(payload: unknown): boolean {
    return payload !== null && payload !== undefined;
  }
}
