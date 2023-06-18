import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { TZKTActions } from "../store/tzkt.actions";
import { Store } from "@ngrx/store";

@Injectable({
    providedIn: 'root',
  })
  export class ErrorService { 
    constructor(private store: Store) {}
    
    public handleError<T>(error: HttpErrorResponse, next: T): Observable<T> {
        let message = '';
    
        if (error.status === 0) {
          message = error.error;
        } else {
          message = `${error.status}: ${error.message}`;
        }

        this.store.dispatch(TZKTActions.storeError({ error: message }));

        return of(next);
      }
  }