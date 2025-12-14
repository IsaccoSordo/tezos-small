import { withCache } from '@ngneat/cashew';

/** Cache TTL in milliseconds (1 minute) */
export const CACHE_TTL = 60000;

/** Default cache context for HTTP requests */
export const cacheContext = withCache({ ttl: CACHE_TTL });
