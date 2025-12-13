import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Store } from '../store/store.service';

/**
 * HTTP Interceptor that automatically manages the loading counter.
 *
 * This interceptor increments the loading counter when an HTTP request starts
 * and decrements it when the request completes (success or error).
 *
 * The counter-based approach ensures the loading indicator stays visible
 * until all concurrent requests have finished.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  // Increment loading counter when request starts
  store.state.loadingCounter.update((prev) => prev + 1);

  // Handle the request and decrement counter when it completes
  return next(req).pipe(
    finalize(() => {
      // Decrement loading counter when request completes (success or error)
      store.state.loadingCounter.update((prev) => prev - 1);
    })
  );
};
