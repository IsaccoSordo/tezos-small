import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlocksOverviewComponent } from './blocks-overview.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/tzkt.store';
import { PageChangeEvent } from '../ui/table/table.component';
import { loadingInterceptor } from '../interceptors/loading.interceptor';
import { Block } from '../models';

/**
 * BlocksOverviewComponent Test Suite
 *
 * Testing Best Practices Applied:
 * - Initial data is loaded by resolver (not tested here)
 * - Component reads from store signals
 * - Store is pre-populated for display tests
 * - Store polling starts immediately with startWith(0), then every 60 seconds
 * - vi.useFakeTimers() handles async timer operations
 * - fixture.destroy() ensures proper cleanup of subscriptions
 */
describe('BlocksOverviewComponent', () => {
  let component: BlocksOverviewComponent;
  let fixture: ComponentFixture<BlocksOverviewComponent>;
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

  // Helper to flush poll count request (startWith(0) triggers immediately)
  const flushInitialCountRequest = (count = 1000) => {
    const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
    req.flush(count);
  };

  // Helper function to handle initial component setup
  const initializeComponent = () => {
    fixture.detectChanges();
    flushInitialCountRequest();
    fixture.detectChanges();
  };

  // Helper function to handle the count request (for polling)
  const flushCountRequest = (count = 100) => {
    const req = httpMock.expectOne(`${API_BASE}/blocks/count`);
    expect(req.request.method).toBe('GET');
    req.flush(count);
  };

  beforeEach(async () => {
    vi.useFakeTimers();

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

    // Reset store state for clean tests
    store.resetState();
  });

  afterEach(() => {
    fixture.destroy();
    // Discard any pending requests (flush if not cancelled)
    httpMock
      .match(() => true)
      .forEach((req) => {
        if (!req.cancelled) {
          req.flush(null);
        }
      });
    httpMock.verify();
    store.resetState();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have references to store signals', () => {
    expect(component.blocks).toBe(store.blocks);
    expect(component.count).toBe(store.count);
  });

  it('should read blocks from store (pre-populated by resolver)', () => {
    // Simulate resolver having populated the store
    store.setBlocks(mockBlocks);
    store.setCount(1000);
    initializeComponent();

    expect(component.blocks().length).toBe(2);
    expect(component.count()).toBe(1000);
  });

  it('should poll for block count after 60 seconds', () => {
    store.setBlocks(mockBlocks);
    store.setCount(1000);
    initializeComponent();

    // Advance timer by 60 seconds to trigger next poll
    vi.advanceTimersByTime(60000);

    flushCountRequest(5000);
    expect(store.count()).toBe(5000);
  });

  it('should poll for block count every 60 seconds', () => {
    store.setBlocks(mockBlocks);
    store.setCount(1000);
    initializeComponent();

    // First poll at 60 seconds
    vi.advanceTimersByTime(60000);
    flushCountRequest(5000);
    expect(store.count()).toBe(5000);

    // Second poll at 120 seconds
    vi.advanceTimersByTime(60000);
    flushCountRequest(5100);
    expect(store.count()).toBe(5100);
  });

  it('should load blocks via store on page change', () => {
    store.setBlocks(mockBlocks);
    store.setCount(1000);
    initializeComponent();

    const pageEvent: PageChangeEvent = { page: 1, pageSize: 20 };
    component.onPageChange(pageEvent);

    // Flush the new blocks request triggered by pagination change
    const blocksReq = httpMock.expectOne(
      (req) =>
        req.url === `${API_BASE}/blocks` &&
        req.params.get('offset.pg') === '1' &&
        req.params.get('limit') === '20'
    );
    blocksReq.flush([]);

    expect(component.currentPage()).toBe(1);
    expect(component.pageSize()).toBe(20);
  });

  it('should display blocks in template when store has data', () => {
    store.setBlocks(mockBlocks);
    store.setCount(1000);
    initializeComponent();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('abc123');
    expect(compiled.textContent).toContain('Baker1');
  });

  it('should display correct number of blocks from store', () => {
    store.setBlocks(mockBlocks);
    store.setCount(1000);
    initializeComponent();

    expect(component.blocks().length).toBe(2);
    expect(component.blocks()[0].hash).toBe('abc123');
    expect(component.blocks()[1].level).toBe(101);
  });
});
