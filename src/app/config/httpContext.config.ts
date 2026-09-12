import { HttpContextToken } from '@angular/common/http';
import { withCache } from '@ngneat/cashew';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

export const CACHE_TTL = 60000;

export const context = withCache({ ttl: CACHE_TTL });

export const contextNoLoading = withCache({ ttl: CACHE_TTL }).set(
  SKIP_LOADING,
  true
);
