import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserRecipeDetailPage } from './user-recipe-detail.page';

const routes: Routes = [
  {
    path: '',
    component: UserRecipeDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRecipeDetailPageRoutingModule {}
