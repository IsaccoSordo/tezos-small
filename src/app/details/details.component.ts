import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '../store/tzkt.store';
import { TableComponent } from '../ui/table/table.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent {
  store = inject(Store);
  transactions = this.store.transactions;

  columns = [
    { field: 'sender', header: 'Sender' },
    { field: 'target', header: 'Target' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
  ];
}
