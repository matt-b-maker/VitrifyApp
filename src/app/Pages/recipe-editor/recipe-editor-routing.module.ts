import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeEditorPage } from './recipe-editor.page';

const routes: Routes = [
  {
    path: '',
    component: RecipeEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeEditorPageRoutingModule {}
