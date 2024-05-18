import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PublicMaterialsPage } from './public-materials.page';

const routes: Routes = [
  {
    path: '',
    component: PublicMaterialsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicMaterialsPageRoutingModule {}
