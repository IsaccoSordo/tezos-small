import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Block, Transaction } from '../common';

@Injectable({
  providedIn: 'root',
})
export class TzktService {
  constructor(private http: HttpClient) {}

  getBlocksCount(): Observable<number> {
    return this.http.get<number>('https://api.tzkt.io/v1/blocks/count');
  }

  getBlocks(limit: number, offset: number): Observable<Block[]> {
    const params = new HttpParams()
      .append('limit', limit)
      .append('offset.pg', offset)
      .append('sort.desc', 'level');
    return this.http.get<Block[]>('https://api.tzkt.io/v1/blocks', { params });
  }

  getTransactionsCount(level: number): Observable<number> {
    const params = new HttpParams().append('level', level);
    return this.http.get<number>(
      `https://api.tzkt.io/v1/operations/transactions/count`,
      { params }
    );
  }

  getTransactions(level: number): Observable<Transaction[]> {
    const params = new HttpParams().append('level', level);
    return this.http.get<Transaction[]>(
      `https://api.tzkt.io/v1/operations/transactions`,
      { params }
    );
  }
}
