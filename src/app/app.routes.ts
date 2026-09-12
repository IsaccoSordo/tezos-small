import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blocks-overview/blocks-overview.component').then(
        (m) => m.BlocksOverviewComponent
      ),
  },
  {
    path: 'details/:level',
    loadComponent: () =>
      import('./details/details.component').then((m) => m.DetailsComponent),
  },
  {
    path: 'account/:address',
    loadComponent: () =>
      import('./account-explorer/account-explorer.component').then(
        (m) => m.AccountExplorerComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
