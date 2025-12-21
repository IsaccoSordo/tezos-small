import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';
import {
  blocksResolver,
  blocksCountResolver,
  transactionsResolver,
} from './resolvers/tzkt.resolvers';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blocks-overview/blocks-overview.component').then(
        (m) => m.BlocksOverviewComponent
      ),
    resolve: {
      blocks: blocksResolver,
      count: blocksCountResolver,
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
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
    resolve: {
      transactions: transactionsResolver,
    },
  },
  { path: '**', redirectTo: '' },
];
