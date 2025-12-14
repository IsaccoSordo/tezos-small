import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { BlocksOverviewComponent } from './blocks-overview.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/store.service';
import { PageChangeEvent } from '../ui/table/table.component';
import { loadingInterceptor } from '../interceptors/loading.interceptor';
import { Block } from '../common';

/**
 * BlocksOverviewComponent Test Suite
 *
 * Testing Best Practices Applied:
 * - Helper functions reduce code duplication for common mock patterns
 * - Each test has a single, focused responsibility
 * - fakeAsync with tick() handles async timer operations
 * - fixture.destroy() ensures proper cleanup of timer subscriptions
 * - Tests are organized logically: basic → initialization → behavior → integration
 */
describe('BlocksOverviewComponent', () => {
  let component: BlocksOverviewComponent;
  let fixture: ComponentFixture<BlocksOverviewComponent>;
  let httpMock: HttpTestingController;
  let store: InstanceType<typeof Store>;

  const mockBlocks = [
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

  // Helper function to handle initial component setup in fakeAsync tests
  const initializeComponent = () => {
    fixture.detectChanges();
    tick(); // Trigger the timer(0, 60000) to fire immediately
  };

  // Helper function to handle the count request
  const flushCountRequest = (count = 100) => {
    const req = httpMock.expectOne('https://api.tzkt.io/v1/blocks/count');
    expect(req.request.method).toBe('GET');
    req.flush(count);
  };

  // Helper function to handle the initial blocks request
  const flushInitialBlocksRequest = (blocks: Block[] = []) => {
    const req = httpMock.expectOne(
      (req) => req.url === 'https://api.tzkt.io/v1/blocks',
    );
    req.flush(blocks);
  };

  // Helper function to handle transaction count requests
  const flushTransactionCountRequests = () => {
    mockBlocks.forEach((block) => {
      const req = httpMock.expectOne(
        (req) =>
          req.url === 'https://api.tzkt.io/v1/operations/transactions/count' &&
          req.params.get('level') === block.level.toString(),
      );
      req.flush(block.transactions);
    });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlocksOverviewComponent],
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        TzktService,
        Store,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlocksOverviewComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have references to store signals', () => {
    expect(component.blocks).toBe(store.blocks);
    expect(component.count).toBe(store.count);
  });

  it('should initialize and fetch block count', fakeAsync(() => {
    initializeComponent();
    flushCountRequest(5000);
    flushInitialBlocksRequest();

    expect(store.count()).toBe(5000);

    fixture.destroy();
  }));

  it('should handle page change and update store with blocks', fakeAsync(() => {
    initializeComponent();
    flushCountRequest();
    flushInitialBlocksRequest();

    // Trigger page change to fetch different data
    const pageEvent: PageChangeEvent = { page: 0, pageSize: 10 };
    component.onPageChange(pageEvent);

    // Expect blocks request with correct pagination parameters
    const blocksReq = httpMock.expectOne(
      (req) =>
        req.url === 'https://api.tzkt.io/v1/blocks' &&
        req.params.get('limit') === '10' &&
        req.params.get('offset.pg') === '0',
    );
    expect(blocksReq.request.method).toBe('GET');
    blocksReq.flush(mockBlocks);

    flushTransactionCountRequests();

    expect(store.blocks().length).toBe(2);
    expect(store.blocks()[0].hash).toBe('abc123');

    fixture.destroy();
  }));

  it('should update pagination state and query params on page change', fakeAsync(() => {
    initializeComponent();
    flushCountRequest();
    flushInitialBlocksRequest();

    const pageEvent: PageChangeEvent = { page: 1, pageSize: 20 };
    component.onPageChange(pageEvent);

    expect(component.currentPage()).toBe(1);
    expect(component.pageSize()).toBe(20);

    const req = httpMock.expectOne(
      (req) =>
        req.url === 'https://api.tzkt.io/v1/blocks' &&
        req.params.get('limit') === '20' &&
        req.params.get('offset.pg') === '1',
    );
    req.flush([]);

    fixture.destroy();
  }));

  it('should display blocks in template when data is available', fakeAsync(() => {
    initializeComponent();
    flushCountRequest();
    flushInitialBlocksRequest(mockBlocks);
    flushTransactionCountRequests();

    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('abc123');
    expect(compiled.textContent).toContain('Baker1');

    fixture.destroy();
  }));

  it('should manage loading state during concurrent requests', fakeAsync(() => {
    expect(store.loadingCounter()).toBe(0);

    initializeComponent();

    // Two concurrent requests: count + initial blocks
    expect(store.loadingCounter()).toBe(2);

    flushCountRequest();
    expect(store.loadingCounter()).toBe(1);

    flushInitialBlocksRequest();
    expect(store.loadingCounter()).toBe(0);

    fixture.destroy();
  }));
});
