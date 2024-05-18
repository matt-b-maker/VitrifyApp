import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { CustomMaterialsPageRoutingModule } from './custom-materials-routing.module';

import { CustomMaterialsPage } from './custom-materials.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomMaterialsPageRoutingModule,
    RouterModule.forChild([
      {
        path: '',
        component: CustomMaterialsPage
      }
    ])
  ],
  declarations: [CustomMaterialsPage]
})
export class CustomMaterialsPageModule {}
