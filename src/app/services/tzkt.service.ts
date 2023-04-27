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
    return this.http.get<Block[]>('https://api.tzkt.io/v1/blocks?limit=25&offset.pg=0').pipe( // todo ui limit
      switchMap((blocks) => {
        const newBlocks: Observable<Block>[] = blocks.map((block) => { 
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
