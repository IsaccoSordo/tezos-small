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
import { PageChangeEvent, CursorState, CursorDirection } from '../../models';
import { CursorPaginatorComponent } from '../cursor-paginator/cursor-paginator.component';
import { PAGINATION } from '../../config/constants';

export type PaginatorMode = 'standard' | 'cursor';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, TableModule, CursorPaginatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T = unknown> {
  bodyTemplate = contentChild<TemplateRef<unknown>>('body');

  data = input<T[]>([]);
  columns = input<{ field: string; header: string }[]>([]);
  totalRecords = input<number>(0);
  rows = input<number>(PAGINATION.DEFAULT_PAGE_SIZE);
  first = input<number>(0);
  scrollable = input<boolean>(true);
  scrollHeight = input<string>('600px');

  paginatorMode = input<PaginatorMode>('standard');
  cursorState = input<CursorState>({
    cursors: [],
    currentIndex: -1,
    hasMore: true,
  });

  pageChange = output<PageChangeEvent>();
  cursorNavigate = output<CursorDirection>();

  onPageChange(event: { first?: number | null; rows?: number | null }) {
    const first = event.first ?? 0;
    const rows = event.rows ?? PAGINATION.DEFAULT_PAGE_SIZE;
    const page = first ? Math.floor(first / rows) : 0;

    this.pageChange.emit({
      page: page,
      pageSize: rows,
    });
  }

  onCursorNavigate(direction: CursorDirection): void {
    this.cursorNavigate.emit(direction);
  }
}
