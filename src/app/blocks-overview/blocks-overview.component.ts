import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectBlocks } from '../state/tzkt.selectors';
import { Block } from '../generic';
import { TZKTActions } from '../state/tzkt.actions';

@Component({
  selector: 'app-blocks-overview',
  templateUrl: './blocks-overview.component.html',
  styleUrls: ['./blocks-overview.component.scss']
})
export class BlocksOverviewComponent implements OnInit {
  blocks$: Observable<Block[]> = this.store.select(selectBlocks);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(TZKTActions.fetchBlocks());
  }
}
