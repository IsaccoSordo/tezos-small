import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountSuggestion } from '../models';
import { TZKT_API_BASE } from '../config/api.config';
import { cacheContext, SKIP_LOADING } from '../config/httpContext.config';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);

  suggestAccounts(query: string): Observable<AccountSuggestion[]> {
    return this.http.get<AccountSuggestion[]>(
      `${TZKT_API_BASE}/suggest/accounts/${encodeURIComponent(query)}`,
      { context: cacheContext.set(SKIP_LOADING, true) }
    );
  }
}
