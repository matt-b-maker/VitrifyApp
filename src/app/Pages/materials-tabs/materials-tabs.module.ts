import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialsTabsPageRoutingModule } from './materials-tabs-routing.module';

import { MaterialsTabsPage } from './materials-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialsTabsPageRoutingModule
  ],
  declarations: [MaterialsTabsPage]
})
export class MaterialsTabsPageModule {}
