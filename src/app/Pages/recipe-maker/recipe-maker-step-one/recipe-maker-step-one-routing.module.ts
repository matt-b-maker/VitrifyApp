import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeMakerStepOnePage } from './recipe-maker-step-one.page';

const routes: Routes = [
  {
    path: '',
    component: RecipeMakerStepOnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeMakerStepOnePageRoutingModule {}
