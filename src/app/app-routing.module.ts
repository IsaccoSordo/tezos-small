import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlocksOverviewComponent } from './blocks-overview/blocks-overview.component';

const routes: Routes = [
  {path: '', component: BlocksOverviewComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
