import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlocksOverviewComponent } from './blocks-overview/blocks-overview.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  {path: '', component: BlocksOverviewComponent},
  {path: 'details/:level', component: DetailsComponent},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
