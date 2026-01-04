import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  _route,
  state
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.waitForAuthReady().pipe(
    map((isAuthenticated) =>
      isAuthenticated
        ? true
        : router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url },
          })
    )
  );
};

export const guestGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService
    .waitForAuthReady()
    .pipe(
      map((isAuthenticated) =>
        !isAuthenticated ? true : router.createUrlTree(['/'])
      )
    );
};
