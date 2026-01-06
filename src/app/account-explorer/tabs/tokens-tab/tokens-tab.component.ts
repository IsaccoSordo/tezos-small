import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TableComponent } from '../../../ui/table/table.component';
import { TokenBalance, PageChangeEvent } from '../../../models';
import { Store } from '../../../store/tzkt.store';
import { PAGINATION, HASH_DISPLAY } from '../../../config/constants';

@Component({
  selector: 'app-tokens-tab',
  templateUrl: './tokens-tab.component.html',
  styleUrls: ['./tokens-tab.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensTabComponent {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  queryParams = toSignal(
    this.route.queryParams.pipe(
      map((params) => ({
        pageSize: +(params['pageSize'] ?? PAGINATION.DEFAULT_PAGE_SIZE),
        page: +(params['page'] ?? PAGINATION.DEFAULT_PAGE),
      }))
    ),
    {
      initialValue: {
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
        page: PAGINATION.DEFAULT_PAGE,
      },
    }
  );

  tokens = this.store.tokenBalances;
  totalRecords = this.store.tokenBalancesCount;

  columns = [
    { field: 'token', header: 'Token' },
    { field: 'contract', header: 'Contract' },
    { field: 'tokenId', header: 'Token ID' },
    { field: 'balance', header: 'Balance' },
    { field: 'standard', header: 'Standard' },
  ];

  onPageChange(event: PageChangeEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.page, pageSize: event.pageSize },
      queryParamsHandling: 'merge',
    });
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
    return (
      address.slice(0, HASH_DISPLAY.PREFIX_LENGTH) +
      '...' +
      address.slice(-HASH_DISPLAY.SUFFIX_LENGTH)
    );
  }
}
