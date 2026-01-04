import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TableComponent } from '../../../ui/table/table.component';
import { AccountOperation, PageChangeEvent } from '../../../models';
import {
  PAGINATION,
  TEZOS,
  TIME,
  HASH_DISPLAY,
} from '../../../config/constants';

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
  pageSize = input<number>(PAGINATION.DEFAULT_PAGE_SIZE);
  currentPage = input<number>(PAGINATION.DEFAULT_PAGE);

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
    const xtz = !amount ? '0' : (amount / TEZOS.MUTEZ_PER_XTZ).toFixed(6);
    return `${xtz} ${TEZOS.SYMBOL}`;
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / TIME.MINUTE_MS);
    const diffHours = Math.floor(diffMs / TIME.HOUR_MS);
    const diffDays = Math.floor(diffMs / TIME.DAY_MS);

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
    return (
      hash.slice(0, HASH_DISPLAY.PREFIX_LENGTH) +
      '...' +
      hash.slice(-HASH_DISPLAY.SUFFIX_LENGTH)
    );
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
