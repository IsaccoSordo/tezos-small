import { Routes } from '@angular/router';

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
  { path: '**', redirectTo: '' },
];
