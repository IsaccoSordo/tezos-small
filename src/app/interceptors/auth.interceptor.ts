import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../auth/auth.store';
import { PROTECTED_API_PATTERNS } from '../config/auth.config';

/**
 * HTTP Interceptor that attaches Bearer token to protected API requests.
 *
 * Only adds the Authorization header to requests matching patterns
 * defined in PROTECTED_API_PATTERNS.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  const requiresAuth = PROTECTED_API_PATTERNS.some((pattern) =>
    req.url.includes(pattern)
  );

  if (!token || !requiresAuth) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
