import {
  Component,
  input,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountInfo, ContractInfo } from '../../models';
import { TEZOS } from '../../config/constants';
import { formatNumber } from '../../utils/format.utils';

@Component({
  selector: 'app-account-header',
  templateUrl: './account-header.component.html',
  styleUrls: ['./account-header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountHeaderComponent {
  account = input<AccountInfo | ContractInfo | null>(null);
  isContract = input<boolean>(false);

  balanceXTZ = computed(() => {
    const acc = this.account();
    return !acc || !acc.balance
      ? '0'
      : formatNumber(acc.balance / TEZOS.MUTEZ_PER_XTZ);
  });

  contractCreator = computed(() => {
    const acc = this.account();
    if (!acc || !this.isContract() || !('creator' in acc)) {
      return null;
    }
    return (acc as ContractInfo).creator;
  });

  tzips = computed(() => {
    const acc = this.account();
    if (!acc || !this.isContract() || !('tzips' in acc)) {
      return [];
    }
    return (acc as ContractInfo).tzips ?? [];
  });

  contractKind = computed(() => {
    const acc = this.account();
    if (!acc || !this.isContract() || !('kind' in acc)) {
      return null;
    }
    return (acc as ContractInfo).kind;
  });

  copyAddress(): void {
    const acc = this.account();
    if (!acc) {
      return;
    }
    navigator.clipboard.writeText(acc.address);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
