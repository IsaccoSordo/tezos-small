import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlocksOverviewComponent } from './blocks-overview.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/store.service';
import { TableData } from '../common';
import { loadingInterceptor } from '../interceptors/loading.interceptor';

describe('BlocksOverviewComponent', () => {
  let component: BlocksOverviewComponent;
  let fixture: ComponentFixture<BlocksOverviewComponent>;
  let httpMock: HttpTestingController;
  let store: Store;

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
    expect(component.blocks).toBe(store.state.blocks);
    expect(component.count).toBe(store.state.count);
  });

  it('should fetch block count on initialization', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne('https://api.tzkt.io/v1/blocks/count');
    expect(req.request.method).toBe('GET');
    req.flush(5000);

    // Handle the blocks request triggered by TableComponent's initial refresh event
    const blocksReq = httpMock.expectOne(
      (req) => req.url === 'https://api.tzkt.io/v1/blocks',
    );
    blocksReq.flush([]);

    expect(store.state.count()).toBe(5000);
  });

  it('should update store when blocks are fetched', () => {
    fixture.detectChanges();

    // Initial count request
    const countReq = httpMock.expectOne('https://api.tzkt.io/v1/blocks/count');
    countReq.flush(100);

    // Handle the initial blocks request from TableComponent
    const initialBlocksReq = httpMock.expectOne(
      (req) => req.url === 'https://api.tzkt.io/v1/blocks',
    );
    initialBlocksReq.flush([]);

    // Trigger refresh with page 0 (0-based indexing)
    const tableData: TableData = { page: 0, pageSize: 10, count: 100 };
    component.refreshView(tableData);

    // Expect blocks request from manual refresh
    const blocksReq = httpMock.expectOne(
      (req) =>
        req.url === 'https://api.tzkt.io/v1/blocks' &&
        req.params.get('limit') === '10' &&
        req.params.get('offset.pg') === '0',
    );
    expect(blocksReq.request.method).toBe('GET');
    blocksReq.flush(mockBlocks);

    // Expect transaction count requests for each block
    const txReq1 = httpMock.expectOne(
      (req) =>
        req.url === 'https://api.tzkt.io/v1/operations/transactions/count' &&
        req.params.get('level') === '100',
    );
    txReq1.flush(5);

    const txReq2 = httpMock.expectOne(
      (req) =>
        req.url === 'https://api.tzkt.io/v1/operations/transactions/count' &&
        req.params.get('level') === '101',
    );
    txReq2.flush(3);

    expect(store.state.blocks().length).toBe(2);
    expect(store.state.blocks()[0].hash).toBe('abc123');
  });

  it('should use Subject pattern for refreshView events', () => {
    const tableData: TableData = { page: 1, pageSize: 20, count: 100 };

    fixture.detectChanges();

    // Initial count request
    httpMock.expectOne('https://api.tzkt.io/v1/blocks/count').flush(100);

    // Handle the initial blocks request from TableComponent
    httpMock
      .expectOne((req) => req.url === 'https://api.tzkt.io/v1/blocks')
      .flush([]);

    component.refreshView(tableData);

    const req = httpMock.expectOne(
      (req) =>
        req.url === 'https://api.tzkt.io/v1/blocks' &&
        req.params.get('limit') === '20' &&
        req.params.get('offset.pg') === '1',
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should display blocks in template when data is available', () => {
    fixture.detectChanges();

    // Initial count request
    httpMock.expectOne('https://api.tzkt.io/v1/blocks/count').flush(100);

    // Handle the blocks request triggered by TableComponent
    httpMock
      .expectOne((req) => req.url === 'https://api.tzkt.io/v1/blocks')
      .flush(mockBlocks);

    // Flush transaction count requests for each block
    httpMock
      .expectOne(
        (req) =>
          req.url === 'https://api.tzkt.io/v1/operations/transactions/count' &&
          req.params.get('level') === '100',
      )
      .flush(5);

    httpMock
      .expectOne(
        (req) =>
          req.url === 'https://api.tzkt.io/v1/operations/transactions/count' &&
          req.params.get('level') === '101',
      )
      .flush(3);

    // Trigger change detection to update the view
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('abc123');
    expect(compiled.textContent).toContain('Baker1');
  });

  it('should manage loading state correctly', () => {
    expect(store.state.loadingCounter()).toBe(0);

    fixture.detectChanges();

    // Two requests are made: count request + blocks request from TableComponent
    expect(store.state.loadingCounter()).toBe(2);

    const countReq = httpMock.expectOne('https://api.tzkt.io/v1/blocks/count');
    countReq.flush(100);

    expect(store.state.loadingCounter()).toBe(1);

    const blocksReq = httpMock.expectOne(
      (req) => req.url === 'https://api.tzkt.io/v1/blocks',
    );
    blocksReq.flush([]);

    expect(store.state.loadingCounter()).toBe(0);
  });
});
