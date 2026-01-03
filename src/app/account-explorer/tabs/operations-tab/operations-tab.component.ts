import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  TableComponent,
  PageChangeEvent,
} from '../../../ui/table/table.component';
import { AccountOperation } from '../../../models';

@Component({
  selector: 'app-operations-tab',
  templateUrl: './operations-tab.component.html',
  styleUrls: ['./operations-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperationsTabComponent {
  operations = input<AccountOperation[]>([]);
  totalRecords = input<number>(0);
  pageSize = input<number>(10);
  currentPage = input<number>(0);

  pageChange = output<PageChangeEvent>();

  columns = [
    { field: 'type', header: 'Type' },
    { field: 'hash', header: 'Hash' },
    { field: 'level', header: 'Block' },
    { field: 'timestamp', header: 'Time' },
    { field: 'sender', header: 'From' },
    { field: 'target', header: 'To' },
    { field: 'amount', header: 'Amount' },
    { field: 'status', header: 'Status' },
  ];

  onPageChange(event: PageChangeEvent): void {
    this.pageChange.emit(event);
  }

  formatAmount(amount: number | undefined): string {
    if (amount === undefined || amount === null) return '-';
    return (amount / 1_000_000).toFixed(6) + ' XTZ';
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    return date.toLocaleDateString();
  }

  truncateHash(hash: string | undefined): string {
    if (!hash) return '-';
    return hash.slice(0, 8) + '...' + hash.slice(-6);
  }

  getTypeClass(type: string): string {
    const typeMap: Record<string, string> = {
      transaction: 'type-transaction',
      origination: 'type-origination',
      delegation: 'type-delegation',
      reveal: 'type-reveal',
      endorsement: 'type-endorsement',
      baking: 'type-baking',
    };
    return typeMap[type] || 'type-default';
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    const statusMap: Record<string, string> = {
      applied: 'status-applied',
      failed: 'status-failed',
      backtracked: 'status-backtracked',
      skipped: 'status-skipped',
    };
    return statusMap[status] || '';
  }
}
