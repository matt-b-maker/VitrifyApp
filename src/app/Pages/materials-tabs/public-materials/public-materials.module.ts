import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PublicMaterialsPageRoutingModule } from './public-materials-routing.module';

import { PublicMaterialsPage } from './public-materials.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicMaterialsPageRoutingModule,
    RouterModule.forChild([
      {
        path: '',
        component: PublicMaterialsPage
      }
    ])
  ],
  declarations: [PublicMaterialsPage]
})
export class PublicMaterialsPageModule {}
