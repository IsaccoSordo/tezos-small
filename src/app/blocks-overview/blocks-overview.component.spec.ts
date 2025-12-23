import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlocksOverviewComponent } from './blocks-overview.component';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { signal } from '@angular/core';
import { Store } from '../store/tzkt.store';
import { PageChangeEvent } from '../ui/table/table.component';
import { Block } from '../models';

/**
 * BlocksOverviewComponent Test Suite
 *
 * Testing Best Practices Applied:
 * - Component is purely presentational - reads from store
 * - Store is mocked with signals for isolated unit testing
 * - Tests verify component displays data from store correctly
 * - Tests verify URL-driven pagination (onPageChange navigates)
 */
describe('BlocksOverviewComponent', () => {
  let component: BlocksOverviewComponent;
  let fixture: ComponentFixture<BlocksOverviewComponent>;
  let router: Router;
  let queryParamsSubject: BehaviorSubject<Record<string, string>>;

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

  // Mock store with signals
  const mockStore = {
    blocks: signal<Block[]>([]),
    count: signal(0),
    transactions: signal([]),
    errors: signal<Error[]>([]),
    loadingCounter: signal(0),
    loadBlocks: vi.fn(),
    pollBlocksCount: vi.fn(),
    loadTransactions: vi.fn(),
    resetState: vi.fn(),
  };

  beforeEach(async () => {
    queryParamsSubject = new BehaviorSubject<Record<string, string>>({});

    await TestBed.configureTestingModule({
      imports: [BlocksOverviewComponent],
      providers: [
        provideRouter([]),
        { provide: Store, useValue: mockStore },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: queryParamsSubject.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BlocksOverviewComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // Reset mock signals
    mockStore.blocks.set([]);
    mockStore.count.set(0);
    vi.clearAllMocks();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have references to store signals', () => {
    expect(component.blocks).toBe(mockStore.blocks);
    expect(component.count).toBe(mockStore.count);
  });

  it('should display blocks in template when store has data', () => {
    mockStore.blocks.set(mockBlocks);
    mockStore.count.set(1000);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('abc123');
    expect(compiled.textContent).toContain('Baker1');
  });

  it('should display correct number of blocks from store', () => {
    mockStore.blocks.set(mockBlocks);
    fixture.detectChanges();

    expect(component.blocks().length).toBe(2);
    expect(component.blocks()[0].hash).toBe('abc123');
    expect(component.blocks()[1].level).toBe(101);
  });

  it('should derive pageSize and currentPage from queryParams', () => {
    queryParamsSubject.next({ page: '2', pageSize: '20' });
    fixture.detectChanges();

    expect(component.pageSize()).toBe(20);
    expect(component.currentPage()).toBe(2);
  });

  it('should use default pagination values when queryParams are empty', () => {
    queryParamsSubject.next({});
    fixture.detectChanges();

    expect(component.pageSize()).toBe(10);
    expect(component.currentPage()).toBe(0);
  });

  it('should navigate to new URL on page change (URL-driven)', () => {
    fixture.detectChanges();

    const navigateSpy = vi.spyOn(router, 'navigate');
    const pageEvent: PageChangeEvent = { page: 1, pageSize: 20 };
    component.onPageChange(pageEvent);

    expect(navigateSpy).toHaveBeenCalledWith([], {
      relativeTo: expect.anything(),
      queryParams: { page: 1, pageSize: 20 },
      queryParamsHandling: 'merge',
    });
  });

  it('should display count from store', () => {
    mockStore.count.set(5000);
    fixture.detectChanges();

    expect(component.count()).toBe(5000);
  });
});
