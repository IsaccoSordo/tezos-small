import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/tzkt.store';
import { loadingInterceptor } from '../interceptors/loading.interceptor';
import { blocksResolver, transactionsResolver } from './tzkt.resolvers';
import { Block, Transaction } from '../models';

/**
 * TZKT Resolvers Test Suite
 *
 * Testing Best Practices Applied:
 * - Resolvers fetch data from service and update store
 * - Tests verify HTTP calls are made with correct parameters
 * - Tests verify store is updated with fetched data
 * - HttpTestingController verifies all HTTP interactions
 */
describe('TZKT Resolvers', () => {
  let httpMock: HttpTestingController;
  let store: InstanceType<typeof Store>;

  const API_BASE = 'https://api.tzkt.io/v1';

  const mockBlocks: Block[] = [
    {
      hash: 'abc123',
      level: 100,
      transactions: 5,
      proposer: { alias: 'Baker1', address: 'tz1Baker1' },
      timestamp: '2025-01-01T00:00:00Z',
    },
    {
      hash: 'def456',
      level: 101,
      transactions: 3,
      proposer: { alias: 'Baker2', address: 'tz1Baker2' },
      timestamp: '2025-01-01T00:01:00Z',
    },
  ];

  const mockTransactions: Transaction[] = [
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

  const createMockRouteSnapshot = (
    params: Record<string, string> = {},
    queryParams: Record<string, string> = {}
  ): ActivatedRouteSnapshot => {
    return {
      paramMap: convertToParamMap(params),
      queryParamMap: convertToParamMap(queryParams),
    } as ActivatedRouteSnapshot;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        TzktService,
        Store,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    httpMock.verify();
    store.resetState();
  });

  describe('blocksResolver', () => {
    it('should fetch blocks with default pagination', () => {
      const route = createMockRouteSnapshot();

      TestBed.runInInjectionContext(() => {
        (blocksResolver(route, {} as never) as Observable<Block[]>).subscribe();
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/blocks` &&
          req.params.get('limit') === '10' &&
          req.params.get('offset.pg') === '0'
      );
      req.flush(mockBlocks);

      // Flush transaction count requests
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

      expect(store.blocks().length).toBe(2);
      expect(store.blocks()[0].hash).toBe('abc123');
    });

    it('should fetch blocks with custom pagination from query params', () => {
      const route = createMockRouteSnapshot({}, { page: '2', pageSize: '20' });

      TestBed.runInInjectionContext(() => {
        (blocksResolver(route, {} as never) as Observable<Block[]>).subscribe();
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/blocks` &&
          req.params.get('limit') === '20' &&
          req.params.get('offset.pg') === '2'
      );
      req.flush([]);
    });
  });

  describe('blocksCountResolver', () => {
    it('should fetch blocks count and update store', () => {
      const route = createMockRouteSnapshot();

      TestBed.runInInjectionContext(() => {
        (
          blocksCountResolver(route, {} as never) as Observable<number>
        ).subscribe();
      });

      const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
      req.flush(5000);

      expect(store.count()).toBe(5000);
    });
  });

  describe('blocksDataResolver', () => {
    it('should fetch blocks and count in parallel and update store', () => {
      const route = createMockRouteSnapshot();

      TestBed.runInInjectionContext(() => {
        (
          blocksDataResolver(route, {} as never) as Observable<{
            blocks: Block[];
            count: number;
          }>
        ).subscribe();
      });

      // Blocks request
      const blocksReq = httpMock.expectOne(
        (req) => req.url === `${API_BASE}/blocks`
      );
      blocksReq.flush(mockBlocks);

      // Transaction count requests
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

      // Count request
      const countReq = httpMock.expectOne(`${API_BASE}/blocks/count`);
      countReq.flush(5000);

      expect(store.blocks().length).toBe(2);
      expect(store.count()).toBe(5000);
    });
  });

  describe('transactionsResolver', () => {
    it('should fetch transactions for a block level and update store', () => {
      const route = createMockRouteSnapshot({ level: '12345' });

      TestBed.runInInjectionContext(() => {
        (
          transactionsResolver(route, {} as never) as Observable<Transaction[]>
        ).subscribe();
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/operations/transactions` &&
          req.params.get('level') === '12345'
      );
      req.flush(mockTransactions);

      expect(store.transactions().length).toBe(2);
      expect(store.transactions()[0].sender.address).toBe('addr1');
    });

    it('should use level 0 when level param is not provided', () => {
      const route = createMockRouteSnapshot();

      TestBed.runInInjectionContext(() => {
        (
          transactionsResolver(route, {} as never) as Observable<Transaction[]>
        ).subscribe();
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${API_BASE}/operations/transactions` &&
          req.params.get('level') === '0'
      );
      req.flush([]);
    });
  });
});
