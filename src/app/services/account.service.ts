import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AccountInfo,
  AccountOperation,
  TokenBalance,
} from '../models/account.model';
import { cacheContext } from '../config/httpContext.config';
import { TZKT_API_BASE } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);

  getAccount(address: string): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(`${TZKT_API_BASE}/accounts/${address}`, {
      context: cacheContext,
    });
  }

  getAccountOperations(
    address: string,
    limit: number,
    offset: number
  ): Observable<AccountOperation[]> {
    return this.http.get<AccountOperation[]>(
      `${TZKT_API_BASE}/accounts/${address}/operations`,
      {
        params: {
          limit: limit.toString(),
          offset: offset.toString(),
          'sort.desc': 'id',
        },
        context: cacheContext,
      }
    );
  }

  getTokenBalances(
    address: string,
    limit: number,
    offset: number
  ): Observable<TokenBalance[]> {
    return this.http.get<TokenBalance[]>(`${TZKT_API_BASE}/tokens/balances`, {
      params: {
        account: address,
        'balance.ne': '0',
        limit: limit.toString(),
        offset: offset.toString(),
        'sort.desc': 'lastTime',
      },
      context: cacheContext,
    });
  }

  getTokenBalancesCount(address: string): Observable<number> {
    return this.http.get<number>(`${TZKT_API_BASE}/tokens/balances/count`, {
      params: {
        account: address,
        'balance.ne': '0',
      },
      context: cacheContext,
    });
  }
}
