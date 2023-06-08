import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TableData } from 'src/app/common';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @Input() headers: string[] = [];
  @Input() list: any[] = [];
  @Input() count: number = 100;
  @Input() page = 1; // base value for paginator is 1 (not 0)
  @Input() pageSize = 10;
  @Input() paginator: boolean = false;

  private readonly state: TableData = {
    count: this.count,
    page: this.page,
    pageSize: this.pageSize,
  };

  @Output() refresh: BehaviorSubject<TableData> = new BehaviorSubject(this.state);

  refreshView() {
    this.refresh.next(this.state);
  }
}
