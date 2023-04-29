import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Transaction } from '../common';
import { selectTransactions } from '../store/tzkt.selectors';
import { ActivatedRoute } from '@angular/router';
import { TZKTActions } from '../store/tzkt.actions';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  transactions$: Observable<Transaction[]> =
    this.store.select(selectTransactions);

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.store.dispatch(
      TZKTActions.fetchTransactions({
        level: +(this.route.snapshot.paramMap.get('level')!!),
      })
    );
  }
}
