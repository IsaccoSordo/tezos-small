import { HttpInterceptorFn } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

/**
 * HTTP Interceptor that caches GET requests using shareReplay.
 *
 * This interceptor caches successful GET requests for a configurable time period.
 * Multiple subscribers to the same request will share a single HTTP call.
 *
 * Cache configuration:
 * - bufferSize: 1 (replay the last emitted value)
 * - refCount: true (automatically clean up when no subscribers)
 * - windowTime: 60000ms (60 seconds TTL)
 */

// Cache storage for observables
const cache = new Map<string, Observable<unknown>>();
const CACHE_TTL = 60000; // 60 seconds

/**
 * Generate a cache key from the request
 */
function getCacheKey(url: string): string {
  return url;
}

/**
 * Clear specific cache entry or entire cache
 */
export function clearHttpCache(url?: string): void {
  if (url) {
    cache.delete(url);
  } else {
    cache.clear();
  }
}

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  const cacheKey = getCacheKey(req.urlWithParams);

  // Check if we have a cached observable for this request
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  // Create a new observable with shareReplay and cache it
  const cached$ = next(req).pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
      windowTime: CACHE_TTL,
    }),
  );

  cache.set(cacheKey, cached$);

  return cached$;
};
