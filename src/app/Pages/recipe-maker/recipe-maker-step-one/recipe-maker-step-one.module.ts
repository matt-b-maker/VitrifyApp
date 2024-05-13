import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipeMakerStepOnePageRoutingModule } from './recipe-maker-step-one-routing.module';

import { RecipeMakerStepOnePage } from './recipe-maker-step-one.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipeMakerStepOnePageRoutingModule
  ],
  declarations: [RecipeMakerStepOnePage]
})
export class RecipeMakerStepOnePageModule {}
