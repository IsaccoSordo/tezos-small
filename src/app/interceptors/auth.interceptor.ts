import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PROTECTED_API_PATTERNS } from '../config/auth.config';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token();

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
