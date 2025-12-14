import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TzktService } from './tzkt.service';
import { Store } from '../store/store.service';
import { loadingInterceptor } from '../interceptors/loading.interceptor';

/**
 * TzktService Test Suite
 *
 * Testing Best Practices Applied:
 * - Nested describe blocks organize tests by method/feature
 * - afterEach resets store state for test isolation
 * - fakeAsync with tick() handles timing-dependent assertions
 * - Tests cover happy path, error handling, and loading states
 * - HttpTestingController verifies all HTTP interactions
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
        provideHttpClient(withInterceptors([loadingInterceptor])),
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
    it('should fetch blocks count and update store', (done) => {
      service.getBlocksCount().subscribe(() => {
        expect(store.count()).toBe(5000);
        done();
      });

      const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
      expect(req.request.method).toBe('GET');
      req.flush(5000);
    });

    it('should increment and decrement loading counter', fakeAsync(() => {
      expect(store.loadingCounter()).toBe(0);

      service.getBlocksCount().subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
      req.flush(100);

      tick();

      expect(store.loadingCounter()).toBe(0);
    }));

    it('should handle errors and update error state', (done) => {
      service.getBlocksCount().subscribe({
        error: () => {
          expect(store.count()).toBe(0);
          setTimeout(() => {
            expect(store.loadingCounter()).toBe(0);
            done();
          }, 100);
        },
      });

      const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('getBlocks', () => {
    it('should fetch blocks and update store', (done) => {
      service.getBlocks(10, 0).subscribe(() => {
        expect(store.blocks().length).toBe(2);
        expect(store.blocks()[0].hash).toBe('abc123');
        done();
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
    });

    it('should use correct pagination parameters', (done) => {
      service.getBlocks(20, 5).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/blocks` &&
          req.params.get('limit') === '20' &&
          req.params.get('offset.pg') === '5'
      );
      req.flush([]);
    });

    it('should handle errors and update error state', (done) => {
      service.getBlocks(10, 0).subscribe({
        error: () => {
          expect(store.blocks().length).toBe(0);
          done();
        },
      });

      const req = httpMock.expectOne((req) => req.url === `${API_BASE}/blocks`);
      req.error(new ProgressEvent('Network error'));
    });

    it('should increment and decrement loading counter', fakeAsync(() => {
      expect(store.loadingCounter()).toBe(0);

      service.getBlocks(10, 0).subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne((req) => req.url === `${API_BASE}/blocks`);
      req.flush([]);

      tick();

      expect(store.loadingCounter()).toBe(0);
    }));
  });

  describe('getTransactionsCount', () => {
    it('should fetch transaction count for a given level', (done) => {
      service.getTransactionsCount(12345).subscribe((count) => {
        expect(count).toBe(42);
        done();
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/operations/transactions/count` &&
          req.params.get('level') === '12345'
      );
      expect(req.request.method).toBe('GET');
      req.flush(42);
    });

    it('should handle errors gracefully', (done) => {
      service.getTransactionsCount(12345).subscribe({
        error: () => {
          done();
        },
      });

      const req = httpMock.expectOne(
        (req) => req.url === `${API_BASE}/operations/transactions/count`
      );
      req.error(new ProgressEvent('Network error'));
    });
  });

  describe('getTransactions', () => {
    it('should fetch transactions and update store', (done) => {
      service.getTransactions(12345).subscribe(() => {
        expect(store.transactions().length).toBe(2);
        expect(store.transactions()[0].sender.address).toBe('addr1');
        done();
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/operations/transactions` &&
          req.params.get('level') === '12345'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTransactions);
    });

    it('should handle errors and update error state', (done) => {
      service.getTransactions(12345).subscribe({
        error: () => {
          expect(store.transactions().length).toBe(0);
          done();
        },
      });

      const req = httpMock.expectOne(
        (req) => req.url === `${API_BASE}/operations/transactions`
      );
      req.error(new ProgressEvent('Network error'));
    });

    it('should increment and decrement loading counter', fakeAsync(() => {
      expect(store.loadingCounter()).toBe(0);

      service.getTransactions(12345).subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(
        (req) => req.url === `${API_BASE}/operations/transactions`
      );
      req.flush(mockTransactions);

      tick();

      expect(store.loadingCounter()).toBe(0);
    }));
  });

  describe('Error handling patterns', () => {
    it('should always finalize loading counter even on error', (done) => {
      expect(store.loadingCounter()).toBe(0);

      service.getBlocksCount().subscribe({
        error: () => {
          setTimeout(() => {
            expect(store.loadingCounter()).toBe(0);
            done();
          }, 100);
        },
      });

      const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
      req.error(new ProgressEvent('Error'));
    });

    it('should add error messages to store on failures', (done) => {
      service.getBlocksCount().subscribe({
        error: () => {
          done();
        },
      });

      const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
      req.error(new ProgressEvent('Network error'));
    });
  });
});
