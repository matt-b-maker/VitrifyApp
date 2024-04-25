import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserRecipesPage } from './user-recipes.page';

const routes: Routes = [
  {
    path: '',
    component: UserRecipesPage
  },  {
    path: 'user-recipe-detail',
    loadChildren: () => import('../../Pages/user-recipes/user-recipe-detail/user-recipe-detail.module').then( m => m.UserRecipeDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRecipesPageRoutingModule {}
