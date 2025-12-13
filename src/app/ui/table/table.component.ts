import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

export interface PageChangeEvent {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, TableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T = unknown> {
  // Inputs - data and configuration
  data = input<T[]>([]);
  columns = input<{ field: string; header: string }[]>([]);
  rowTemplate = input<TemplateRef<unknown> | null>(null);
  totalRecords = input<number>(0);
  rows = input<number>(10);
  first = input<number>(0); // Starting row index for pagination
  paginator = input<boolean>(false);
  scrollable = input<boolean>(true);
  scrollHeight = input<string>('600px');

  // Output - emit page change events
  pageChange = output<PageChangeEvent>();

  onPageChange(event: { first: number; rows: number }) {
    // PrimeNG lazy load event has 'first' (row index) and 'rows' (page size)
    // Convert first to page number: page = first / rows
    const page = event.first ? Math.floor(event.first / event.rows) : 0;

    this.pageChange.emit({
      page: page,
      pageSize: event.rows ?? 10,
    });
  }
}
