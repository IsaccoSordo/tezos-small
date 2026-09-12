import {
  provideHttpClient,
  withInterceptors,
  withXhr,
} from '@angular/common/http';
import {
  type ApplicationConfig,
  ErrorHandler,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/global-error.handler';
import { errorInterceptor } from './interceptors/error.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpCache(),
    provideHttpClient(
      withXhr(),
      withInterceptors([
        withHttpCacheInterceptor(),
        errorInterceptor,
        loadingInterceptor,
      ])
    ),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
          cssLayer: false,
        },
      },
      license: environment.primengLicense,
    }),
    MessageService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
