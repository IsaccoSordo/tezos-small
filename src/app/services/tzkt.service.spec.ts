import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import { TzktService } from './tzkt.service';
import { Store } from '../store/tzkt.store';
import { loadingInterceptor } from '../interceptors/loading.interceptor';
import { Block, Transaction } from '../models';

/**
 * TzktService Test Suite
 *
 * Testing Best Practices Applied:
 * - Nested describe blocks organize tests by method/feature
 * - afterEach resets store state for test isolation
 * - Tests cover happy path, error handling, and loading states
 * - HttpTestingController verifies all HTTP interactions
 * - Service is pure HTTP layer - does not update store directly
 */
describe('TzktService', () => {
  let service: TzktService;
  let httpMock: HttpTestingController;
  let store: InstanceType<typeof Store>;

  const API_BASE = 'https://api.tzkt.io/v1';

  const mockBlocks = [
    {
      hash: 'abc123',
      level: 100,
      transactions: 0,
      proposer: { alias: 'Baker1' },
      timestamp: '2025-01-01T00:00:00Z',
    },
    {
      hash: 'def456',
      level: 101,
      transactions: 0,
      proposer: { alias: 'Baker2' },
      timestamp: '2025-01-01T00:01:00Z',
    },
  ];

  const mockTransactions = [
    {
      sender: { address: 'addr1', alias: 'User1' },
      target: { address: 'addr2', alias: 'User2' },
      amount: 100,
      status: 'applied',
    },
    {
      sender: { address: 'addr3', alias: 'User3' },
      target: { address: 'addr4', alias: 'User4' },
      amount: 200,
      status: 'applied',
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
        TzktService,
        Store,
      ],
    });
    service = TestBed.inject(TzktService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    httpMock.verify();
    // Reset store signals after each test
    store.resetState();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBlocksCount', () => {
    it('should fetch blocks count and return value', () => {
      let result: number | undefined;
      service.getBlocksCount().subscribe((count) => {
        result = count;
      });

      const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
      expect(req.request.method).toBe('GET');
      req.flush(5000);

      expect(result).toBe(5000);
    });

    it('should increment and decrement loading counter', () => {
      expect(store.loadingCounter()).toBe(0);

      service.getBlocksCount().subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
      req.flush(100);

      expect(store.loadingCounter()).toBe(0);
    });

    it('should handle errors gracefully', () => {
      let errorOccurred = false;
      service.getBlocksCount().subscribe({
        error: () => {
          errorOccurred = true;
        },
      });

      const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
      req.error(new ProgressEvent('Network error'));

      expect(errorOccurred).toBe(true);
    });
  });

  describe('getBlocks', () => {
    it('should fetch blocks and return them with transaction counts', () => {
      let result: Block[] | undefined;
      service.getBlocks(10, 0).subscribe((blocks) => {
        result = blocks;
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/blocks` &&
          req.params.get('limit') === '10' &&
          req.params.get('offset.pg') === '0' &&
          req.params.get('sort.desc') === 'level'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockBlocks);

      // Expect transaction count requests for each block
      const txReq1 = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/operations/transactions/count` &&
          req.params.get('level') === '100'
      );
      txReq1.flush(5);

      const txReq2 = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/operations/transactions/count` &&
          req.params.get('level') === '101'
      );
      txReq2.flush(3);

      expect(result).toBeDefined();
      expect(result!.length).toBe(2);
      expect(result![0].transactions).toBe(5);
      expect(result![1].transactions).toBe(3);
    });

    it('should use correct pagination parameters', () => {
      service.getBlocks(20, 5).subscribe();

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/blocks` &&
          req.params.get('limit') === '20' &&
          req.params.get('offset.pg') === '5'
      );
      req.flush([]);
    });

    it('should handle errors gracefully', () => {
      let errorOccurred = false;
      service.getBlocks(10, 0).subscribe({
        error: () => {
          errorOccurred = true;
        },
      });

      const req = httpMock.expectOne((req) => req.url === `${API_BASE}/blocks`);
      req.error(new ProgressEvent('Network error'));

      expect(errorOccurred).toBe(true);
    });

    it('should increment and decrement loading counter', () => {
      expect(store.loadingCounter()).toBe(0);

      service.getBlocks(10, 0).subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne((req) => req.url === `${API_BASE}/blocks`);
      req.flush([]);

      expect(store.loadingCounter()).toBe(0);
    });
  });

  describe('getTransactionsCount', () => {
    it('should fetch transaction count for a given level', () => {
      let result: number | undefined;
      service.getTransactionsCount(12345).subscribe((count) => {
        result = count;
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/operations/transactions/count` &&
          req.params.get('level') === '12345'
      );
      expect(req.request.method).toBe('GET');
      req.flush(42);

      expect(result).toBe(42);
    });

    it('should handle errors gracefully', () => {
      let errorOccurred = false;
      service.getTransactionsCount(12345).subscribe({
        error: () => {
          errorOccurred = true;
        },
      });

      const req = httpMock.expectOne(
        (req) => req.url === `${API_BASE}/operations/transactions/count`
      );
      req.error(new ProgressEvent('Network error'));

      expect(errorOccurred).toBe(true);
    });
  });

  describe('getTransactions', () => {
    it('should fetch transactions and return them', () => {
      let result: Transaction[] | undefined;
      service.getTransactions(12345).subscribe((transactions) => {
        result = transactions;
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/operations/transactions` &&
          req.params.get('level') === '12345'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTransactions);

      expect(result).toBeDefined();
      expect(result!.length).toBe(2);
      expect(result![0].sender.address).toBe('addr1');
    });

    it('should handle errors gracefully', () => {
      let errorOccurred = false;
      service.getTransactions(12345).subscribe({
        error: () => {
          errorOccurred = true;
        },
      });

      const req = httpMock.expectOne(
        (req) => req.url === `${API_BASE}/operations/transactions`
      );
      req.error(new ProgressEvent('Network error'));

      expect(errorOccurred).toBe(true);
    });

    it('should increment and decrement loading counter', () => {
      expect(store.loadingCounter()).toBe(0);

      service.getTransactions(12345).subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(
        (req) => req.url === `${API_BASE}/operations/transactions`
      );
      req.flush(mockTransactions);

      expect(store.loadingCounter()).toBe(0);
    });
  });

  describe('Error handling patterns', () => {
    it('should always finalize loading counter even on error', () => {
      expect(store.loadingCounter()).toBe(0);

      service.getBlocksCount().subscribe({
        error: () => {
          // Error handled
        },
      });

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
      req.error(new ProgressEvent('Error'));

      // After finalize, counter should be 0
      expect(store.loadingCounter()).toBe(0);
    });
  });
});
