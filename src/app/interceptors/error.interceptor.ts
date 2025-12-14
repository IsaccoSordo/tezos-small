import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { MessageService } from 'primeng/api';

/**
 * Custom error type that tracks whether the error was already handled by the interceptor.
 * This prevents duplicate error handling in components.
 */
export interface HandledHttpError extends HttpErrorResponse {
  __wasHandledByInterceptor?: boolean;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  /**
   * Check if the request wants to skip global error handling.
   * Components can add a header: { headers: { 'X-Skip-Error-Interceptor': 'true' } }
   * to handle errors themselves.
   */
  const skipInterceptor = req.headers.has('X-Skip-Error-Interceptor');

  /**
   * Extracts error message from backend response.
   * Tries common backend error message patterns.
   */
  const getBackendErrorMessage = (error: HttpErrorResponse): string | null =>
    error.error?.message ||
    error.error?.error?.message ||
    error.error?.reason ||
    error.error?.error ||
    (typeof error.error === 'string' ? error.error : null) ||
    error.message ||
    null;

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If component wants to handle the error itself, don't show global error
      if (skipInterceptor) {
        // Mark the error as intentionally unhandled and re-throw it
        const handledError = error as HandledHttpError;
        handledError.__wasHandledByInterceptor = false;
        throw error;
      }
      let errorMessage = 'An error occurred';
      let summary = 'HTTP Error';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message || 'A client error occurred';
        summary = 'Client Error';
      } else {
        // Server-side error - always try to get backend message first
        errorMessage =
          getBackendErrorMessage(error) ||
          'Server error. Please try again later.';
        summary = `Error ${error.status}`;
      }

      // Display error toast
      messageService.add({
        severity: 'error',
        summary: summary,
        detail: errorMessage,
        life: 5000,
      });

      // Log to console for debugging
      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        error: error,
      });

      // Mark the error as handled to prevent duplicate handling
      const handledError = error as HandledHttpError;
      handledError.__wasHandledByInterceptor = true;

      // Return EMPTY to complete the observable without propagating the error
      // This prevents components from breaking when they don't have error handling
      return EMPTY;
    })
  );
};
