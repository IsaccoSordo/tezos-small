import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TzktService } from '../services/tzkt.service';
import { Store } from '../store/store.service';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let httpMock: HttpTestingController;
  let store: Store;

  const mockTransactions = [
    { sender: { address: 'addr1', alias: 'User1' }, target: { address: 'addr2', alias: 'User2' }, amount: 100, status: 'applied' },
    { sender: { address: 'addr3', alias: 'User3' }, target: { address: 'addr4', alias: 'User4' }, amount: 200, status: 'applied' }
  ];

  describe('with valid block level', () => {
    const activatedRouteSpy = {
      snapshot: { paramMap: { get: (param: string) => param === 'level' ? '12345' : null } },
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DetailsComponent],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          TzktService,
          Store
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
      expect(component.transactions).toBe(store.state.transactions);
    });

    it('should fetch transactions for the given block level on init', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne(req =>
        req.url === 'https://api.tzkt.io/v1/operations/transactions' &&
        req.params.get('level') === '12345'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockTransactions);

      expect(store.state.transactions().length).toBe(2);
      expect(store.state.transactions()[0].sender.address).toBe('addr1');
    });

    it('should display transactions in template when data is available', async () => {
      store.state.transactions.set(mockTransactions);

      fixture.detectChanges();
      await fixture.whenStable();

      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('addr1');
    });

    it('should handle API errors gracefully', () => {
      fixture.detectChanges();

      const req = httpMock.expectOne(req =>
        req.url === 'https://api.tzkt.io/v1/operations/transactions'
      );
      req.error(new ProgressEvent('Network error'));

      expect(store.state.errors().length).toBeGreaterThan(0);
      expect(store.state.transactions().length).toBe(0);
    });

    it('should manage loading state correctly', () => {
      expect(store.state.loadingCounter()).toBe(0);

      fixture.detectChanges();

      expect(store.state.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(req =>
        req.url === 'https://api.tzkt.io/v1/operations/transactions'
      );
      req.flush(mockTransactions);

      expect(store.state.loadingCounter()).toBe(0);
    });
  });

  describe('without block level (invalid route param)', () => {
    const activatedRouteSpyInvalid = {
      snapshot: { paramMap: { get: (param: string) => null } },
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DetailsComponent],
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: ActivatedRoute, useValue: activatedRouteSpyInvalid },
          TzktService,
          Store
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(DetailsComponent);
      component = fixture.componentInstance;
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should not fetch transactions when level is null', () => {
      fixture.detectChanges();

      // Should not make any HTTP requests
      httpMock.expectNone(req =>
        req.url === 'https://api.tzkt.io/v1/operations/transactions'
      );
    });
  });
});
