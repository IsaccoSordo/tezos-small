import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AccountInfo,
  ContractInfo,
  AccountOperation,
  ContractEntrypoint,
  ContractStorage,
  ContractInterface,
  ContractView,
  TokenBalance,
  ContractEvent,
} from '../models/account.model';
import { cacheContext } from '../config/cache.config';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private readonly API_BASE = 'https://api.tzkt.io/v1';

  getAccount(address: string): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(`${this.API_BASE}/accounts/${address}`, {
      context: cacheContext,
    });
  }

  getContract(address: string): Observable<ContractInfo> {
    return this.http.get<ContractInfo>(
      `${this.API_BASE}/contracts/${address}`,
      {
        context: cacheContext,
      }
    );
  }

  getAccountOperations(
    address: string,
    limit: number,
    offset: number
  ): Observable<AccountOperation[]> {
    return this.http.get<AccountOperation[]>(
      `${this.API_BASE}/accounts/${address}/operations`,
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

  getAccountOperationsCount(address: string): Observable<number> {
    return this.http.get<number>(
      `${this.API_BASE}/accounts/${address}/operations/count`,
      {
        context: cacheContext,
      }
    );
  }

  getContractEntrypoints(address: string): Observable<ContractEntrypoint[]> {
    return this.http.get<ContractEntrypoint[]>(
      `${this.API_BASE}/contracts/${address}/entrypoints`,
      {
        context: cacheContext,
      }
    );
  }

  getContractStorage(address: string): Observable<ContractStorage> {
    return this.http.get<ContractStorage>(
      `${this.API_BASE}/contracts/${address}/storage`,
      {
        context: cacheContext,
      }
    );
  }

  getContractInterface(address: string): Observable<ContractInterface> {
    return this.http.get<ContractInterface>(
      `${this.API_BASE}/contracts/${address}/interface`,
      {
        context: cacheContext,
      }
    );
  }

  getContractViews(address: string): Observable<ContractView[]> {
    return this.http.get<ContractView[]>(
      `${this.API_BASE}/contracts/${address}/views`,
      {
        context: cacheContext,
      }
    );
  }

  getTokenBalances(
    address: string,
    limit: number,
    offset: number
  ): Observable<TokenBalance[]> {
    return this.http.get<TokenBalance[]>(`${this.API_BASE}/tokens/balances`, {
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
    return this.http.get<number>(`${this.API_BASE}/tokens/balances/count`, {
      params: {
        account: address,
        'balance.ne': '0',
      },
      context: cacheContext,
    });
  }

  getContractEvents(
    address: string,
    limit: number,
    offset: number
  ): Observable<ContractEvent[]> {
    return this.http.get<ContractEvent[]>(`${this.API_BASE}/contracts/events`, {
      params: {
        contract: address,
        limit: limit.toString(),
        offset: offset.toString(),
        'sort.desc': 'id',
      },
      context: cacheContext,
    });
  }

  getContractEventsCount(address: string): Observable<number> {
    return this.http.get<number>(`${this.API_BASE}/contracts/events/count`, {
      params: {
        contract: address,
      },
      context: cacheContext,
    });
  }
}
