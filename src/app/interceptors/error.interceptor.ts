import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';
      let summary = 'HTTP Error';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
        summary = 'Client Error';
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = 'Unable to connect to server. Please check your internet connection.';
            summary = 'Connection Error';
            break;
          case 400:
            errorMessage = 'Bad request. Please check your input.';
            summary = 'Invalid Request';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            summary = 'Authentication Required';
            break;
          case 403:
            errorMessage = 'Access forbidden. You don\'t have permission.';
            summary = 'Access Denied';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            summary = 'Not Found';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            summary = 'Server Error';
            break;
          case 503:
            errorMessage = 'Service unavailable. Please try again later.';
            summary = 'Service Unavailable';
            break;
          default:
            errorMessage = error.error?.message || `Error: ${error.status} ${error.statusText}`;
            summary = `HTTP ${error.status}`;
        }
      }

      // Display error toast
      messageService.add({
        severity: 'error',
        summary: summary,
        detail: errorMessage,
        life: 5000
      });

      // Log to console for debugging
      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        error: error
      });

      // Re-throw the error so components can handle it if needed
      return throwError(() => error);
    })
  );
};
