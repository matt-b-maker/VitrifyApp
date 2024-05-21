import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventoryPageRoutingModule } from './inventory-routing.module';

import { InventoryPage } from './inventory.page';
import { MaterialsSelectComponent } from 'src/app/Components/materials-select/materials-select.component';
import { SideMenuHeaderComponent } from 'src/app/Components/side-menu-header/side-menu-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventoryPageRoutingModule,
    MaterialsSelectComponent,
    SideMenuHeaderComponent
  ],
  declarations: [InventoryPage]
})
export class InventoryPageModule {}
