import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import { ContractService } from './contract.service';
import { Store } from '../store/tzkt.store';
import { loadingInterceptor } from '../interceptors/loading.interceptor';
import {
  ContractInfo,
  ContractEntrypoint,
  ContractStorage,
  ContractInterface,
  ContractView,
  ContractEvent,
} from '../models';
import { TZKT_API_BASE } from '../config/api.config';

describe('ContractService', () => {
  let service: ContractService;
  let httpMock: HttpTestingController;
  let store: InstanceType<typeof Store>;

  const testAddress = 'KT1Xobej4mc6XgEjDoJoHtTKgbD1ELMvcQuL';

  const mockContract: ContractInfo = {
    id: 1,
    type: 'contract',
    address: testAddress,
    balance: 1000000,
    counter: 0,
    firstActivity: 1000,
    firstActivityTime: '2023-01-01T00:00:00Z',
    lastActivity: 2000,
    lastActivityTime: '2024-01-01T00:00:00Z',
    numContracts: 0,
    activeTokensCount: 1,
    tokenBalancesCount: 5,
    tokenTransfersCount: 100,
    activeTicketsCount: 0,
    ticketBalancesCount: 0,
    ticketTransfersCount: 0,
    numDelegations: 0,
    numOriginations: 1,
    numTransactions: 50,
    creator: { address: 'tz1creator', alias: 'Creator' },
    kind: 'asset',
    tzips: ['fa2'],
    tokensCount: 1,
    codeHash: 123456,
    typeHash: 789012,
  };

  const mockEntrypoints: ContractEntrypoint[] = [
    { name: 'transfer', jsonParameters: { type: 'object' }, unused: false },
    { name: 'balance_of', jsonParameters: { type: 'object' }, unused: false },
  ];

  const mockStorage: ContractStorage = {
    ledger: {},
    admin: 'tz1admin',
  };

  const mockInterface: ContractInterface = {
    storageSchema: { type: 'object' },
    entrypoints: [],
    bigMaps: [],
    events: [],
  };

  const mockViews: ContractView[] = [
    { name: 'get_balance', jsonParameterType: {}, jsonReturnType: {} },
  ];

  const mockEvents: ContractEvent[] = [
    {
      id: 1,
      level: 1000,
      timestamp: '2024-01-15T12:00:00Z',
      contract: { address: testAddress },
      codeHash: 123456,
      tag: 'transfer',
      payload: { from: 'tz1a', to: 'tz1b', amount: '100' },
      transactionId: 999,
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
        ContractService,
        Store,
      ],
    });
    service = TestBed.inject(ContractService);
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

  describe('getContract', () => {
    it('should fetch contract info', () => {
      let result: ContractInfo | undefined;
      service.getContract(testAddress).subscribe((contract) => {
        result = contract;
      });

      const req = httpMock.expectOne(
        `${TZKT_API_BASE}/contracts/${testAddress}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockContract);

      expect(result).toEqual(mockContract);
    });
  });

  describe('getContractEntrypoints', () => {
    it('should fetch contract entrypoints', () => {
      let result: ContractEntrypoint[] | undefined;
      service.getContractEntrypoints(testAddress).subscribe((entrypoints) => {
        result = entrypoints;
      });

      const req = httpMock.expectOne(
        `${TZKT_API_BASE}/contracts/${testAddress}/entrypoints`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockEntrypoints);

      expect(result).toEqual(mockEntrypoints);
    });
  });

  describe('getContractStorage', () => {
    it('should fetch contract storage', () => {
      let result: ContractStorage | undefined;
      service.getContractStorage(testAddress).subscribe((storage) => {
        result = storage;
      });

      const req = httpMock.expectOne(
        `${TZKT_API_BASE}/contracts/${testAddress}/storage`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockStorage);

      expect(result).toEqual(mockStorage);
    });
  });

  describe('getContractInterface', () => {
    it('should fetch contract interface', () => {
      let result: ContractInterface | undefined;
      service.getContractInterface(testAddress).subscribe((iface) => {
        result = iface;
      });

      const req = httpMock.expectOne(
        `${TZKT_API_BASE}/contracts/${testAddress}/interface`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockInterface);

      expect(result).toEqual(mockInterface);
    });
  });

  describe('getContractViews', () => {
    it('should fetch contract views', () => {
      let result: ContractView[] | undefined;
      service.getContractViews(testAddress).subscribe((views) => {
        result = views;
      });

      const req = httpMock.expectOne(
        `${TZKT_API_BASE}/contracts/${testAddress}/views`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockViews);

      expect(result).toEqual(mockViews);
    });
  });

  describe('getContractEvents', () => {
    it('should fetch contract events with pagination', () => {
      let result: ContractEvent[] | undefined;
      service.getContractEvents(testAddress, 10, 20).subscribe((events) => {
        result = events;
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${TZKT_API_BASE}/contracts/events` &&
          req.params.get('contract') === testAddress &&
          req.params.get('limit') === '10' &&
          req.params.get('offset') === '20' &&
          req.params.get('sort.desc') === 'id'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);

      expect(result).toEqual(mockEvents);
    });
  });

  describe('getContractEventsCount', () => {
    it('should fetch contract events count', () => {
      let result: number | undefined;
      service.getContractEventsCount(testAddress).subscribe((count) => {
        result = count;
      });

      const req = httpMock.expectOne(
        (req) =>
          req.url === `${TZKT_API_BASE}/contracts/events/count` &&
          req.params.get('contract') === testAddress
      );
      expect(req.request.method).toBe('GET');
      req.flush(25);

      expect(result).toBe(25);
    });
  });
});
