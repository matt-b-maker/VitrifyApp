import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeMakerPage } from './recipe-maker.page';

const routes: Routes = [
  {
    path: '',
    component: RecipeMakerPage
  },
  {
    path: 'recipe-maker-step-one',
    loadChildren: () => import('../../Pages/recipe-maker/recipe-maker-step-one/recipe-maker-step-one.module').then( m => m.RecipeMakerStepOnePageModule)
  },
  {
    path: 'recipe-maker-step-one',
    loadChildren: () => import('../../Pages/recipe-maker/recipe-maker-step-one/recipe-maker-step-one.module').then( m => m.RecipeMakerStepOnePageModule)
  },
  {
    path: 'recipe-maker-step-two',
    loadChildren: () => import('../../Pages/recipe-maker/recipe-maker-step-two/recipe-maker-step-two.module').then( m => m.RecipeMakerStepTwoPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeMakerPageRoutingModule {}
