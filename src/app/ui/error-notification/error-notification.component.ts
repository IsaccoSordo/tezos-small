import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectError } from '../../store/tzkt.selectors';
import { TZKTActions } from 'src/app/store/tzkt.actions';

@Component({
  selector: 'app-error-notification',
  templateUrl: './error-notification.component.html',
  styleUrls: ['./error-notification.component.scss'],
})
export class ErrorNotificationComponent {
  errors$: Observable<string[]> = this.store.select(selectError);

  constructor(private store: Store) {}

  onClose(error: string) {
    this.store.dispatch(TZKTActions.clearError({ error }));
  }
}
