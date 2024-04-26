import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeBuilderPage } from './recipe-builder.page';

const routes: Routes = [
  {
    path: '',
    component: RecipeBuilderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeBuilderPageRoutingModule {}
