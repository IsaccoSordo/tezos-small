import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from 'src/app/store/store.service';

@Component({
  selector: 'app-error-notification',
  templateUrl: './error-notification.component.html',
  styleUrls: ['./error-notification.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbAlertModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorNotificationComponent {
  store = inject(Store);
  errors = this.store.state.errors;

  onClose(index: number) {
    this.errors.update((prev) => prev.filter((_, i) => i !== index));
  }
}
