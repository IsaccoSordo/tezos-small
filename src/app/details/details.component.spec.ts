import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Store } from '../store/tzkt.store';

/**
 * DetailsComponent Test Suite
 *
 * Testing Best Practices Applied:
 * - Component relies on resolver for data preloading (no HTTP calls in component)
 * - Tests verify component reads from store correctly
 * - Tests verify template rendering with preloaded data
 */
describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let httpMock: HttpTestingController;
  let store: InstanceType<typeof Store>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Store,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
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
    expect(component.transactions).toBe(store.transactions);
  });

  it('should not make HTTP requests on init (resolver handles data loading)', () => {
    fixture.detectChanges();

    // Component should not make any HTTP requests - resolver preloads data
    httpMock.expectNone(
      (req) => req.url === 'https://api.tzkt.io/v1/operations/transactions'
    );
  });

  it('should display transactions in template when store has data', async () => {
    // Simulate resolver having preloaded data into store
    store.setTransactions(mockTransactions);

    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('addr1');
  });

  it('should display correct number of transactions from store', () => {
    store.setTransactions(mockTransactions);
    fixture.detectChanges();

    expect(component.transactions().length).toBe(2);
    expect(component.transactions()[0].sender.address).toBe('addr1');
    expect(component.transactions()[1].amount).toBe(200);
  });
});
