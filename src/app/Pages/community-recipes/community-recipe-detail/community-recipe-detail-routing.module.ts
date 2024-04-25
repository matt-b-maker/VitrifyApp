import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityRecipeDetailPage } from './community-recipe-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CommunityRecipeDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRecipeDetailPageRoutingModule {}
