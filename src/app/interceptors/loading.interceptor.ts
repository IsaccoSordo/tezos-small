import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Store } from '../store/tzkt.store';
import { SKIP_LOADING } from '../config/httpContext.config';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  if (req.context.get(SKIP_LOADING)) return next(req);

  store.incrementLoadingCounter();

  return next(req).pipe(
    finalize(() => {
      store.decrementLoadingCounter();
    })
  );
};
