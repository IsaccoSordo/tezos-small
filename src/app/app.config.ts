import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  ErrorHandler,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { provideHttpCache, withHttpCacheInterceptor } from '@ngneat/cashew';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { routes } from './app.routes';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { GlobalErrorHandler } from './core/global-error.handler';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideHttpCache(),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
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
    }),
    MessageService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
