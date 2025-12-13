import { ErrorHandler, Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private messageService = inject(MessageService);

  handleError(error: Error): void {
    // Log to console for debugging
    console.error('Global error caught:', error);

    // Get user-friendly error message
    const message = this.getUserFriendlyMessage(error);

    // Display error toast
    this.messageService.add({
      severity: 'error',
      summary: 'Application Error',
      detail: message,
      life: 5000,
      sticky: false,
    });
  }

  private getUserFriendlyMessage(error: Error): string {
    // Check for specific error types and provide friendly messages
    if (error.message.includes('network')) {
      return 'Network connection error. Please check your internet connection.';
    }

    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    // Default message
    return error.message || 'An unexpected error occurred. Please try again.';
  }
}
