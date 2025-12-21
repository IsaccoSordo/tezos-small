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

/**
 * BlocksOverviewComponent Test Suite
 *
 * Testing Best Practices Applied:
 * - Component relies on resolver for initial data preloading
 * - Timer starts at 60 seconds (not 0) since resolver preloaded initial count
 * - vi.useFakeTimers() handles async timer operations
 * - fixture.destroy() ensures proper cleanup of timer subscriptions
 * - Tests are organized logically: basic → initialization → behavior → polling
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

  // Helper function to handle initial component setup
  const initializeComponent = () => {
    fixture.detectChanges();
  };

  // Helper function to handle the count request (for polling)
  const flushCountRequest = (count = 100) => {
    const req = httpMock.expectOne('https://api.tzkt.io/v1/blocks/count');
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
  });

  afterEach(() => {
    fixture.destroy();
    httpMock.verify();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have references to store signals', () => {
    expect(component.blocks).toBe(store.blocks);
    expect(component.count).toBe(store.count);
  });

  it('should not make HTTP requests on init (resolver preloads data)', () => {
    initializeComponent();

    // No immediate HTTP requests - resolver handles initial data loading
    httpMock.expectNone('https://api.tzkt.io/v1/blocks/count');
    httpMock.expectNone((req) => req.url === 'https://api.tzkt.io/v1/blocks');
  });

  it('should poll for block count after 60 seconds', () => {
    initializeComponent();

    // No request at initialization
    httpMock.expectNone('https://api.tzkt.io/v1/blocks/count');

    // Advance timer by 60 seconds to trigger first poll
    vi.advanceTimersByTime(60000);

    flushCountRequest(5000);
    expect(store.count()).toBe(5000);
  });

  it('should poll for block count every 60 seconds', () => {
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

  it('should update pagination state on page change', () => {
    initializeComponent();

    const pageEvent: PageChangeEvent = { page: 1, pageSize: 20 };
    component.onPageChange(pageEvent);

    expect(component.currentPage()).toBe(1);
    expect(component.pageSize()).toBe(20);
  });

  it('should display blocks in template when store has data', () => {
    // Simulate resolver having preloaded data into store
    store.setBlocks(mockBlocks);
    store.setCount(1000);

    initializeComponent();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('abc123');
    expect(compiled.textContent).toContain('Baker1');
  });

  it('should display correct number of blocks from store', () => {
    store.setBlocks(mockBlocks);
    initializeComponent();

    expect(component.blocks().length).toBe(2);
    expect(component.blocks()[0].hash).toBe('abc123');
    expect(component.blocks()[1].level).toBe(101);
  });
});
