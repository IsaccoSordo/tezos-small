import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private messageService = inject(MessageService);

  handleError(error: Error): void {
    // Log to console for debugging
    console.error('Global error caught:', error);

    // Get user-friendly error message
    const message =
      error.message || 'An unexpected error occurred. Please try again.';

    // Display error toast
    this.messageService.add({
      severity: 'error',
      summary: 'Application Error',
      detail: message,
      life: 5000,
      sticky: false,
    });
  }
}
