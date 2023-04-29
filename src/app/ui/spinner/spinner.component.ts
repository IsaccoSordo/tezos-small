import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectLoadingCounter } from '../../store/tzkt.selectors';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  loadingCounter$ = this.store.select(selectLoadingCounter);

  constructor(private store: Store) {}
}
