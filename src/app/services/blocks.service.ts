import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { TZKT_API_BASE } from '../config/api.config';
import { context } from '../config/httpContext.config';
import type { Block, Transaction } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BlocksService {
  private http = inject(HttpClient);

  getBlocksCount(): Observable<number> {
    return this.http.get<number>(`${TZKT_API_BASE}/blocks/count`, {
      context,
    });
  }

  getBlocks(limit: number, offset: number): Observable<Block[]> {
    const validLimit = limit ?? 10;
    const validOffset = offset ?? 0;

    return this.http.get<Block[]>(`${TZKT_API_BASE}/blocks`, {
      params: {
        limit: validLimit.toString(),
        'offset.pg': validOffset.toString(),
        'sort.desc': 'level',
      },
      context,
    });
  }

  getTransactionsCount(level: number): Observable<number> {
    return this.http.get<number>(
      `${TZKT_API_BASE}/operations/transactions/count`,
      {
        params: { level: level.toString() },
        context,
      }
    );
  }

  getTransactions(level: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${TZKT_API_BASE}/operations/transactions`,
      {
        params: { level: level.toString() },
        context,
      }
    );
  }
}
