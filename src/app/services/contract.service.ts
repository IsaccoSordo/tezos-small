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
import { context } from '../config/httpContext.config';
import { TZKT_API_BASE } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private http = inject(HttpClient);

  getContract(address: string): Observable<ContractInfo> {
    return this.http.get<ContractInfo>(
      `${TZKT_API_BASE}/contracts/${address}`,
      {
        context,
      }
    );
  }

  getContractEntrypoints(address: string): Observable<ContractEntrypoint[]> {
    return this.http.get<ContractEntrypoint[]>(
      `${TZKT_API_BASE}/contracts/${address}/entrypoints`,
      {
        context,
      }
    );
  }

  getContractStorage(address: string): Observable<ContractStorage> {
    return this.http.get<ContractStorage>(
      `${TZKT_API_BASE}/contracts/${address}/storage`,
      {
        context,
      }
    );
  }

  getContractInterface(address: string): Observable<ContractInterface> {
    return this.http.get<ContractInterface>(
      `${TZKT_API_BASE}/contracts/${address}/interface`,
      {
        context,
      }
    );
  }

  getContractViews(address: string): Observable<ContractView[]> {
    return this.http.get<ContractView[]>(
      `${TZKT_API_BASE}/contracts/${address}/views`,
      {
        context,
      }
    );
  }

  getContractEvents(
    address: string,
    limit: number,
    offset: number
  ): Observable<ContractEvent[]> {
    return this.http.get<ContractEvent[]>(`${TZKT_API_BASE}/contracts/events`, {
      params: {
        contract: address,
        limit: limit.toString(),
        offset: offset.toString(),
        'sort.desc': 'id',
      },
      context,
    });
  }

  getContractEventsCount(address: string): Observable<number> {
    return this.http.get<number>(`${TZKT_API_BASE}/contracts/events/count`, {
      params: {
        contract: address,
      },
      context,
    });
  }
}
