import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Block, Transaction } from '../models';
import { cacheContext } from '../config/httpContext.config';
import { TZKT_API_BASE } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class BlocksService {
  private http = inject(HttpClient);

  getBlocksCount(): Observable<number> {
    return this.http.get<number>(`${TZKT_API_BASE}/blocks/count`, {
      context: cacheContext,
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
      context: cacheContext,
    });
  }

  getTransactionsCount(level: number): Observable<number> {
    return this.http.get<number>(
      `${TZKT_API_BASE}/operations/transactions/count`,
      {
        params: { level: level.toString() },
        context: cacheContext,
      }
    );
  }

  getTransactions(level: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${TZKT_API_BASE}/operations/transactions`,
      {
        params: { level: level.toString() },
        context: cacheContext,
      }
    );
  }
}
