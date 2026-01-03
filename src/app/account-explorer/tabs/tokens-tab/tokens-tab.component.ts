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
import { TokenBalance } from '../../../models';

@Component({
  selector: 'app-tokens-tab',
  templateUrl: './tokens-tab.component.html',
  styleUrls: ['./tokens-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensTabComponent {
  tokens = input<TokenBalance[]>([]);
  totalRecords = input<number>(0);
  pageSize = input<number>(10);
  currentPage = input<number>(0);

  pageChange = output<PageChangeEvent>();

  columns = [
    { field: 'token', header: 'Token' },
    { field: 'contract', header: 'Contract' },
    { field: 'tokenId', header: 'Token ID' },
    { field: 'balance', header: 'Balance' },
    { field: 'standard', header: 'Standard' },
  ];

  onPageChange(event: PageChangeEvent): void {
    this.pageChange.emit(event);
  }

  getTokenName(token: TokenBalance): string {
    return token.token.metadata?.name || 'Unknown Token';
  }

  getTokenSymbol(token: TokenBalance): string {
    return token.token.metadata?.symbol || '';
  }

  formatBalance(token: TokenBalance): string {
    const decimals = parseInt(token.token.metadata?.decimals || '0', 10);
    const balance = BigInt(token.balance);
    if (decimals === 0) {
      return balance.toString();
    }
    const divisor = BigInt(10 ** decimals);
    const intPart = balance / divisor;
    const decPart = balance % divisor;
    if (decPart === BigInt(0)) {
      return intPart.toString();
    }
    return `${intPart}.${decPart.toString().padStart(decimals, '0').replace(/0+$/, '')}`;
  }

  truncateAddress(address: string): string {
    return address.slice(0, 8) + '...' + address.slice(-6);
  }
}
