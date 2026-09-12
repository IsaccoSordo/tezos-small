import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { map } from 'rxjs';
import { DEFAULT_TAB, PAGINATION } from '../config/constants';
import type { TabConfig } from '../models';
import { isContractAddress } from '../store/features';
import { Store } from '../store/tzkt.store';
import { AccountHeaderComponent } from './account-header/account-header.component';
import { CodeTabComponent } from './tabs/code-tab/code-tab.component';
import { EntrypointsTabComponent } from './tabs/entrypoints-tab/entrypoints-tab.component';
import { EventsTabComponent } from './tabs/events-tab/events-tab.component';
import { OperationsTabComponent } from './tabs/operations-tab/operations-tab.component';
import { StorageTabComponent } from './tabs/storage-tab/storage-tab.component';
import { TokensTabComponent } from './tabs/tokens-tab/tokens-tab.component';
import { ViewsTabComponent } from './tabs/views-tab/views-tab.component';

@Component({
  selector: 'app-account-explorer',
  templateUrl: './account-explorer.component.html',
  styleUrls: ['./account-explorer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    AccountHeaderComponent,
    OperationsTabComponent,
    EntrypointsTabComponent,
    StorageTabComponent,
    CodeTabComponent,
    ViewsTabComponent,
    TokensTabComponent,
    EventsTabComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountExplorerComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  store = inject(Store);

  private address = toSignal(
    this.route.params.pipe(map((params) => params['address'] as string)),
    { initialValue: '' }
  );

  queryParams = toSignal(
    this.route.queryParams.pipe(
      map((params) => ({
        tab: (params['tab'] as string) ?? DEFAULT_TAB,
      }))
    ),
    { initialValue: { tab: DEFAULT_TAB } }
  );

  isContract = computed(() => isContractAddress(this.address()));

  account = this.store.account;

  tabs = computed<TabConfig[]>(() => {
    const baseTabs: TabConfig[] = [{ label: 'Operations', value: DEFAULT_TAB }];

    if (this.isContract()) {
      return [
        ...baseTabs,
        { label: 'Storage', value: 'storage' },
        { label: 'Code', value: 'code' },
        { label: 'Entrypoints', value: 'entrypoints' },
        { label: 'Views', value: 'views' },
        { label: 'Tokens', value: 'tokens' },
        { label: 'Events', value: 'events' },
      ];
    }

    return [...baseTabs, { label: 'Tokens', value: 'tokens' }];
  });

  onTabChange(tabValue: string | number | undefined): void {
    if (tabValue === undefined) return;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: String(tabValue), page: PAGINATION.DEFAULT_PAGE },
      queryParamsHandling: 'merge',
    });
  }
}
