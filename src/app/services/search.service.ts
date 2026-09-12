import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { TZKT_API_BASE } from '../config/api.config';
import { contextNoLoading } from '../config/httpContext.config';
import type { AccountSuggestion } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);

  suggestAccounts(query: string): Observable<AccountSuggestion[]> {
    return this.http.get<AccountSuggestion[]>(
      `${TZKT_API_BASE}/suggest/accounts/${encodeURIComponent(query)}`,
      { context: contextNoLoading }
    );
  }
}
