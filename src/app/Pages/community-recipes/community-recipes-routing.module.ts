import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityRecipesPage } from './community-recipes.page';

const routes: Routes = [
  {
    path: '',
    component: CommunityRecipesPage
  },  {
    path: 'community-recipe-detail',
    loadChildren: () => import('../../Pages/community-recipes/community-recipe-detail/community-recipe-detail.module').then( m => m.CommunityRecipeDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRecipesPageRoutingModule {}
