import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ContractInfo,
  ContractEntrypoint,
  ContractStorage,
  ContractInterface,
  ContractView,
  ContractEvent,
} from '../models/account.model';
import { cacheContext } from '../config/cache.config';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private http = inject(HttpClient);
  private readonly API_BASE = 'https://api.tzkt.io/v1';

  getContract(address: string): Observable<ContractInfo> {
    return this.http.get<ContractInfo>(
      `${this.API_BASE}/contracts/${address}`,
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
