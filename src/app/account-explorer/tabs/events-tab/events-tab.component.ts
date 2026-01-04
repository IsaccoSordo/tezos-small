import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableComponent } from '../../../ui/table/table.component';
import { ContractEvent, PageChangeEvent } from '../../../models';
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
  events = input<ContractEvent[]>([]);
  totalRecords = input<number>(0);
  pageSize = input<number>(PAGINATION.DEFAULT_PAGE_SIZE);
  currentPage = input<number>(PAGINATION.DEFAULT_PAGE);

  pageChange = output<PageChangeEvent>();

  columns = [
    { field: 'tag', header: 'Event Tag' },
    { field: 'level', header: 'Block' },
    { field: 'timestamp', header: 'Time' },
    { field: 'payload', header: 'Payload' },
  ];

  expandedEvents = new Set<number>();

  onPageChange(event: PageChangeEvent): void {
    this.pageChange.emit(event);
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
