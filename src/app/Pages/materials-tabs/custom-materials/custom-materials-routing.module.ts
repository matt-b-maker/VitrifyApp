import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomMaterialsPage } from './custom-materials.page';

const routes: Routes = [
  {
    path: '',
    component: CustomMaterialsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomMaterialsPageRoutingModule {}
