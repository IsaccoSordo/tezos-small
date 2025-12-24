import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { loadingInterceptor } from './loading.interceptor';
import { Store } from '../store/tzkt.store';

/**
 * Loading Interceptor Test Suite
 *
 * Testing Best Practices Applied:
 * - Each test has single responsibility
 * - Tests verify counter-based loading state
 * - Proper cleanup with httpMock.verify()
 */
describe('loadingInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let store: InstanceType<typeof Store>;

  const TEST_URL = '/api/test';
  const TEST_DATA = { message: 'test data' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
    store.resetState();
  });

  afterEach(() => {
    httpMock.verify();
    store.resetState();
  });

  describe('Loading Counter Management', () => {
    it('should increment loading counter when request starts', () => {
      expect(store.loadingCounter()).toBe(0);

      httpClient.get(TEST_URL).subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(TEST_URL);
      req.flush(TEST_DATA);
    });

    it('should decrement loading counter when request completes successfully', () => {
      expect(store.loadingCounter()).toBe(0);

      httpClient.get(TEST_URL).subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(TEST_URL);
      req.flush(TEST_DATA);

      expect(store.loadingCounter()).toBe(0);
    });

    it('should decrement loading counter when request fails', () => {
      expect(store.loadingCounter()).toBe(0);

      httpClient.get(TEST_URL).subscribe({
        next: () => expect.fail('Should not succeed'),
        error: vi.fn(),
      });

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(TEST_URL);
      req.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      expect(store.loadingCounter()).toBe(0);
    });
  });

  describe('Concurrent Requests', () => {
    it('should handle multiple concurrent requests correctly', () => {
      expect(store.loadingCounter()).toBe(0);

      httpClient.get('/api/test1').subscribe();
      httpClient.get('/api/test2').subscribe();
      httpClient.get('/api/test3').subscribe();

      expect(store.loadingCounter()).toBe(3);

      const req1 = httpMock.expectOne('/api/test1');
      req1.flush(TEST_DATA);

      expect(store.loadingCounter()).toBe(2);

      const req2 = httpMock.expectOne('/api/test2');
      req2.flush(TEST_DATA);

      expect(store.loadingCounter()).toBe(1);

      const req3 = httpMock.expectOne('/api/test3');
      req3.flush(TEST_DATA);

      expect(store.loadingCounter()).toBe(0);
    });

    it('should maintain correct counter with mixed success and error responses', () => {
      expect(store.loadingCounter()).toBe(0);

      httpClient.get('/api/success1').subscribe();
      httpClient.get('/api/error').subscribe({
        error: vi.fn(),
      });
      httpClient.get('/api/success2').subscribe();

      expect(store.loadingCounter()).toBe(3);

      const req1 = httpMock.expectOne('/api/success1');
      req1.flush(TEST_DATA);

      const req2 = httpMock.expectOne('/api/error');
      req2.flush('Error', { status: 500, statusText: 'Internal Server Error' });

      const req3 = httpMock.expectOne('/api/success2');
      req3.flush(TEST_DATA);

      expect(store.loadingCounter()).toBe(0);
    });
  });

  describe('Request Types', () => {
    it('should increment/decrement counter for GET requests', () => {
      expect(store.loadingCounter()).toBe(0);

      httpClient.get(TEST_URL).subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(TEST_URL);
      req.flush(TEST_DATA);

      expect(store.loadingCounter()).toBe(0);
    });

    it('should increment/decrement counter for POST requests', () => {
      expect(store.loadingCounter()).toBe(0);

      httpClient.post(TEST_URL, { data: 'test' }).subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(TEST_URL);
      req.flush(TEST_DATA);

      expect(store.loadingCounter()).toBe(0);
    });

    it('should increment/decrement counter for PUT requests', () => {
      expect(store.loadingCounter()).toBe(0);

      httpClient.put(TEST_URL, { data: 'test' }).subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(TEST_URL);
      req.flush(TEST_DATA);

      expect(store.loadingCounter()).toBe(0);
    });

    it('should increment/decrement counter for DELETE requests', () => {
      expect(store.loadingCounter()).toBe(0);

      httpClient.delete(TEST_URL).subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(TEST_URL);
      req.flush(TEST_DATA);

      expect(store.loadingCounter()).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid sequential requests', () => {
      expect(store.loadingCounter()).toBe(0);

      for (let i = 0; i < 5; i++) {
        httpClient.get(`${TEST_URL}/${i}`).subscribe();
      }

      expect(store.loadingCounter()).toBe(5);

      for (let i = 0; i < 5; i++) {
        const req = httpMock.expectOne(`${TEST_URL}/${i}`);
        req.flush(TEST_DATA);
      }

      expect(store.loadingCounter()).toBe(0);
    });

    it('should never have negative loading counter', () => {
      expect(store.loadingCounter()).toBe(0);

      httpClient.get(TEST_URL).subscribe();

      const req = httpMock.expectOne(TEST_URL);
      req.flush(TEST_DATA);

      expect(store.loadingCounter()).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Integration with finalize', () => {
    it('should decrement counter when subscriber unsubscribes', () => {
      expect(store.loadingCounter()).toBe(0);

      const subscription = httpClient.get(TEST_URL).subscribe();

      expect(store.loadingCounter()).toBe(1);

      const req = httpMock.expectOne(TEST_URL);

      subscription.unsubscribe();

      expect(store.loadingCounter()).toBe(0);

      expect(req.cancelled).toBe(true);
    });
  });
});
