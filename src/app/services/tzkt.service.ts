import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, of, tap } from 'rxjs';
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
    return this.http.get<number>(`${this.API_BASE}/blocks/count`).pipe(
      tap({
        next: (count) => this.store.state.count.set(count)
      }),
      catchError((error) => {
        this.store.state.errors.update((prev) => [...prev, { text: error.message }]);
        return of(0);
      })
    );
  }

  getBlocks(limit: number, offset: number): Observable<Block[]> {
    return this.http.get<Block[]>(`${this.API_BASE}/blocks`, {
      params: {
        limit: limit.toString(),
        'offset.pg': offset.toString(),
        'sort.desc': 'level'
      }
    }).pipe(
      tap({
        next: (blocks) => {
          // Fetch transaction counts for all blocks in parallel
          const transactionCounts$ = blocks.map((block) =>
            this.getTransactionsCount(block.level).pipe(
              tap({ next: (count) => block.transactions = count })
            )
          );

          // Subscribe to all transaction count requests
          forkJoin(transactionCounts$).subscribe();

          this.store.state.blocks.set(blocks);
        }
      }),
      catchError((error) => {
        this.store.state.errors.update((prev) => [...prev, { text: error.message }]);
        return of([]);
      })
    );
  }

  getTransactionsCount(level: number): Observable<number> {
    return this.http.get<number>(`${this.API_BASE}/operations/transactions/count`, {
      params: { level: level.toString() }
    }).pipe(
      catchError((error) => {
        this.store.state.errors.update((prev) => [...prev, { text: error.message }]);
        return of(0);
      })
    );
  }

  getTransactions(level: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.API_BASE}/operations/transactions`, {
      params: { level: level.toString() }
    }).pipe(
      tap({
        next: (transactions) => this.store.state.transactions.set(transactions)
      }),
      catchError((error) => {
        this.store.state.errors.update((prev) => [...prev, { text: error.message }]);
        return of([]);
      })
    );
  }
}
