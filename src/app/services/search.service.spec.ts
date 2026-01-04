import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import { SearchService } from './search.service';
import { loadingInterceptor } from '../interceptors/loading.interceptor';
import { AccountSuggestion } from '../models';
import { TZKT_API_BASE } from '../config/api.config';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;

  const mockSuggestions: AccountSuggestion[] = [
    { alias: 'Plenty DEX', address: 'KT1abc123' },
    { alias: 'Quipuswap', address: 'KT1xyz789' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpCache(),
        provideHttpClient(
          withInterceptors([withHttpCacheInterceptor(), loadingInterceptor])
        ),
        provideHttpClientTesting(),
        SearchService,
      ],
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('suggestAccounts', () => {
    it('should fetch account suggestions', () => {
      let result: AccountSuggestion[] | undefined;
      service.suggestAccounts('plenty').subscribe((suggestions) => {
        result = suggestions;
      });

      const req = httpMock.expectOne(
        `${TZKT_API_BASE}/suggest/accounts/plenty`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockSuggestions);

      expect(result).toEqual(mockSuggestions);
    });

    it('should encode special characters in query', () => {
      service.suggestAccounts('test query').subscribe();

      const req = httpMock.expectOne(
        `${TZKT_API_BASE}/suggest/accounts/test%20query`
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should return empty array when no suggestions found', () => {
      let result: AccountSuggestion[] | undefined;
      service.suggestAccounts('xyz').subscribe((suggestions) => {
        result = suggestions;
      });

      const req = httpMock.expectOne(`${TZKT_API_BASE}/suggest/accounts/xyz`);
      req.flush([]);

      expect(result).toEqual([]);
    });
  });
});
