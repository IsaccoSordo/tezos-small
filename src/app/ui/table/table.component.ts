import { Component, input, Output, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { TableData } from 'src/app/common';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbPaginationModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  headers = input<string[]>([]);
  show = input<boolean>(false);
  count = input<number>(100);
  page = signal(1); // base value for paginator is 1 (not 0)
  pageSize = input<number>(10);
  maxSize = input<number>(10);
  paginator = input<boolean>(false);

  @Output() refresh: BehaviorSubject<TableData> = new BehaviorSubject(
    this.getSnapshot()
  );

  constructor() {
    effect(() => {
      // Track signal changes for snapshot updates
      this.count();
      this.pageSize();
    });
  }

  private getSnapshot(): TableData {
    return {
      count: this.count(),
      page: this.page(),
      pageSize: this.pageSize(),
    };
  }

  refreshView() {
    this.refresh.next(this.getSnapshot());
  }
}
