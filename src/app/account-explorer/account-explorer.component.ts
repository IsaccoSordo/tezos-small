import {
  Component,
  inject,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';
import { Store } from '../store/tzkt.store';
import { PageChangeEvent } from '../ui/table/table.component';
import { AccountHeaderComponent } from './account-header/account-header.component';
import { OperationsTabComponent } from './tabs/operations-tab/operations-tab.component';
import { EntrypointsTabComponent } from './tabs/entrypoints-tab/entrypoints-tab.component';
import { StorageTabComponent } from './tabs/storage-tab/storage-tab.component';
import { CodeTabComponent } from './tabs/code-tab/code-tab.component';
import { ViewsTabComponent } from './tabs/views-tab/views-tab.component';
import { TokensTabComponent } from './tabs/tokens-tab/tokens-tab.component';
import { EventsTabComponent } from './tabs/events-tab/events-tab.component';
import { isContractAddress } from '../store/features';

interface TabConfig {
  label: string;
  value: string;
}

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

  private routeParams = toSignal(
    this.route.params.pipe(map((params) => params['address'] as string)),
    { initialValue: '' }
  );

  private queryParams = toSignal(
    this.route.queryParams.pipe(
      map((params) => ({
        tab: (params['tab'] as string) ?? 'operations',
        pageSize: +(params['pageSize'] ?? 10),
        page: +(params['page'] ?? 0),
      }))
    ),
    { initialValue: { tab: 'operations', pageSize: 10, page: 0 } }
  );

  address = computed(() => this.routeParams());
  isContract = computed(() => isContractAddress(this.address()));
  activeTab = computed(() => this.queryParams().tab);
  pageSize = computed(() => this.queryParams().pageSize);
  currentPage = computed(() => this.queryParams().page);

  account = this.store.account;
  accountOperations = this.store.accountOperations;
  accountOperationsCount = this.store.accountOperationsCount;
  entrypoints = this.store.entrypoints;
  storage = this.store.storage;
  contractInterface = this.store.contractInterface;
  contractViews = this.store.contractViews;
  tokenBalances = this.store.tokenBalances;
  tokenBalancesCount = this.store.tokenBalancesCount;
  contractEvents = this.store.contractEvents;
  contractEventsCount = this.store.contractEventsCount;

  tabs = computed<TabConfig[]>(() => {
    const baseTabs: TabConfig[] = [
      { label: 'Operations', value: 'operations' },
    ];

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
      queryParams: { tab: String(tabValue), page: 0 },
      queryParamsHandling: 'merge',
    });
  }

  onPageChange(event: PageChangeEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: event.page, pageSize: event.pageSize },
      queryParamsHandling: 'merge',
    });
  }
}
