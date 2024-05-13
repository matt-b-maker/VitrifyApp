import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeMakerPageRoutingModule } from './recipe-maker-routing.module';

import { RecipeMakerPage } from './recipe-maker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeMakerPageRoutingModule
  ],
  declarations: [RecipeMakerPage]
})
export class RecipeMakerPageModule {}
