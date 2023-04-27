import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Block } from '../common';

@Injectable({
  providedIn: 'root',
})
export class TzktService {
  constructor(private http: HttpClient) {}

  getBlocks(): Observable<Block[]> {
    return this.http.get<Block[]>('https://api.tzkt.io/v1/blocks').pipe(
      switchMap((blocks, i) => {
        const newBlocks: Observable<Block>[] = blocks.slice(0,25).map((block) => { // todo ui limit
          const params = new HttpParams().append('level', block.level);
          return this.http
            .get<number>(
              `https://api.tzkt.io/v1/operations/transactions/count`,
              { params }
            )
            .pipe(
              map((num) => ({
                ...block,
                transactions: num,
              }))
            );
        });

        return forkJoin(newBlocks);
      })
    );
  }
}
