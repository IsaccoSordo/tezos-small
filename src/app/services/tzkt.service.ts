import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Block } from '../common';

@Injectable({
  providedIn: 'root',
})
export class TzktService {
  constructor(private http: HttpClient) {}

  getBlocks(): Observable<Block[]> {
    return this.http
      .get<Block[]>('https://api.tzkt.io/v1/blocks');
  }
}
