import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Block } from '../common';

@Injectable({
  providedIn: 'root',
})
export class TzktService {
  constructor(private http: HttpClient) {}

  getBlocks(limit: number, offset: number): Observable<Block[]> {
    const params = new HttpParams()
      .append('limit', limit)
      .append('offset.pg', offset);
    return this.http.get<Block[]>('https://api.tzkt.io/v1/blocks', { params });
  }

  getTransactions(level: number): Observable<number> {
    const params = new HttpParams().append('level', level);
    return this.http.get<number>(
      `https://api.tzkt.io/v1/operations/transactions/count`,
      { params }
    );
  }
}
