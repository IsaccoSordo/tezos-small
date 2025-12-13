import { HttpInterceptorFn, HttpEvent } from '@angular/common/http';
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
 * - TTL: 60000ms (60 seconds)
 */

interface CacheEntry {
  observable: Observable<HttpEvent<unknown>>;
  timestamp: number;
}

// Cache storage for observables with timestamps
const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60000; // 60 seconds

/**
 * Generate a cache key from the request
 */
function getCacheKey(url: string): string {
  return url;
}

/**
 * Check if cache entry is still valid based on TTL
 *
 * @param entry The cache entry to validate
 */
function isCacheValid(entry: CacheEntry): boolean {
  const now = Date.now();
  return entry.timestamp + CACHE_TTL >= now;
}

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  const cacheKey = getCacheKey(req.urlWithParams);
  const now = Date.now();
  const entry = cache.get(cacheKey);

  // Check if we have a cached observable for this request
  if (entry && isCacheValid(entry)) {
    return entry.observable;
  }

  // If cache is stale, remove it
  if (entry) {
    cache.delete(cacheKey);
  }

  // Create a new observable with shareReplay and cache it with timestamp
  const cached$ = next(req).pipe(
    shareReplay({
      bufferSize: 1,
      refCount: true,
    }),
  );

  cache.set(cacheKey, {
    observable: cached$,
    timestamp: now,
  });

  return cached$;
};
