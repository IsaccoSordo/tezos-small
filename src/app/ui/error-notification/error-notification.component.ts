import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectError } from '../../store/tzkt.selectors';

@Component({
  selector: 'app-error-notification',
  templateUrl: './error-notification.component.html',
  styleUrls: ['./error-notification.component.scss']
})
export class ErrorNotificationComponent {
  error$: Observable<string> = this.store.select(selectError);
  
  constructor(private store: Store) {}
}
