import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blocks-overview/blocks-overview.component').then(
        (m) => m.BlocksOverviewComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'details/:level',
    loadComponent: () =>
      import('./details/details.component').then((m) => m.DetailsComponent),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
