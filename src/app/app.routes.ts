import { Routes } from '@angular/router';
import { BlocksOverviewComponent } from './blocks-overview/blocks-overview.component';
import { DetailsComponent } from './details/details.component';

export const routes: Routes = [
  { path: '', component: BlocksOverviewComponent },
  { path: 'details/:level', component: DetailsComponent },
  { path: '**', redirectTo: '' },
];
