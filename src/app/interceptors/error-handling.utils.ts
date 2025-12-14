import { HttpHeaders } from '@angular/common/http';
import { catchError, EMPTY, Observable } from 'rxjs';
import { HandledHttpError } from './error.interceptor';

/**
 * Utility to create HTTP headers that skip the global error interceptor.
 * Use this when your component needs to handle errors itself.
 *
 * @example
 * ```typescript
 * this.http.get('/api/data', { headers: skipGlobalErrorHandler() })
 *   .pipe(catchError(error => {
 *     // Handle error locally in component
 *     this.showCustomError(error);
 *     return EMPTY;
 *   }))
 *   .subscribe(data => console.log(data));
 * ```
 */
export function skipGlobalErrorHandler(): HttpHeaders {
  return new HttpHeaders({ 'X-Skip-Error-Interceptor': 'true' });
}

/**
 * Check if an error was already handled by the global error interceptor.
 * Useful for ErrorHandler implementations that want to avoid duplicate handling.
 *
 * @param error - The error to check
 * @returns true if the error was already handled by the interceptor
 *
 * @example
 * ```typescript
 * class GlobalErrorHandler implements ErrorHandler {
 *   handleError(error: any) {
 *     if (wasHandledByInterceptor(error)) {
 *       return; // Skip, already handled
 *     }
 *     // Handle the error...
 *   }
 * }
 * ```
 */
export function wasHandledByInterceptor(error: any): boolean {
  return (error as HandledHttpError)?.__wasHandledByInterceptor === true;
}

/**
 * Higher-order operator to handle errors silently at the component level.
 * Use this when you want to suppress errors without showing any message.
 *
 * @example
 * ```typescript
 * this.http.get('/api/optional-data')
 *   .pipe(handleErrorSilently())
 *   .subscribe(data => {
 *     if (data) console.log(data);
 *   });
 * ```
 */
export function handleErrorSilently<T>() {
  return (source: Observable<T>) =>
    source.pipe(
      catchError(() => {
        // Error is suppressed, return empty to complete the observable
        return EMPTY;
      })
    );
}

/**
 * Higher-order operator to handle errors with a custom callback.
 * Use this for component-specific error handling logic.
 *
 * @param callback - Function to execute when an error occurs
 * @param returnValue - Optional value to return instead of EMPTY
 *
 * @example
 * ```typescript
 * this.http.get<User>('/api/user')
 *   .pipe(
 *     handleErrorWith(
 *       (error) => this.userNotFound = true,
 *       { name: 'Guest', id: 0 } // fallback value
 *     )
 *   )
 *   .subscribe(user => this.user = user);
 * ```
 */
export function handleErrorWith<T>(
  callback: (error: any) => void,
  returnValue?: T
) {
  return (source: Observable<T>) =>
    source.pipe(
      catchError((error) => {
        callback(error);
        return returnValue !== undefined
          ? new Observable((subscriber) => {
              subscriber.next(returnValue);
              subscriber.complete();
            })
          : EMPTY;
      })
    );
}
