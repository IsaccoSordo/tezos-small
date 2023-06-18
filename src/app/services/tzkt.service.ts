import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { Block, Transaction } from '../common';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class TzktService {
  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getBlocksCount(): Observable<number> {
    return this.http
      .get<number>('https://api.tzkt.io/v1/blocks/count')
      .pipe(catchError((err) => this.errorService.handleError(err, 0)));
  }

  getBlocks(limit: number, offset: number): Observable<Block[]> {
    const params = new HttpParams()
      .append('limit', limit)
      .append('offset.pg', offset)
      .append('sort.desc', 'level');
    return this.http
      .get<Block[]>('https://api.tzkt.io/v1/blocks', { params })
      .pipe(
        catchError((err) => this.errorService.handleError<Block[]>(err, []))
      );
  }

  getTransactionsCount(level: number): Observable<number> {
    const params = new HttpParams().append('level', level);
    return this.http
      .get<number>(`https://api.tzkt.io/v1/operations/transactions/count`, {
        params,
      })
      .pipe(catchError((err) => this.errorService.handleError(err, 0)));
  }

  getTransactions(level: number): Observable<Transaction[]> {
    const params = new HttpParams().append('level', level);
    return this.http
      .get<Transaction[]>(`https://api.tzkt.io/v1/operations/transactions`, {
        params,
      })
      .pipe(
        catchError((err) =>
          this.errorService.handleError<Transaction[]>(err, [])
        )
      );
  }
}
