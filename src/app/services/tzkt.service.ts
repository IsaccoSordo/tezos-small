import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  tap,
  switchMap,
  map,
  of,
  from,
  mergeMap,
  toArray,
} from 'rxjs';
import { withCache } from '@ngneat/cashew';
import { Block, Transaction } from '../common';
import { Store } from '../store/store.service';

@Injectable({
  providedIn: 'root',
})
export class TzktService {
  private http = inject(HttpClient);
  private store = inject(Store);
  private readonly API_BASE = 'https://api.tzkt.io/v1';

  getBlocksCount(): Observable<number> {
    return this.http
      .get<number>(`${this.API_BASE}/blocks/count`, {
        context: withCache({ ttl: 10000 }),
      })
      .pipe(tap((count) => this.store.setCount(count)));
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
        context: withCache({ ttl: 30000 }),
      })
      .pipe(
        switchMap((blocks) => {
          // Handle empty blocks case
          if (blocks.length === 0) {
            this.store.setBlocks(blocks);
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
            tap(() => this.store.setBlocks(blocks)),
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
        context: withCache(),
      }
    );
  }

  getTransactions(level: number): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(`${this.API_BASE}/operations/transactions`, {
        params: { level: level.toString() },
        context: withCache(),
      })
      .pipe(tap((transactions) => this.store.setTransactions(transactions)));
  }
}
