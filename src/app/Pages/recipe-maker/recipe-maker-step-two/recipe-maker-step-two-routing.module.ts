import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeMakerStepTwoPage } from './recipe-maker-step-two.page';

const routes: Routes = [
  {
    path: '',
    component: RecipeMakerStepTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeMakerStepTwoPageRoutingModule {}
