import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  switchMap,
  map,
  of,
  from,
  mergeMap,
  tap,
  toArray,
} from 'rxjs';
import { Block, Transaction } from '../models';
import { cacheContext } from '../config/cache.config';

@Injectable({
  providedIn: 'root',
})
export class TzktService {
  private http = inject(HttpClient);
  private readonly API_BASE = 'https://api.tzkt.io/v1';

  getBlocksCount(): Observable<number> {
    return this.http.get<number>(`${this.API_BASE}/blocks/count`, {
      context: cacheContext,
    });
  }

  getBlocks(limit: number, offset: number): Observable<Block[]> {
    // Ensure parameters have valid values
    const validLimit = limit ?? 10;
    const validOffset = offset ?? 0;

    return this.http
      .get<Block[]>(`${this.API_BASE}/blocks`, {
        params: {
          limit: validLimit.toString(),
          'offset.pg': validOffset.toString(),
          'sort.desc': 'level',
        },
        context: cacheContext,
      })
      .pipe(
        switchMap((blocks) => {
          // Handle empty blocks case
          if (blocks.length === 0) {
            return of(blocks);
          }

          // Fetch transaction counts with concurrency limit of 5 to avoid rate limiting
          return from(blocks).pipe(
            mergeMap(
              (block) =>
                this.getTransactionsCount(block.level).pipe(
                  tap((count) => (block.transactions = count))
                ),
              5
            ),
            toArray(),
            map(() => blocks)
          );
        })
      );
  }

  getTransactionsCount(level: number): Observable<number> {
    return this.http.get<number>(
      `${this.API_BASE}/operations/transactions/count`,
      {
        params: { level: level.toString() },
        context: cacheContext,
      }
    );
  }

  getTransactions(level: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.API_BASE}/operations/transactions`,
      {
        params: { level: level.toString() },
        context: cacheContext,
      }
    );
  }
}
