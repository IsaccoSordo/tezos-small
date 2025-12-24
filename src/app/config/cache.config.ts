import { withCache } from '@ngneat/cashew';

export const CACHE_TTL = 60000;

export const cacheContext = withCache({ ttl: CACHE_TTL });
