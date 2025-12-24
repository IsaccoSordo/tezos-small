import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private messageService = inject(MessageService);

  handleError(error: Error): void {
    console.error('Global error caught:', error);

    const message =
      error.message || 'An unexpected error occurred. Please try again.';

    this.messageService.add({
      severity: 'error',
      summary: 'Application Error',
      detail: message,
      life: 5000,
      sticky: false,
    });
  }
}
