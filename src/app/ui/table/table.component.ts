import {
  Component,
  input,
  output,
  contentChild,
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
  bodyTemplate = contentChild<TemplateRef<unknown>>('body');

  data = input<T[]>([]);
  columns = input<{ field: string; header: string }[]>([]);
  totalRecords = input<number>(0);
  rows = input<number>(10);
  first = input<number>(0);
  paginator = input<boolean>(false);
  scrollable = input<boolean>(true);
  scrollHeight = input<string>('600px');

  pageChange = output<PageChangeEvent>();

  onPageChange(event: { first?: number | null; rows?: number | null }) {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    const page = first ? Math.floor(first / rows) : 0;

    this.pageChange.emit({
      page: page,
      pageSize: rows,
    });
  }
}
