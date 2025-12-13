import { Component, inject } from '@angular/core';
import { Store } from 'src/app/store/store.service';

@Component({
  selector: 'app-error-notification',
  templateUrl: './error-notification.component.html',
  styleUrls: ['./error-notification.component.scss'],
  standalone: false
})
export class ErrorNotificationComponent {
  store = inject(Store);
  errors = this.store.state.errors;

  onClose(index: number) {
    this.errors.update((prev) => {
      prev.splice(index, 1);
      return prev;
    });
  }
}
