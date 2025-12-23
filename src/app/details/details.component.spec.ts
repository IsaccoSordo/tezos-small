import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { Store } from '../store/tzkt.store';
import { Transaction } from '../models';

/**
 * DetailsComponent Test Suite
 *
 * Testing Best Practices Applied:
 * - Transactions are loaded by resolver (not tested here)
 * - Component reads from store signals
 * - Store is pre-populated for display tests
 * - Tests verify component reads from store correctly
 * - Tests verify template rendering with loaded data
 */
describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let store: InstanceType<typeof Store>;

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

  // Helper function to handle initial component setup
  const initializeComponent = () => {
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsComponent],
      providers: [Store],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have references to store signals', () => {
    expect(component.transactions).toBe(store.transactions);
  });

  it('should read transactions from store (pre-populated by resolver)', () => {
    // Simulate resolver having populated the store
    store.setTransactions(mockTransactions);
    initializeComponent();

    expect(component.transactions().length).toBe(2);
    expect(component.transactions()[0].sender.address).toBe('addr1');
  });

  it('should display transactions in template when store has data', async () => {
    store.setTransactions(mockTransactions);
    initializeComponent();

    await fixture.whenStable();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('addr1');
  });

  it('should display correct number of transactions from store', () => {
    store.setTransactions(mockTransactions);
    initializeComponent();

    expect(component.transactions().length).toBe(2);
    expect(component.transactions()[0].sender.address).toBe('addr1');
    expect(component.transactions()[1].amount).toBe(200);
  });
});
