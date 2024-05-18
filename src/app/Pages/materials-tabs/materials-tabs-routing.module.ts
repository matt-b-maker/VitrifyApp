import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaterialsTabsPage } from './materials-tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'public-materials',
    pathMatch: 'full'
  },
  {
    path: 'public-materials',
    loadChildren: () => import('../../Pages/materials-tabs/public-materials/public-materials.module').then( m => m.PublicMaterialsPageModule)
  },
  {
    path: 'custom-materials',
    loadChildren: () => import('../../Pages/materials-tabs/custom-materials/custom-materials.module').then( m => m.CustomMaterialsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaterialsTabsPageRoutingModule {}
