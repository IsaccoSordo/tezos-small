import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Store } from '../store/tzkt.store';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  store.incrementLoadingCounter();

  return next(req).pipe(
    finalize(() => {
      store.decrementLoadingCounter();
    })
  );
};
