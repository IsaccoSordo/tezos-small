import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import { AccountService } from './account.service';
import { Store } from '../store/tzkt.store';
import { loadingInterceptor } from '../interceptors/loading.interceptor';
import { AccountInfo, AccountOperation, TokenBalance } from '../models';
import { TZKT_API_BASE } from '../config/api.config';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;
  let store: InstanceType<typeof Store>;

  const mockAccount: AccountInfo = {
    id: 1,
    type: 'user',
    address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
    balance: 1500000,
    counter: 100,
    firstActivity: 1000,
    firstActivityTime: '2024-01-01T00:00:00Z',
    lastActivity: 2000,
    lastActivityTime: '2024-06-01T00:00:00Z',
    numContracts: 0,
    activeTokensCount: 1,
    tokenBalancesCount: 2,
    tokenTransfersCount: 10,
    activeTicketsCount: 0,
    ticketBalancesCount: 0,
    ticketTransfersCount: 0,
    numDelegations: 1,
    numOriginations: 0,
    numTransactions: 10,
  };

  const mockOperations: AccountOperation[] = [
    {
      id: 1,
      type: 'transaction',
      hash: 'op123',
      level: 100,
      timestamp: '2024-01-15T12:00:00Z',
      sender: { address: 'tz1sender', alias: 'Sender' },
      target: { address: 'tz1target', alias: 'Target' },
      amount: 1000000,
      status: 'applied',
    },
  ];

  const mockTokenBalances: TokenBalance[] = [
    {
      id: 1,
      account: { address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' },
      balance: '1000000',
      transfersCount: 5,
      firstLevel: 1000,
      firstTime: '2024-01-01T00:00:00Z',
      lastLevel: 2000,
      lastTime: '2024-06-01T00:00:00Z',
      token: {
        id: 1,
        contract: { address: 'KT1token' },
        tokenId: '0',
        standard: 'fa2',
        metadata: { name: 'Test', symbol: 'TST', decimals: '6' },
      },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpCache(),
        provideHttpClient(
          withInterceptors([withHttpCacheInterceptor(), loadingInterceptor])
        ),
        provideHttpClientTesting(),
        AccountService,
        Store,
      ],
    });
    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    httpMock.verify();
    store.resetState();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAccount', () => {
    it('should fetch account info', () => {
      let result: AccountInfo | undefined;
      service
        .getAccount('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb')
        .subscribe((account) => {
          result = account;
        });

      const req = httpMock.expectOne(
        `${TZKT_API_BASE}/accounts/tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockAccount);

      expect(result).toEqual(mockAccount);
    });

    it('should handle errors gracefully', () => {
      let errorOccurred = false;
      service.getAccount('invalid').subscribe({
        error: () => {
          errorOccurred = true;
        },
      });

      const req = httpMock.expectOne(`${TZKT_API_BASE}/accounts/invalid`);
      req.error(new ProgressEvent('Network error'));

      expect(errorOccurred).toBe(true);
    });
  });

  describe('getAccountOperations', () => {
    it('should fetch account operations without lastId for first page', () => {
      let result: AccountOperation[] | undefined;
      service
        .getAccountOperations('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb', 10)
        .subscribe((ops) => {
          result = ops;
        });

      const req = httpMock.expectOne(
        (req) =>
          req.url ===
            `${TZKT_API_BASE}/accounts/tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb/operations` &&
          req.params.get('limit') === '10' &&
          req.params.get('sort.desc') === 'id' &&
          !req.params.has('lastId')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockOperations);

      expect(result).toEqual(mockOperations);
    });

    it('should fetch account operations with lastId for cursor pagination', () => {
      let result: AccountOperation[] | undefined;
      service
        .getAccountOperations('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb', 10, 12345)
        .subscribe((ops) => {
          result = ops;
        });

      const req = httpMock.expectOne(
        (req) =>
          req.url ===
            `${TZKT_API_BASE}/accounts/tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb/operations` &&
          req.params.get('limit') === '10' &&
          req.params.get('sort.desc') === 'id' &&
          req.params.get('lastId') === '12345'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockOperations);

      expect(result).toEqual(mockOperations);
    });
  });

  describe('getTokenBalances', () => {
    it('should fetch token balances with pagination', () => {
      let result: TokenBalance[] | undefined;
      service
        .getTokenBalances('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb', 10, 0)
        .subscribe((balances) => {
          result = balances;
        });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${TZKT_API_BASE}/tokens/balances` &&
          req.params.get('account') ===
            'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' &&
          req.params.get('balance.ne') === '0' &&
          req.params.get('limit') === '10' &&
          req.params.get('offset') === '0'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTokenBalances);

      expect(result).toEqual(mockTokenBalances);
    });
  });

  describe('getTokenBalancesCount', () => {
    it('should fetch token balances count', () => {
      let result: number | undefined;
      service
        .getTokenBalancesCount('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb')
        .subscribe((count) => {
          result = count;
        });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${TZKT_API_BASE}/tokens/balances/count` &&
          req.params.get('account') ===
            'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' &&
          req.params.get('balance.ne') === '0'
      );
      expect(req.request.method).toBe('GET');
      req.flush(5);

      expect(result).toBe(5);
    });
  });
});
