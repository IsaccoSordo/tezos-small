import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

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
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard],
  },
  {
    path: 'details/:level',
    loadComponent: () =>
      import('./details/details.component').then((m) => m.DetailsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'account/:address',
    loadComponent: () =>
      import('./account-explorer/account-explorer.component').then(
        (m) => m.AccountExplorerComponent
      ),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
