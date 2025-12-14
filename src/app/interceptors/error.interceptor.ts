import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  const getBackendErrorMessage = (error: HttpErrorResponse): string =>
    error.error?.message ||
    error.error?.error?.message ||
    error.error?.reason ||
    error.error?.error ||
    (typeof error.error === 'string' ? error.error : null) ||
    error.message ||
    'Server error. Please try again later.';

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = getBackendErrorMessage(error);
      let summary = `Error ${error.status}`;

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message || 'A client error occurred';
        summary = 'Client Error';
      }

      messageService.add({
        severity: 'error',
        summary: summary,
        detail: errorMessage,
        life: 5000,
      });

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url,
        error: error,
      });

      return EMPTY;
    })
  );
};
