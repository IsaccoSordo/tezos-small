import { withCache } from '@ngneat/cashew';
import { HttpContextToken } from '@angular/common/http';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

export const CACHE_TTL = 60000;

export const context = withCache({ ttl: CACHE_TTL });
