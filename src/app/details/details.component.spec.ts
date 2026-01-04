import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { DetailsComponent } from './details.component';
import { Store } from '../store/tzkt.store';
import { Transaction } from '../models';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

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

  const mockStore = {
    blocks: signal([]),
    count: signal(0),
    transactions: signal<Transaction[]>([]),
    errors: signal<Error[]>([]),
    loadingCounter: signal(0),
    loadBlocks: vi.fn(),
    pollBlocksCount: vi.fn(),
    loadTransactions: vi.fn(),
    resetState: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;

    mockStore.transactions.set([]);
    vi.clearAllMocks();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have references to store signals', () => {
    expect(component.transactions).toBe(mockStore.transactions);
  });

  it('should display transactions in template when store has data', () => {
    mockStore.transactions.set(mockTransactions);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('User1');
    expect(compiled.textContent).toContain('User2');
  });

  it('should display correct number of transactions from store', () => {
    mockStore.transactions.set(mockTransactions);
    fixture.detectChanges();

    expect(component.transactions().length).toBe(2);
    expect(component.transactions()[0].sender.address).toBe('addr1');
    expect(component.transactions()[1].amount).toBe(200);
  });

  it('should have correct column definitions', () => {
    expect(component.columns).toEqual([
      { field: 'sender', header: 'Sender' },
      { field: 'target', header: 'Target' },
      { field: 'amount', header: 'Amount' },
      { field: 'status', header: 'Status' },
    ]);
  });
});
